import { type NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  http,
  formatUnits,
  type Address,
  type Chain,
} from "viem";
import { requireAuth } from "web3";
import prisma from "@bitremit/database";

// ---------------------------------------------------------------------------
// Chain & contract config
// Env var MEZO_RPC_URL overrides the public endpoint (useful for rate limits).
// ---------------------------------------------------------------------------

const MEZO_TESTNET = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.test.mezo.org"] },
  },
} as const satisfies Chain;

const VAULT_ADDRESS =
  (process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address | undefined) ??
  ("0x872043fb1fC350967ed4A4C13b6420b40e440591" as Address);

// Minimal ABI — only the three functions this handler calls.
const VAULT_ABI = [
  {
    name: "vaults",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [
      { name: "collateralAmount", type: "uint256" },
      { name: "borrowedMUSD", type: "uint256" },
      { name: "lastUpdated", type: "uint256" },
    ],
  },
  {
    name: "getCollateralRatio",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getMaxBorrowable",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const publicClient = createPublicClient({
  chain: MEZO_TESTNET,
  transport: http(process.env.MEZO_RPC_URL ?? "https://rpc.test.mezo.org"),
});

// ---------------------------------------------------------------------------
// Ratio helpers
// On-chain RATIO_PRECISION = 1000 (e.g. 1500 raw = 150%).
// DB stores the multiplier: 1.5000 → 150%.
// Response collateralRatio is the percentage integer: 150.
// Returned by getCollateralRatio as type(uint256).max when borrowedMUSD == 0.
// ---------------------------------------------------------------------------

// BigInt() call avoids ES2020 bigint literal syntax, compatible with ES2017 target.
const MAX_UINT256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
);

/** Convert on-chain raw ratio to percentage (1500 → 150). */
function rawRatioToPercent(raw: bigint): number {
  return Number(raw) / 10;
}

/** Convert on-chain raw ratio to DB decimal string (1500 → "1.5"). */
function rawRatioToDb(raw: bigint): string {
  return String(Number(raw) / 1000);
}

function computeStatus(
  ratioPercent: number,
  borrowedIsZero: boolean,
): "healthy" | "warning" | "danger" {
  if (borrowedIsZero) return "healthy"; // no debt → infinite coverage
  if (ratioPercent > 150) return "healthy";
  if (ratioPercent >= 130) return "warning";
  return "danger";
}

// ---------------------------------------------------------------------------
// GET /api/vault
//
// 1. Authenticate via Bearer JWT.
// 2. Return cached VaultPosition from DB when found (always fetches
//    maxBorrowable fresh — it is not persisted).
// 3. On cache miss: read on-chain state, persist to DB, return.
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const { address, userId } = auth;

  const userAddress = address as Address;

  // ── Always fetch maxBorrowable fresh (not stored in DB) ─────────────────
  const maxBorrowableRaw = await publicClient.readContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: "getMaxBorrowable",
    args: [userAddress],
  });
  const maxBorrowable = formatUnits(maxBorrowableRaw, 18);

  // ── DB cache lookup ──────────────────────────────────────────────────────
  const cached = await prisma.vaultPosition.findUnique({
    where: { userId },
  });

  if (cached) {
    const borrowedIsZero = Number(cached.borrowedMUSD.toString()) === 0;
    const ratioPercent = Number(cached.collateralRatio.toString()) * 100; // 1.5 → 150

    return NextResponse.json({
      collateralAmount: cached.collateralAmount.toString(),
      borrowedMUSD: cached.borrowedMUSD.toString(),
      collateralRatio: ratioPercent,
      collateralUsdValue: 0,
      collateralChangePercent: 0,
      collateralChangeUsd: 0,
      maxBorrowable,
      status: computeStatus(ratioPercent, borrowedIsZero),
    });
  }

  // ── Cache miss — read on-chain ───────────────────────────────────────────
  const [vaultData, ratioRaw, blockNumber] = await Promise.all([
    publicClient.readContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "vaults",
      args: [userAddress],
    }),
    publicClient.readContract({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: "getCollateralRatio",
      args: [userAddress],
    }),
    publicClient.getBlockNumber(),
  ]);

  // viem returns multiple outputs as a readonly tuple — access by index.
  const [collateralAmountRaw, borrowedMUSDRaw] = vaultData;

  const isNoDebt = ratioRaw === MAX_UINT256 || borrowedMUSDRaw === BigInt(0);
  const ratioPercent = isNoDebt ? 0 : rawRatioToPercent(ratioRaw);
  const ratioForDb = isNoDebt ? "0" : rawRatioToDb(ratioRaw);

  const collateralAmountStr = formatUnits(collateralAmountRaw, 18);
  const borrowedMUSDStr = formatUnits(borrowedMUSDRaw, 18);

  // Upsert guards against rare simultaneous requests for the same userId.
  await prisma.vaultPosition.upsert({
    where: { userId },
    create: {
      userId,
      collateralAmount: collateralAmountStr,
      borrowedMUSD: borrowedMUSDStr,
      collateralRatio: ratioForDb,
      lastSyncedBlock: Number(blockNumber),
    },
    update: {
      collateralAmount: collateralAmountStr,
      borrowedMUSD: borrowedMUSDStr,
      collateralRatio: ratioForDb,
      lastSyncedBlock: Number(blockNumber),
    },
  });

  return NextResponse.json({
    collateralAmount: collateralAmountStr,
    borrowedMUSD: borrowedMUSDStr,
    collateralRatio: ratioPercent,
    collateralUsdValue: 0,
    collateralChangePercent: 0,
    collateralChangeUsd: 0,
    maxBorrowable,
    status: computeStatus(ratioPercent, isNoDebt),
  });
}
