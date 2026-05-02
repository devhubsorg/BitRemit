import { Worker } from "bullmq";
import { Redis } from "ioredis";
import { prisma } from "@bitremit/database";
import twilio from "twilio";
import { formatUnits } from "viem";
/**
 * BullMQ Off-ramp Worker for BitRemit
 * This worker processes jobs from the 'process-offramp' queue.
 * It interacts with various payment rail mock-servers (MPESA, GCASH, MTNMOMO)
 * and notifies recipients via Twilio SMS upon successful payout.
 */
// Helper to construct a standard Redis protocol URL for Ioredis from Upstash environment variables
const getRedisConnection = () => {
    const rawUrl = process.env.UPSTASH_REDIS_URL;
    const token = process.env.UPSTASH_REDIS_TOKEN;
    if (!rawUrl || !token)
        throw new Error("Missing Upstash Redis configuration");
    let host;
    let port = 6379;
    let useTls = true;
    if (rawUrl.startsWith("redis://") || rawUrl.startsWith("rediss://")) {
        const parsed = new URL(rawUrl);
        host = parsed.hostname;
        port = parsed.port ? Number(parsed.port) : 6379;
        useTls = parsed.protocol === "rediss:";
    }
    else {
        // Upstash REST URL format: https://<host>
        const parsed = new URL(rawUrl);
        host = parsed.hostname;
        useTls = true;
    }
    return new Redis({
        host,
        port,
        username: "default",
        password: token,
        tls: useTls ? {} : undefined,
        maxRetriesPerRequest: null,
    });
};
// Initialise Twilio client (Safe fallback if SID is missing)
const twilioClient = process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_ACCOUNT_SID !== "AC_YOUR_TWILIO_SID"
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;
if (!twilioClient) {
    console.warn("[Worker] Twilio SID missing. SMS notifications will be LOGGED to console but not sent.");
}
async function processOfframpJob(job) {
    const { txId, railType, amount } = job.data;
    let { recipientPhone } = job.data;
    console.log(`[Worker] Started processing job ${job.id} for transaction ${txId}`);
    // 1. Fetch Transaction with related entities
    const transaction = await prisma.transaction.findUnique({
        where: { id: txId },
        include: {
            sender: true,
            recipient: true,
        },
    });
    if (!transaction) {
        throw new Error(`Transaction with ID ${txId} not found in database.`);
    }
    // Fallback for recipient phone if not provided in job data
    if (!recipientPhone) {
        recipientPhone = transaction.recipient.phoneNumber;
    }
    let railReference = "";
    let success = false;
    // Convert the bigint string back to a float for the mock APIs
    const floatAmount = parseFloat(formatUnits(BigInt(amount), 18));
    // 2. Route to appropriate payment rail mock-server
    try {
        if (railType === "MPESA") {
            const response = await fetch(`${process.env.MPESA_MOCK_URL}/api/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: floatAmount,
                    phoneNumber: recipientPhone,
                    reference: `BR-${txId.slice(0, 8)}`,
                }),
            });
            const data = await response.json();
            if (data.ResponseCode === "0") {
                success = true;
                railReference = data.CheckoutRequestID || data.MerchantRequestID;
            }
            else {
                throw new Error(`MPESA Payout Failed: ${data.ResponseDescription}`);
            }
        }
        else if (railType === "GCASH") {
            const response = await fetch(`${process.env.GCASH_MOCK_URL}/v1/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: floatAmount,
                    mobileNumber: recipientPhone,
                    referenceId: txId,
                }),
            });
            const data = await response.json();
            if (data.status === "PENDING" || data.status === "COMPLETED") {
                success = true;
                railReference = data.paymentId;
            }
            else {
                throw new Error(`GCASH Payout Failed: ${data.message}`);
            }
        }
        else if (railType === "MTNMOMO") {
            const response = await fetch(`${process.env.MTNMOMO_MOCK_URL}/v1_0/transfer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: floatAmount,
                    currency: "GHS",
                    externalId: txId,
                    payee: {
                        partyIdType: "MSISDN",
                        partyId: recipientPhone,
                    },
                }),
            });
            const data = await response.json();
            if (data.status === "PENDING" || data.status === "COMPLETED") {
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
                    status: "COMPLETED",
                    railReference: railReference,
                    completedAt: new Date(),
                },
            });
            // 4. Send Twilio SMS Notification to recipient
            const recipientName = transaction.recipient.name;
            const senderDisplay = transaction.sender.address.slice(0, 6) +
                "..." +
                transaction.sender.address.slice(-4);
            const smsMessage = `BitRemit: Hello ${recipientName}, you have received ${transaction.fiatAmount} ${transaction.fiatCurrency} from ${senderDisplay}. Ref: ${railReference}`;
            try {
                if (twilioClient) {
                    await twilioClient.messages.create({
                        body: smsMessage,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: recipientPhone,
                    });
                    console.log(`[Worker] SMS sent to ${recipientPhone}`);
                }
                else {
                    console.log(`[SIMULATED SMS] TO: ${recipientPhone} | MSG: ${smsMessage}`);
                }
            }
            catch (smsError) {
                console.error("[Worker] Failed to send SMS:", smsError);
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
}
let offrampWorker = null;
function createWorker() {
    const worker = new Worker("process-offramp", processOfframpJob, {
        connection: getRedisConnection(),
        concurrency: 5,
        // Exponential backoff strategy configured in queue job options.
    });
    worker.on("completed", (job) => {
        console.log(`[Worker] Job ${job.id} completed successfully.`);
    });
    worker.on("failed", (job, err) => {
        console.error(`[Worker] Job ${job?.id} failed: ${err.message}`);
    });
    // Prevent process crashes from unhandled worker-level errors.
    worker.on("error", (err) => {
        console.error("[Worker] Worker runtime error:", err);
    });
    return worker;
}
/**
 * Exported function to start the worker process
 */
export async function startWorker() {
    if (offrampWorker) {
        console.log("[Worker] Off-ramp worker already running.");
        return;
    }
    try {
        offrampWorker = createWorker();
        console.log('[Worker] Off-ramp worker started and listening to "process-offramp" queue...');
    }
    catch (error) {
        // Do not crash the whole service on worker bootstrap errors.
        console.error("[Worker] Failed to start worker:", error);
        console.error("[Worker] Check UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN in Railway service variables.");
    }
}
// Auto-run if executed directly
if (import.meta.url.endsWith(process.argv[1]) ||
    process.argv[1]?.endsWith("offramp.worker.ts")) {
    startWorker().catch(console.error);
}
