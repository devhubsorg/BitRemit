import { fileURLToPath } from "node:url";
import { createPublicClient, http, parseEventLogs, defineChain, formatUnits, } from "viem";
import { prisma } from "@bitremit/database";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import BitRemitVaultABI from "../../web3/src/abis/BitRemitVault.json" with { type: "json" };
import RemittanceRouterABI from "../../web3/src/abis/RemittanceRouter.json" with { type: "json" };
const vaultAbi = BitRemitVaultABI;
const routerAbi = RemittanceRouterABI;
// Define Mezo Testnet Chain
const mezoTestnet = defineChain({
    id: 31611,
    name: "Mezo Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Bitcoin",
        symbol: "BTC",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.test.mezo.org"],
        },
    },
    blockExplorers: {
        default: { name: "Explorer", url: "https://explorer.test.mezo.org" },
    },
});
const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS;
const DEPLOY_BLOCK_NUMBER = BigInt(process.env.DEPLOY_BLOCK_NUMBER || "0");
// BullMQ / Redis Connection setup
// Converts the Upstash HTTPS URL to a rediss:// format for ioredis
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
let _offrampQueue;
const getOfframpQueue = () => {
    if (!_offrampQueue) {
        _offrampQueue = new Queue("process-offramp", {
            connection: getRedisConnection(),
        });
    }
    return _offrampQueue;
};
const publicClient = createPublicClient({
    chain: mezoTestnet,
    transport: http(),
});
// Reorg detection state
const blockHashCache = new Map();
const REORG_LOOKBACK = 20;
let intervalId = null;
let isPolling = false;
// Helpers for Fiat conversion
const calculateFiat = (amount, railType) => {
    const amt = Number(formatUnits(amount, 18));
    if (railType === "MPESA")
        return amt * 130; // 1 mUSD = 130 KES
    if (railType === "GCASH")
        return amt * 55; // 1 mUSD = 55 PHP
    return amt; // Default 1:1 for mocks
};
const getCurrency = (railType) => {
    if (railType === "MPESA")
        return "KES";
    if (railType === "GCASH")
        return "PHP";
    return "USD";
};
async function syncEvents() {
    if (isPolling)
        return;
    isPolling = true;
    try {
        // 1. Read IndexerState
        const state = await prisma.indexerState.upsert({
            where: { id: "singleton" },
            update: {},
            create: { lastBlock: Number(DEPLOY_BLOCK_NUMBER) },
        });
        const fromBlock = BigInt(state.lastBlock) + 1n;
        const latestBlock = await publicClient.getBlockNumber();
        const MAX_CHUNK_SIZE = 10000n;
        let toBlock = fromBlock + MAX_CHUNK_SIZE;
        if (toBlock > latestBlock)
            toBlock = latestBlock;
        if (fromBlock > latestBlock) {
            isPolling = false;
            return;
        }
        // Reorg Detection
        const blocksToCheck = Array.from(blockHashCache.keys()).filter((b) => b > Number(fromBlock) - REORG_LOOKBACK);
        for (const b of blocksToCheck) {
            const block = await publicClient.getBlock({ blockNumber: BigInt(b) });
            if (block.hash !== blockHashCache.get(b)) {
                console.warn(`[Indexer] Reorg detected at block ${b}! Invalidating transactions...`);
                await prisma.transaction.updateMany({
                    where: { blockNumber: b },
                    data: { status: "PENDING" },
                });
                blockHashCache.delete(b);
            }
        }
        console.log(`[Indexer] Polling logs from ${fromBlock} to ${toBlock}...`);
        // 2. Get Logs
        const logs = await publicClient.getLogs({
            address: [VAULT_ADDRESS, ROUTER_ADDRESS],
            fromBlock,
            toBlock,
        });
        if (logs.length === 0) {
            await prisma.indexerState.update({
                where: { id: "singleton" },
                data: { lastBlock: Number(toBlock) },
            });
            isPolling = false;
            return;
        }
        // 3. Parse Logs
        const eventLogs = parseEventLogs({
            abi: [...vaultAbi, ...routerAbi],
            logs,
        });
        // 4. Handle Events
        for (const event of eventLogs) {
            const { eventName, args, blockNumber, transactionHash } = event;
            // Handle Vault Events (Sync Position)
            if (eventName === "CollateralDeposited" ||
                eventName === "MUSDBorrowed" ||
                eventName === "MUSDRepaid") {
                const userAddress = args.user;
                if (!userAddress)
                    continue;
                const user = await prisma.user.upsert({
                    where: { address: userAddress },
                    update: {},
                    create: { address: userAddress },
                });
                const [collateralAmount, borrowedMUSD] = (await publicClient.readContract({
                    address: VAULT_ADDRESS,
                    abi: vaultAbi,
                    functionName: "vaults",
                    args: [userAddress],
                }));
                const collateralRatio = (await publicClient.readContract({
                    address: VAULT_ADDRESS,
                    abi: vaultAbi,
                    functionName: "getCollateralRatio",
                    args: [userAddress],
                }));
                // Vault Health Monitoring
                const ratioPercent = Number(collateralRatio) / 10;
                // Ignore MAX_UINT256 (no debt) and 0 debt
                const isNoDebt = collateralRatio === 115792089237316195423570985008687907853269984665640564039457584007913129639935n || borrowedMUSD === 0n;
                if (!isNoDebt && ratioPercent < 130) {
                    console.warn(`🚨 [Vault Monitor] Danger! Vault for ${userAddress} has collateral ratio of ${ratioPercent}%.`);
                    console.warn(`   => Sending Push Notification / Email to user...`);
                    console.warn(`   => Dispatching Telegram Alert to admin channel...`);
                    // TODO: Implement actual Email/Telegram API integrations here
                }
                await prisma.vaultPosition.upsert({
                    where: { userId: user.id },
                    update: {
                        collateralAmount: Number(collateralAmount) / 1e18,
                        borrowedMUSD: Number(borrowedMUSD) / 1e18,
                        collateralRatio: Number(collateralRatio) / 1000,
                        lastSyncedBlock: Number(blockNumber),
                    },
                    create: {
                        userId: user.id,
                        collateralAmount: Number(collateralAmount) / 1e18,
                        borrowedMUSD: Number(borrowedMUSD) / 1e18,
                        collateralRatio: Number(collateralRatio) / 1000,
                        lastSyncedBlock: Number(blockNumber),
                    },
                });
            }
            // Handle Remittance Events (Create Tx & Enqueue Job)
            if (eventName === "RemittanceSent") {
                const { sender, recipientAddress, amount, railType } = args;
                // 1. Lookup Recipient
                const recipient = await prisma.recipient.findUnique({
                    where: { custodialAddress: recipientAddress },
                });
                // 2. Lookup Sender
                const user = await prisma.user.findUnique({
                    where: { address: sender },
                });
                if (recipient && user) {
                    console.log(`[Indexer] Processing remittance: ${amount} to ${railType}`);
                    // 3. Create Transaction record
                    const tx = await prisma.transaction.upsert({
                        where: { txHash: transactionHash },
                        update: { status: "CONFIRMED_ONCHAIN" },
                        create: {
                            txHash: transactionHash,
                            senderId: user.id,
                            recipientId: recipient.id,
                            musdAmount: Number(formatUnits(amount, 18)),
                            feeAmount: Number(formatUnits((amount * 100n) / 10000n, 18)), // 1% fee
                            railType: railType,
                            fiatAmount: calculateFiat(amount, railType),
                            fiatCurrency: getCurrency(railType),
                            status: "CONFIRMED_ONCHAIN",
                            blockNumber: Number(blockNumber),
                        },
                    });
                    // 4. Enqueue BullMQ job for the off-ramp worker
                    await getOfframpQueue().add("offramp", {
                        txId: tx.id,
                        senderAddress: sender,
                        recipientAddress,
                        amount: amount.toString(),
                        railType,
                        recipientPhone: recipient.phoneNumber,
                    });
                    console.log(`[Indexer] Enqueued BullMQ offramp job for tx: ${transactionHash}`);
                }
                else {
                    console.warn(`[Indexer] Missing sender/recipient for remittance in tx: ${transactionHash}`);
                }
            }
            // Sync reorg cache
            const block = await publicClient.getBlock({ blockNumber });
            blockHashCache.set(Number(blockNumber), block.hash);
            if (blockHashCache.size > REORG_LOOKBACK) {
                const oldest = Math.min(...blockHashCache.keys());
                blockHashCache.delete(oldest);
            }
        }
        // 6. Update State
        await prisma.indexerState.update({
            where: { id: "singleton" },
            data: { lastBlock: Number(toBlock) },
        });
    }
    catch (error) {
        console.error("[Indexer] Error:", error);
    }
    finally {
        isPolling = false;
    }
}
export function startIndexer() {
    if (intervalId)
        return;
    console.log("[Indexer] Starting loop with Reorg Detection & BullMQ (every 5s)...");
    intervalId = setInterval(syncEvents, 5000);
}
export function stopIndexer() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("[Indexer] Stopped loop.");
    }
}
/**
 * Run a single indexer polling cycle and return basic metrics.
 * Safe to call from API routes — does not start the background interval.
 */
export async function syncOnce() {
    const before = await prisma.indexerState.findUnique({
        where: { id: "singleton" },
    });
    const txBefore = await prisma.transaction.count();
    await syncEvents();
    const after = await prisma.indexerState.findUnique({
        where: { id: "singleton" },
    });
    const txAfter = await prisma.transaction.count();
    return {
        blocksProcessed: Math.max(0, (after?.lastBlock ?? 0) - (before?.lastBlock ?? 0)),
        eventsFound: Math.max(0, txAfter - txBefore),
    };
}
// Auto-start only when executed as the entry-point script, not when imported as a module.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    startIndexer();
}
