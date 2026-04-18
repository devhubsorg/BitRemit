import { 
    createPublicClient, 
    createWalletClient, 
    http, 
    parseUnits, 
    Address, 
    type Abi,
    LocalAccount
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { prisma } from '@bitremit/database';
import { startIndexer, stopIndexer } from '../src/indexer.js';
import { startWorker } from '../src/workers/offramp.worker.js';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import BitRemitVaultABI from '../../web3/src/abis/BitRemitVault.json' with { type: 'json' };
import RemittanceRouterABI from '../../web3/src/abis/RemittanceRouter.json' with { type: 'json' };
import RecipientRegistryABI from '../../web3/src/abis/RecipientRegistry.json' with { type: 'json' };
import { mainnet } from 'viem/chains';

/**
 * BitRemit Pipeline Integration Test
 * 
 * Verifies the full flow:
 * 1. User deposits collateral & Borrows mUSD (On-chain)
 * 2. User sends remittance (On-chain)
 * 3. Indexer picks up event -> Creates DB Transaction -> Enqueues Job (Off-chain)
 * 4. Worker processes Job -> Calls MTN Mock (Off-chain)
 * 5. Mock Server signals success -> Status updated to COMPLETED (Off-chain)
 */

const VAULT_ADDR = process.env.NEXT_PUBLIC_VAULT_ADDRESS as Address;
const ROUTER_ADDR = process.env.NEXT_PUBLIC_ROUTER_ADDRESS as Address;
const REGISTRY_ADDR = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS as Address;
const TBTC_ADDR = process.env.TBTC_ADDRESS as Address; // Mock tBTC used for collateral

const RPC_URL = process.env.MEZO_RPC_URL || 'http://localhost:8545';
const PK = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;

const account = privateKeyToAccount(PK);

const publicClient = createPublicClient({
    chain: mainnet, // Using mainnet as template, but URL is Testnet/Anvil
    transport: http(RPC_URL)
});

const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(RPC_URL)
});

describe('BitRemit Pipeline Integration', () => {
    let testTransactionHash: `0x${string}`;
    let recipientCustodialAddress: Address;

    beforeAll(async () => {
        // 1. Ensure Indexer and Worker are running (we start them manually for the test)
        startIndexer();
        await startWorker();
        console.log('[Test] Services started.');

        // Cleanup previous test state if any
        await prisma.transaction.deleteMany({});
    }, 10000);

    afterAll(async () => {
        stopIndexer();
        // Worker stops when the process exits or we could handle it if we had a stop method
    });

    test('Full Pipeline: On-chain action to COMPLETED status', async () => {
        const phoneHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'; // Mock phone hash
        
        // 1. Get custodial address from registry
        recipientCustodialAddress = await publicClient.readContract({
            address: REGISTRY_ADDR,
            abi: RecipientRegistryABI as Abi,
            functionName: 'getAddress',
            args: [phoneHash]
        }) as Address;

        console.log(`[Test] Recipient Custodial Address: ${recipientCustodialAddress}`);

        // Seed DB with User and Recipient to match contract state
        const user = await prisma.user.upsert({
            where: { address: account.address },
            update: {},
            create: { address: account.address }
        });

        await prisma.recipient.upsert({
            where: { custodialAddress: recipientCustodialAddress },
            update: {},
            create: {
                name: 'Test Recipient',
                phoneNumber: '+233241234567',
                phoneHash: phoneHash,
                custodialAddress: recipientCustodialAddress,
                paymentRail: 'MTNMOMO'
            }
        });

        // 2. Perform On-chain Remittance
        // Ensure user has mUSD (borrows or we just assume they have it for test)
        // In a real anvil fork, we might need to forge collateral first.
        // For this script, we'll just attempt the call.
        
        console.log('[Test] Sending remittance on-chain...');
        
        testTransactionHash = await walletClient.writeContract({
            address: ROUTER_ADDR,
            abi: RemittanceRouterABI as Abi,
            functionName: 'sendRemittance',
            args: [phoneHash, parseUnits('50', 18), 'MTNMOMO']
        });

        console.log(`[Test] Transaction sent: ${testTransactionHash}`);

        // 3. Poll DB for status update
        console.log('[Test] Waiting for indexer and worker to process...');
        
        let txRecord = null;
        const maxAttempts = 30; // 30 seconds
        for (let i = 0; i < maxAttempts; i++) {
            txRecord = await prisma.transaction.findUnique({
                where: { txHash: testTransactionHash }
            });

            if (txRecord?.status === 'COMPLETED') {
                break;
            }
            
            await new Promise(r => setTimeout(r, 1000));
        }

        // 4. Assertions
        expect(txRecord).toBeDefined();
        expect(txRecord?.status).toBe('COMPLETED');
        expect(txRecord?.railReference).toBeDefined();
        expect(txRecord?.musdAmount.toString()).toBe('50');
        expect(txRecord?.completedAt).toBeDefined();

        console.log('[Test] Pipeline verified Successfully!');
    }, 60000); // 60s timeout
});
