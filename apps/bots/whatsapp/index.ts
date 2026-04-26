import express, { Request, Response } from 'express';
import twilio from 'twilio';
import { Redis } from 'ioredis';
import { prisma } from '@bitremit/database';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config({ path: '../../.env.local' });

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(`[WhatsApp] Incoming ${req.method} request to ${req.url}`);
    next();
});

// Setup Redis
const getRedisConnection = () => {
    const url = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;
    if (!url || !token) throw new Error('Missing Upstash Redis configuration');
    
    // Upstash HTTPS URL -> rediss:// TCP URL
    const host = url.replace('https://', '');
    return new Redis(`rediss://default:${token}@${host}:6379`, {
        maxRetriesPerRequest: null,
    });
};
const redis = getRedisConnection();

const PORT = 3004;
const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Helper to generate a token that perfectly mimics our authMiddleware
function generateUserToken(address: string, userId: string) {
    return jwt.sign({ address, sub: userId }, JWT_SECRET, { expiresIn: '1h' });
}

// Ensure the caller is genuinely Twilio
function validateTwilioRequest(req: Request, res: Response, next: express.NextFunction) {
    const twilioSignature = req.headers['x-twilio-signature'] as string;
    
    // In Express, req.originalUrl includes the query string which is correct for Twilio validation
    const forwardedHost = req.headers['x-forwarded-host'];
    const host = forwardedHost ? forwardedHost : req.get('host');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    let url = process.env.TWILIO_WEBHOOK_URL || `${protocol}://${host}${req.originalUrl}`;
    
    // Fallback logic for localhost testing via browser GET without ngrok mappings
    if (!twilioSignature && req.method === 'GET') {
        return res.status(200).send('BitRemit WhatsApp Bot is Online (GET test successful). Please ensure Twilio is configured to use POST or pass valid signatures.');
    }

    const params = req.method === 'POST' ? req.body : req.query;
    
    // Skip auth token check if we are in local dev and explicitly ignoring it
    if (!process.env.TWILIO_AUTH_TOKEN) {
        console.warn('[WhatsApp] Missing TWILIO_AUTH_TOKEN, skipping signature validation.');
        return next();
    }
    
    const isValid = twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN,
        twilioSignature,
        url,
        params as Record<string, any>
    );
    
    if (isValid) {
        console.log(`[WhatsApp] Twilio signature validation passed for: ${url}`);
        next();
    } else {
        console.error(`[WhatsApp] Invalid Twilio Signature computed for URL: ${url}`);
        res.status(403).send('Forbidden');
    }
}

// Apply rate limiting
async function rateLimitCheck(phoneNumber: string): Promise<boolean> {
    const key = `whatsapp:ratelimit:${phoneNumber}`;
    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, 60); // 1 minute TTL
    }
    return count <= 5;
}

app.all('/webhook/twilio', validateTwilioRequest, async (req: Request, res: Response) => {
    const twiml = new twilio.twiml.MessagingResponse();
    
    try {
        const payload = req.method === 'POST' ? req.body : req.query;
        const fromHeader = (payload.From as string) || '';
        // "whatsapp:+1234567890" -> "+1234567890"
        const phoneNumber = fromHeader.replace('whatsapp:', '');
        const bodyText = ((payload.Body as string) || '').trim();
        const commandText = bodyText.toUpperCase();

        if (!phoneNumber) {
            return res.status(400).send('No sender information');
        }

        // 1. Rate Limit
        const isUnderLimit = await rateLimitCheck(phoneNumber);
        if (!isUnderLimit) {
            twiml.message("Rate limit exceeded. Please wait a minute and try again.");
            res.type('text/xml').send(twiml.toString());
            return;
        }

        // 2. Fetch User
        const user = await prisma.user.findUnique({
            where: { phoneNumber }
        });

        if (!user) {
            twiml.message("Connect your wallet first: https://bitremit.vercel.app");
            res.type('text/xml').send(twiml.toString());
            return;
        }

        const sessionKey = `whatsapp:session:${phoneNumber}`;
        // Read active state
        let sessionData = await redis.get(sessionKey);
        let session = sessionData ? JSON.parse(sessionData) : { state: 'IDLE' };

        // 3. Command Routing & State Machine
        if (commandText === 'HI' || commandText === 'START' || commandText === 'HELLO' || commandText === 'MENU') {
            await redis.del(sessionKey);
            twiml.message(
                "Welcome to BitRemit WhatsApp Bot! 🌍\n\n" +
                "Available commands:\n" +
                "🏦 *BALANCE* - Check your MUSD and collateral balance\n" +
                "💸 *SEND* - Start a new remittance\n" +
                "🔍 *STATUS* {ref} - Check a transfer status\n" +
                "❓ *HELP* - Show this menu"
            );
        }
        else if (commandText === 'HELP') {
            twiml.message(
                "BitRemit Commands:\n" +
                "🏦 *BALANCE* - Check your balances\n" +
                "💸 *SEND* - Follow the prompts to send funds to friends & family.\n" +
                "🔍 *STATUS <ref>* - E.g. 'STATUS 123'. Checks progress of an active payout."
            );
        }
        else if (commandText === 'BALANCE') {
            // Need internal API call with JWT
            const token = generateUserToken(user.address, user.id);
            const apiRes = await fetch(`${API_URL}/api/vault`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (apiRes.ok) {
                const data: any = await apiRes.json();
                const btc = parseFloat(data.collateralAmount || "0").toFixed(4);
                const musd = parseFloat(data.borrowedMUSD || "0").toFixed(2);
                const ratio = parseFloat(data.collateralRatio || "0") * 100;
                twiml.message(`Your MUSD Balance: ${musd} MUSD | BTC Locked: ${btc} BTC | Ratio: ${ratio.toFixed(0)}%`);
            } else {
                twiml.message("Sorry, I couldn't fetch your balance right now. Try again later.");
            }
        }
        else if (commandText.startsWith('STATUS ')) {
            const ref = bodyText.split(' ')[1];
            if (!ref) {
                twiml.message("Please provide a reference ID. E.g. 'STATUS 123'");
            } else {
                const token = generateUserToken(user.address, user.id);
                const apiRes = await fetch(`${API_URL}/api/remittance/${ref}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (apiRes.ok) {
                    const data: any = await apiRes.json();
                    twiml.message(`Transfer ${ref}: ${data.status} — ${data.recipient.phoneNumber} ${data.fiatAmount} ${data.fiatCurrency}`);
                } else if (apiRes.status === 404) {
                    twiml.message(`Transfer ${ref} not found.`);
                } else {
                    twiml.message("Couldn't fetch the status. Try again later.");
                }
            }
        }
        else if (commandText === 'SEND' || session.state !== 'IDLE') {
            // Handle State Machine for SEND flow
            if (commandText === 'SEND') {
                session = { state: 'AWAITING_RECIPIENT' };
                await redis.setex(sessionKey, 600, JSON.stringify(session)); // 10 minutes TTL
                
                twiml.message("Who do you want to send to? Enter their phone number (e.g. +234 803 555 1234):");
            }
            else if (session.state === 'AWAITING_RECIPIENT') {
                // Remove whitespaces to validate E.164 roughly
                const recipientPhone = bodyText.replace(/\s+/g, '');
                
                const phoneRegex = /^\+[1-9]\d{9,14}$/;
                
                if (phoneRegex.test(recipientPhone)) {
                    // Check if recipient exists in the system
                    const recipientObj = await prisma.recipient.findUnique({
                        where: { phoneNumber: recipientPhone }
                    });
                    
                    if (!recipientObj) {
                        twiml.message(`The recipient ${recipientPhone} is not registered yet. Please add them via the web app bridging portal first.`);
                    } else {
                        session.state = 'AWAITING_AMOUNT';
                        session.recipient = recipientPhone;
                        session.recipientId = recipientObj.id;
                        session.railType = recipientObj.paymentRail;
                        await redis.setex(sessionKey, 600, JSON.stringify(session));
                        
                        twiml.message("How much USD do you want to send?");
                    }
                } else {
                    twiml.message("Invalid phone number format. Please provide a valid E.164 phone number (e.g. +2348035551234):");
                }
            }
            else if (session.state === 'AWAITING_AMOUNT') {
                const amount = parseFloat(bodyText);
                if (isNaN(amount) || amount <= 0) {
                    twiml.message("Please enter a valid amount greater than 0 (e.g. 50):");
                } else {
                    const fee = amount * 0.01;
                    const totalDeducted = amount + fee;
                    // Mock local rate conversion for illustration
                    const mxRate = session.railType === 'MPESA' ? 130 : 
                                   session.railType === 'GCASH' ? 55 : 
                                   session.railType === 'MTNMOMO' ? 12 : 1;
                    
                    const localAmount = (amount * mxRate).toFixed(2);
                    const localCurrency = session.railType === 'MPESA' ? 'KES' : 
                                          session.railType === 'GCASH' ? 'PHP' : 
                                          session.railType === 'MTNMOMO' ? 'GHS' : 'USD';
                    
                    session.state = 'CONFIRMING';
                    session.amount = amount;
                    
                    await redis.setex(sessionKey, 600, JSON.stringify(session));
                    
                    twiml.message(`You are sending ${amount} USD to ${session.recipient}.\n\nFee: ${fee.toFixed(2)} USD\nTotal Deduction: ${totalDeducted.toFixed(2)} MUSD\nThey will receive: ~${localAmount} ${localCurrency}\n\nReply YES to confirm or NO to cancel.`);
                }
            }
            else if (session.state === 'CONFIRMING') {
                if (commandText === 'YES') {
                    // Send to internal API
                    const token = generateUserToken(user.address, user.id);
                    
                    const payload = {
                        recipientId: session.recipientId,
                        amount: session.amount.toString(),
                        railType: session.railType
                    };
                    
                    const apiRes = await fetch(`${API_URL}/api/remittance`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if (apiRes.ok) {
                        const data: any = await apiRes.json();
                        await redis.del(sessionKey);
                        const ref = data.txHash ? data.txHash.slice(0, 10) : data.transactionId || 'N/A';
                        twiml.message(`✅ Transfer sent! Ref: ${ref}\nTrack status: STATUS ${ref}`);
                    } else {
                        const errorData: any = await apiRes.json().catch(() => ({}));
                        await redis.del(sessionKey);
                        twiml.message(`❌ Transfer failed: ${errorData.error || 'Server error'}`);
                    }
                } else if (commandText === 'NO') {
                    await redis.del(sessionKey);
                    twiml.message("Cancelled.");
                } else {
                    twiml.message("Reply YES to confirm or NO to cancel.");
                }
            }
        }
        else {
            twiml.message("I didn't understand that. Text HELP to see available commands.");
        }
        
    } catch (error) {
        console.error('[WhatsApp] Webhook Error:', error);
        twiml.message("An internal error occurred. Please try again.");
    }
    
    // Always return the Twilio correctly formatted XML response
    res.type('text/xml').send(twiml.toString());
});

app.listen(PORT, () => {
    console.log(`[WhatsApp Bot] Listening on http://localhost:${PORT}/webhook/twilio`);
});
