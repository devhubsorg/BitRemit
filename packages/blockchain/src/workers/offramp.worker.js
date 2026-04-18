import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { prisma } from '@bitremit/database';
import twilio from 'twilio';
import { formatUnits } from 'viem';
/**
 * BullMQ Off-ramp Worker for BitRemit
 * This worker processes jobs from the 'process-offramp' queue.
 * It interacts with various payment rail mock-servers (MPESA, GCASH, MTNMOMO)
 * and notifies recipients via Twilio SMS upon successful payout.
 */
// Helper to construct a standard Redis protocol URL for Ioredis from Upstash environment variables
const getRedisConnection = () => {
    const url = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;
    if (!url || !token)
        throw new Error('Missing Upstash Redis configuration');
    // Upstash HTTPS URL -> rediss:// TCP URL
    const host = url.replace('https://', '');
    return new Redis(`rediss://default:${token}@${host}:6379`, {
        maxRetriesPerRequest: null,
    });
};
const connection = getRedisConnection();
// Initialise Twilio client (Safe fallback if SID is missing)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID !== 'AC_YOUR_TWILIO_SID'
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;
if (!twilioClient) {
    console.warn('[Worker] Twilio SID missing. SMS notifications will be LOGGED to console but not sent.');
}
/**
 * The core worker logic
 */
const offrampWorker = new Worker('process-offramp', async (job) => {
    const { txId, railType, amount } = job.data;
    let { recipientPhone } = job.data;
    console.log(`[Worker] Started processing job ${job.id} for transaction ${txId}`);
    // 1. Fetch Transaction with related entities
    const transaction = await prisma.transaction.findUnique({
        where: { id: txId },
        include: {
            sender: true,
            recipient: true
        }
    });
    if (!transaction) {
        throw new Error(`Transaction with ID ${txId} not found in database.`);
    }
    // Fallback for recipient phone if not provided in job data
    if (!recipientPhone) {
        recipientPhone = transaction.recipient.phoneNumber;
    }
    let railReference = '';
    let success = false;
    // Convert the bigint string back to a float for the mock APIs
    const floatAmount = parseFloat(formatUnits(BigInt(amount), 18));
    // 2. Route to appropriate payment rail mock-server
    try {
        if (railType === 'MPESA') {
            const response = await fetch(`${process.env.MPESA_MOCK_URL}/api/pay`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: floatAmount,
                    phoneNumber: recipientPhone,
                    reference: `BR-${txId.slice(0, 8)}`
                })
            });
            const data = await response.json();
            if (data.ResponseCode === '0') {
                success = true;
                railReference = data.CheckoutRequestID || data.MerchantRequestID;
            }
            else {
                throw new Error(`MPESA Payout Failed: ${data.ResponseDescription}`);
            }
        }
        else if (railType === 'GCASH') {
            const response = await fetch(`${process.env.GCASH_MOCK_URL}/v1/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: floatAmount,
                    mobileNumber: recipientPhone,
                    referenceId: txId
                })
            });
            const data = await response.json();
            if (data.status === 'PENDING' || data.status === 'COMPLETED') {
                success = true;
                railReference = data.paymentId;
            }
            else {
                throw new Error(`GCASH Payout Failed: ${data.message}`);
            }
        }
        else if (railType === 'MTNMOMO') {
            const response = await fetch(`${process.env.MTNMOMO_MOCK_URL}/v1_0/transfer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: floatAmount,
                    currency: 'GHS',
                    externalId: txId,
                    payee: {
                        partyIdType: 'MSISDN',
                        partyId: recipientPhone
                    }
                })
            });
            const data = await response.json();
            if (data.status === 'PENDING' || data.status === 'COMPLETED') {
                success = true;
                railReference = data.paymentId;
            }
            else {
                throw new Error(`MTNMOMO Payout Failed: ${data.message}`);
            }
        }
        if (success) {
            // 3. Update Transaction to COMPLETED status
            await prisma.transaction.update({
                where: { id: txId },
                data: {
                    status: 'COMPLETED',
                    railReference: railReference,
                    completedAt: new Date()
                }
            });
            // 4. Send Twilio SMS Notification to recipient
            const recipientName = transaction.recipient.name;
            const senderDisplay = transaction.sender.address.slice(0, 6) + '...' + transaction.sender.address.slice(-4);
            const smsMessage = `BitRemit: Hello ${recipientName}, you have received ${transaction.fiatAmount} ${transaction.fiatCurrency} from ${senderDisplay}. Ref: ${railReference}`;
            try {
                if (twilioClient) {
                    await twilioClient.messages.create({
                        body: smsMessage,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: recipientPhone
                    });
                    console.log(`[Worker] SMS sent to ${recipientPhone}`);
                }
                else {
                    console.log(`[SIMULATED SMS] TO: ${recipientPhone} | MSG: ${smsMessage}`);
                }
            }
            catch (smsError) {
                console.error('[Worker] Failed to send SMS:', smsError);
                // We don't throw here to avoid retrying the payment itself just because SMS failed
            }
            console.log(`[Worker] Transaction ${txId} marked as COMPLETED.`);
        }
    }
    catch (error) {
        console.error(`[Worker] Error processing job ${job.id}:`, error.message);
        // Mark transaction as FAILED in DB if the error is terminal or after some retries
        // For now, we throw the error to let BullMQ handle the retry logic
        throw error;
    }
}, {
    connection,
    concurrency: 5,
    // Exponential backoff strategy configured in startWorker (Default for the queue)
});
/**
 * Handle worker lifecycle events
 */
offrampWorker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully.`);
});
offrampWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
});
/**
 * Exported function to start the worker process
 */
export async function startWorker() {
    console.log('[Worker] Off-ramp worker started and listening to "process-offramp" queue...');
    // The worker starts automatically upon instantiation, but we can manage it here if needed.
}
// Auto-run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.endsWith('offramp.worker.ts')) {
    startWorker().catch(console.error);
}
