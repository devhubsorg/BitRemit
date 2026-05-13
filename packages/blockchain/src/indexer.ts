import { fileURLToPath } from "node:url";
import {
  createPublicClient,
  http,
  parseEventLogs,
  defineChain,
  Address,
  type Abi,
  formatUnits,
} from "viem";
import { prisma } from "@bitremit/database";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { BitRemitVaultABI } from "../../web3/src/abis/BitRemitVault";
import { RemittanceRouterABI } from "../../web3/src/abis/RemittanceRouter";

const vaultAbi = BitRemitVaultABI as Abi;
const routerAbi = RemittanceRouterABI as Abi;

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

const VAULT_ADDRESS = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as Address;
const DEPLOY_BLOCK_NUMBER = BigInt(process.env.DEPLOY_BLOCK_NUMBER || "0");

// BullMQ / Redis Connection setup
// Converts the Upstash HTTPS URL to a rediss:// format for ioredis
const getRedisConnection = () => {
  const rawUrl = process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_TOKEN;
  if (!rawUrl || !token) throw new Error("Missing Upstash Redis configuration");

  let host: string;
  let port = 6379;
  let useTls = true;

  if (rawUrl.startsWith("redis://") || rawUrl.startsWith("rediss://")) {
    const parsed = new URL(rawUrl);
    host = parsed.hostname;
    port = parsed.port ? Number(parsed.port) : 6379;
    useTls = parsed.protocol === "rediss:";
  } else {
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

let _offrampQueue: Queue | undefined;
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
const blockHashCache = new Map<number, string>();
const REORG_LOOKBACK = 20;

let intervalId: NodeJS.Timeout | null = null;
let isPolling = false;

// Helpers for Fiat conversion
const calculateFiat = (amount: bigint, railType: string) => {
  const amt = Number(formatUnits(amount, 18));
  if (railType === "MPESA") return amt * 130; // 1 mUSD = 130 KES
  if (railType === "GCASH") return amt * 55; // 1 mUSD = 55 PHP
  return amt; // Default 1:1 for mocks
};

const getCurrency = (railType: string) => {
  if (railType === "MPESA") return "KES";
  if (railType === "GCASH") return "PHP";
  return "USD";
};

/**
 * Sends a danger alert to the user via Email and Telegram.
 * Implements a basic cooldown to avoid spamming the user.
 */
async function sendVaultAlert(user: any, ratio: number) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_TELEGRAM_CHAT_ID;

  const message =
    `🚨 *BitRemit Vault Danger!* \n\n` +
    `Your vault collateral ratio has dropped to *${ratio.toFixed(2)}%*.\n` +
    `Please add collateral immediately to avoid liquidation.\n\n` +
    `🌍 [Manage Vault](https://bitremit.vercel.app/dashboard)`;

  // 1. Send Telegram Alert to User (if linked)
  if (TELEGRAM_TOKEN && user.telegramChatId) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: user.telegramChatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });
      console.log(
        `[Vault Monitor] Telegram alert sent to user ${user.address}`,
      );
    } catch (err) {
      console.error(`[Vault Monitor] Failed to send Telegram alert:`, err);
    }
  }

  // 2. Send Telegram Alert to Admin Channel
  if (TELEGRAM_TOKEN && ADMIN_CHAT_ID) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_CHAT_ID,
          text: `🚨 *Admin Alert:* Vault for \`${user.address}\` is at *${ratio.toFixed(2)}%*!`,
          parse_mode: "Markdown",
        }),
      });
    } catch (err) {
      console.error(`[Vault Monitor] Failed to send Admin alert:`, err);
    }
  }

  // 3. Send Email (Placeholder / Mock)
  if (user.email) {
    console.log(
      `[Vault Monitor] Sending Push Notification / Email to ${user.email}...`,
    );
    // Example: await resend.emails.send({ ... });
  }
}

async function syncEvents() {
  if (isPolling) return;
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
    if (toBlock > latestBlock) toBlock = latestBlock;

    if (fromBlock > latestBlock) {
      isPolling = false;
      return;
    }

    // Reorg Detection
    const blocksToCheck = Array.from(blockHashCache.keys()).filter(
      (b) => b > Number(fromBlock) - REORG_LOOKBACK,
    );
    for (const b of blocksToCheck) {
      const block = await publicClient.getBlock({ blockNumber: BigInt(b) });
      if (block.hash !== blockHashCache.get(b)) {
        console.warn(
          `[Indexer] Reorg detected at block ${b}! Invalidating transactions...`,
        );
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
      const { eventName, args, blockNumber, transactionHash } = event as any;

      // Handle Vault Events (Sync Position)
      if (
        eventName === "CollateralDeposited" ||
        eventName === "MUSDBorrowed" ||
        eventName === "MUSDRepaid"
      ) {
        const userAddress = args.user;
        if (!userAddress) continue;

        const user = await prisma.user.upsert({
          where: { address: userAddress },
          update: {},
          create: { address: userAddress },
        });

        const [collateralAmount, borrowedMUSD] =
          (await publicClient.readContract({
            address: VAULT_ADDRESS,
            abi: vaultAbi,
            functionName: "vaults",
            args: [userAddress],
          })) as [bigint, bigint, bigint];

        const collateralRatio = (await publicClient.readContract({
          address: VAULT_ADDRESS,
          abi: vaultAbi,
          functionName: "getCollateralRatio",
          args: [userAddress],
        })) as bigint;

        const ratioPercent = Number(collateralRatio) / 10;
        const isNoDebt =
          collateralRatio ===
            115792089237316195423570985008687907853269984665640564039457584007913129639935n ||
          borrowedMUSD === 0n;

        // Vault Health Monitoring
        const existingPosition = await prisma.vaultPosition.findUnique({
          where: { userId: user.id },
        });

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        let alertSentThisCycle = false;

        if (!isNoDebt && ratioPercent < 130) {
          const shouldAlert =
            !existingPosition?.lastAlertSentAt ||
            existingPosition.lastAlertSentAt < oneDayAgo;

          if (shouldAlert) {
            console.warn(
              `🚨 [Vault Monitor] Danger! Vault for ${userAddress} has collateral ratio of ${ratioPercent}%.`,
            );
            await sendVaultAlert(user, ratioPercent);
            alertSentThisCycle = true;
          }
        }

        await prisma.vaultPosition.upsert({
          where: { userId: user.id },
          update: {
            collateralAmount: Number(collateralAmount) / 1e18,
            borrowedMUSD: Number(borrowedMUSD) / 1e18,
            collateralRatio: isNoDebt ? 0 : Number(collateralRatio) / 1000,
            lastSyncedBlock: Number(blockNumber),
            ...(alertSentThisCycle ? { lastAlertSentAt: new Date() } : {}),
          },
          create: {
            userId: user.id,
            collateralAmount: Number(collateralAmount) / 1e18,
            borrowedMUSD: Number(borrowedMUSD) / 1e18,
            collateralRatio: isNoDebt ? 0 : Number(collateralRatio) / 1000,
            lastSyncedBlock: Number(blockNumber),
            ...(alertSentThisCycle ? { lastAlertSentAt: new Date() } : {}),
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
          console.log(
            `[Indexer] Processing remittance: ${amount} to ${railType}`,
          );

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

          console.log(
            `[Indexer] Enqueued BullMQ offramp job for tx: ${transactionHash}`,
          );
        } else {
          console.warn(
            `[Indexer] Missing sender/recipient for remittance in tx: ${transactionHash}`,
          );
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
  } catch (error) {
    console.error("[Indexer] Error:", error);
  } finally {
    isPolling = false;
  }
}

export function startIndexer() {
  if (intervalId) return;
  console.log(
    "[Indexer] Starting loop with Reorg Detection & BullMQ (every 5s)...",
  );
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
export async function syncOnce(): Promise<{
  blocksProcessed: number;
  eventsFound: number;
}> {
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
    blocksProcessed: Math.max(
      0,
      (after?.lastBlock ?? 0) - (before?.lastBlock ?? 0),
    ),
    eventsFound: Math.max(0, txAfter - txBefore),
  };
}

// Auto-start only when executed as the entry-point script, not when imported as a module.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startIndexer();
}
