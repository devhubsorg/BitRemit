import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const MUSD = "0x118917a40faf1cd7a13db0ef56c86de7973ac503";
const SIGNER = "0xe74a13d50900BBbaE6a681936C727073089aB87B";
const ROUTER = "0xb03843007F051c73b739a0CCe126c5Ed45E7626e";
const DEPLOYER_KEY =
  "0xb95578049ccafc03cc78f8949698a9e39316691648884b2e06de4afd150b6541";

const mezochainDef = {
  id: 31611,
  name: "Mezo Testnet",
  nativeCurrency: { name: "BTC", symbol: "BTC", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.test.mezo.org"] } },
};

const client = createPublicClient({
  chain: mezochainDef,
  transport: http("https://rpc.test.mezo.org"),
});

const ERC20_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [{ type: "address" }, { type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ type: "address" }, { type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ type: "address" }, { type: "uint256" }],
    outputs: [],
  },
];

const bal = await client.readContract({
  address: MUSD,
  abi: ERC20_ABI,
  functionName: "balanceOf",
  args: [SIGNER],
});
const all = await client.readContract({
  address: MUSD,
  abi: ERC20_ABI,
  functionName: "allowance",
  args: [SIGNER, ROUTER],
});
console.log(
  "Signer mUSD balance:",
  bal.toString(),
  "(",
  (Number(bal) / 1e18).toFixed(4),
  "mUSD)",
);
console.log("Signer->Router allowance:", all.toString());

// Try to mint 10 mUSD to signer using deployer key
console.log("\nAttempting mint(signer, 10e18) as deployer...");
const account = privateKeyToAccount(DEPLOYER_KEY);
const walletClient = createWalletClient({
  account,
  chain: mezochainDef,
  transport: http("https://rpc.test.mezo.org"),
});

try {
  const txHash = await walletClient.writeContract({
    address: MUSD,
    abi: ERC20_ABI,
    functionName: "mint",
    args: [SIGNER, 10000000000000000000n],
  });
  console.log("mint TX submitted:", txHash);
  const receipt = await client.waitForTransactionReceipt({ hash: txHash });
  console.log(
    "mint confirmed in block",
    receipt.blockNumber,
    "status:",
    receipt.status,
  );

  const newBal = await client.readContract({
    address: MUSD,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [SIGNER],
  });
  console.log("New balance:", (Number(newBal) / 1e18).toFixed(4), "mUSD");

  // Also approve router to spend
  console.log("\nApproving router to spend 10 mUSD...");
  const approveTx = await walletClient.writeContract({
    address: MUSD,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [ROUTER, 10000000000000000000n],
  });
  const approveReceipt = await client.waitForTransactionReceipt({
    hash: approveTx,
  });
  console.log("approve confirmed in block", approveReceipt.blockNumber);

  const newAll = await client.readContract({
    address: MUSD,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: [SIGNER, ROUTER],
  });
  console.log("New allowance:", (Number(newAll) / 1e18).toFixed(4), "mUSD");
} catch (e) {
  console.error("mint failed:", e.shortMessage || e.message);
  // Check if there's a different minter role ABI to try
  const MINTER_ABI = [
    {
      name: "MINTER_ROLE",
      type: "function",
      stateMutability: "view",
      inputs: [],
      outputs: [{ type: "bytes32" }],
    },
    {
      name: "hasRole",
      type: "function",
      stateMutability: "view",
      inputs: [{ type: "bytes32" }, { type: "address" }],
      outputs: [{ type: "bool" }],
    },
  ];
  try {
    const minterRole = await client.readContract({
      address: MUSD,
      abi: MINTER_ABI,
      functionName: "MINTER_ROLE",
      args: [],
    });
    const hasRole = await client.readContract({
      address: MUSD,
      abi: MINTER_ABI,
      functionName: "hasRole",
      args: [minterRole, SIGNER],
    });
    console.log("MINTER_ROLE:", minterRole, "| Signer has it:", hasRole);
  } catch (e2) {
    console.log("No AccessControl on mUSD token");
  }
}
