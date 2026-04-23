import {
  createWalletClient,
  createPublicClient,
  http,
  keccak256,
  toHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { PrismaClient } from "./generated/client/index.js";

// ── Config ────────────────────────────────────────────────────────────────
const DEPLOYER_KEY =
  "0xb95578049ccafc03cc78f8949698a9e39316691648884b2e06de4afd150b6541";
const REGISTRY_ADDR = "0xB3ae950EE06f017399Fd5A3e249C49ab80358027";
const PHONE_NUMBER = "+2348031234567";
const RECIPIENT_DB_ID = "cmnyllbyf0006uah0bciipb7f";
const RPC_URL = "https://rpc.test.mezo.org";

const MEZO_CHAIN = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

const REGISTRY_ABI = [
  {
    name: "setAuthorizedRegistrar",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "registrar", type: "address" },
      { name: "isAuthorized", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "registerRecipient",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "phoneHash", type: "bytes32" },
      { name: "custodialAddress", type: "address" },
    ],
    outputs: [],
  },
  {
    name: "authorizedRegistrars",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "isRegistered",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "phoneHash", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
];

const account = privateKeyToAccount(DEPLOYER_KEY);
const walletClient = createWalletClient({
  account,
  chain: MEZO_CHAIN,
  transport: http(RPC_URL),
});
const publicClient = createPublicClient({
  chain: MEZO_CHAIN,
  transport: http(RPC_URL),
});
const prisma = new PrismaClient();

console.log(`\nDeployer/signer address: ${account.address}`);

// ── Step 1: Check current state ────────────────────────────────────────────
console.log("\n[1/5] Checking on-chain state...");
const owner = await publicClient.readContract({
  address: REGISTRY_ADDR,
  abi: REGISTRY_ABI,
  functionName: "owner",
});
console.log(`  Registry owner: ${owner}`);
const isRegistrar = await publicClient.readContract({
  address: REGISTRY_ADDR,
  abi: REGISTRY_ABI,
  functionName: "authorizedRegistrars",
  args: [account.address],
});
console.log(`  Is authorized registrar: ${isRegistrar}`);

// ── Step 2: Grant registrar role if not already set ────────────────────────
if (!isRegistrar) {
  console.log("\n[2/5] Granting registrar role via setAuthorizedRegistrar...");
  const hash = await walletClient.writeContract({
    address: REGISTRY_ADDR,
    abi: REGISTRY_ABI,
    functionName: "setAuthorizedRegistrar",
    args: [account.address, true],
  });
  console.log(`  TX submitted: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(
    `  ✅ Confirmed in block ${receipt.blockNumber} (status: ${receipt.status})`,
  );
} else {
  console.log("\n[2/5] Already authorized registrar — skipping.");
}

// ── Step 3: Compute real phone hash ───────────────────────────────────────
console.log("\n[3/5] Computing real phone hash...");
const encoder = new TextEncoder();
const phoneBytes = encoder.encode(PHONE_NUMBER);
const realPhoneHash = keccak256(toHex(phoneBytes));
console.log(`  keccak256("${PHONE_NUMBER}") = ${realPhoneHash}`);

// ── Step 4: Fetch custodial address from DB ────────────────────────────────
console.log("\n[4/5] Fetching recipient from DB...");
const recipient = await prisma.recipient.findUnique({
  where: { id: RECIPIENT_DB_ID },
});
console.log(`  Custodial address: ${recipient.custodialAddress}`);
console.log(`  DB phoneHash (current): ${recipient.phoneHash}`);

// Check if already registered on-chain with the real hash
const alreadyOnChain = await publicClient.readContract({
  address: REGISTRY_ADDR,
  abi: REGISTRY_ABI,
  functionName: "isRegistered",
  args: [realPhoneHash],
});
console.log(`  Already registered on-chain with real hash: ${alreadyOnChain}`);

if (!alreadyOnChain) {
  console.log("\n  Calling registerRecipient on-chain...");
  const hash = await walletClient.writeContract({
    address: REGISTRY_ADDR,
    abi: REGISTRY_ABI,
    functionName: "registerRecipient",
    args: [realPhoneHash, recipient.custodialAddress],
  });
  console.log(`  TX submitted: ${hash}`);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(
    `  ✅ Confirmed in block ${receipt.blockNumber} (status: ${receipt.status})`,
  );
} else {
  console.log("  Already registered on-chain — skipping.");
}

// ── Step 5: Update DB phoneHash to real value ──────────────────────────────
console.log("\n[5/5] Updating DB phoneHash to real keccak256 value...");
if (recipient.phoneHash !== realPhoneHash) {
  const updated = await prisma.recipient.update({
    where: { id: RECIPIENT_DB_ID },
    data: { phoneHash: realPhoneHash },
  });
  console.log(`  ✅ DB updated. New phoneHash: ${updated.phoneHash}`);
} else {
  console.log("  DB phoneHash already correct — skipping.");
}

await prisma.$disconnect();
console.log("\n✅ All done. Retry POST /api/remittance now.\n");
