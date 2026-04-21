import { PrismaClient, PaymentRail, TxStatus } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(__dirname, "../../../.env"),
});
const prisma = new PrismaClient();
async function main() {
    console.log("🌱 Seeding BitRemit database...");
    // ─── Clean existing data (order matters for FK constraints) ───────────────
    await prisma.transaction.deleteMany();
    await prisma.vaultPosition.deleteMany();
    await prisma.recipient.deleteMany();
    await prisma.user.deleteMany();
    await prisma.indexerState.deleteMany();
    console.log("🧹 Cleared existing data");
    // ─── Users ─────────────────────────────────────────────────────────────────
    const user1 = await prisma.user.create({
        data: {
            address: "0xDev1TestAddress",
            phoneNumber: "+2348031234567",
        },
    });
    const user2 = await prisma.user.create({
        data: {
            address: "0xDev2TestAddress",
        },
    });
    console.log(`👤 Created users: ${user1.address}, ${user2.address}`);
    // ─── VaultPositions ────────────────────────────────────────────────────────
    await prisma.vaultPosition.create({
        data: {
            userId: user1.id,
            collateralAmount: 0.05, // 0.05 tBTC
            borrowedMUSD: 2450.0,
            collateralRatio: 1.22, // 122% — "warning" zone for demo realism
            lastSyncedBlock: 100_000,
        },
    });
    await prisma.vaultPosition.create({
        data: {
            userId: user2.id,
            collateralAmount: 0.1,
            borrowedMUSD: 3000.0,
            collateralRatio: 2.0, // 200% — healthy
            lastSyncedBlock: 100_000,
        },
    });
    console.log("🏦 Created vault positions");
    // ─── Recipients ────────────────────────────────────────────────────────────
    // phoneHash: keccak256 of phone number — placeholder hex strings for seed
    const mamaIngozi = await prisma.recipient.create({
        data: {
            name: "Mama Ngozi",
            phoneNumber: "+2348031234567",
            phoneHash: "0xa1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
            custodialAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f6B123",
            paymentRail: PaymentRail.MPESA,
            isUpgraded: false,
        },
    });
    const sisterAna = await prisma.recipient.create({
        data: {
            name: "Sister Ana",
            phoneNumber: "+639171234567",
            phoneHash: "0xb2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
            custodialAddress: "0x8Ba1f109551bD432803012645Ac136ddd64DBA72",
            paymentRail: PaymentRail.GCASH,
            isUpgraded: false,
        },
    });
    const uncleKwame = await prisma.recipient.create({
        data: {
            name: "Uncle Kwame",
            phoneNumber: "+233241234567",
            phoneHash: "0xc3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
            custodialAddress: "0x5AEDA56215b167893e80B4fE645BA6d5Bab767DE",
            paymentRail: PaymentRail.MTNMOMO,
            isUpgraded: false,
        },
    });
    console.log(`📱 Created recipients: ${mamaIngozi.name}, ${sisterAna.name}, ${uncleKwame.name}`);
    // ─── Transactions ──────────────────────────────────────────────────────────
    const now = new Date();
    const daysAgo = (n) => new Date(now.getTime() - n * 86_400_000);
    // 1. COMPLETED M-Pesa — $50, KES 6,500
    await prisma.transaction.create({
        data: {
            txHash: "0xabc1000000000000000000000000000000000000000000000000000000000001",
            senderId: user1.id,
            recipientId: mamaIngozi.id,
            musdAmount: 50.0,
            feeAmount: 0.5, // 1% fee
            railType: PaymentRail.MPESA,
            railReference: "ws_CO_1234567890",
            fiatAmount: 6500.0,
            fiatCurrency: "KES",
            status: TxStatus.COMPLETED,
            blockNumber: 99_800,
            createdAt: daysAgo(5),
            completedAt: daysAgo(5),
        },
    });
    // 2. COMPLETED M-Pesa — $50, KES 6,500
    await prisma.transaction.create({
        data: {
            txHash: "0xabc2000000000000000000000000000000000000000000000000000000000002",
            senderId: user1.id,
            recipientId: mamaIngozi.id,
            musdAmount: 50.0,
            feeAmount: 0.5,
            railType: PaymentRail.MPESA,
            railReference: "ws_CO_9876543210",
            fiatAmount: 6500.0,
            fiatCurrency: "KES",
            status: TxStatus.COMPLETED,
            blockNumber: 99_850,
            createdAt: daysAgo(3),
            completedAt: daysAgo(3),
        },
    });
    // 3. COMPLETED GCash — $30, PHP 1,680
    await prisma.transaction.create({
        data: {
            txHash: "0xabc3000000000000000000000000000000000000000000000000000000000003",
            senderId: user1.id,
            recipientId: sisterAna.id,
            musdAmount: 30.0,
            feeAmount: 0.3,
            railType: PaymentRail.GCASH,
            railReference: "GC-a1b2c3d4",
            fiatAmount: 1680.0,
            fiatCurrency: "PHP",
            status: TxStatus.COMPLETED,
            blockNumber: 99_900,
            createdAt: daysAgo(2),
            completedAt: daysAgo(2),
        },
    });
    // 4. OFFRAMP_PROCESSING MTN MoMo — $100, GHS 1,300
    await prisma.transaction.create({
        data: {
            txHash: "0xabc4000000000000000000000000000000000000000000000000000000000004",
            senderId: user1.id,
            recipientId: uncleKwame.id,
            musdAmount: 100.0,
            feeAmount: 1.0,
            railType: PaymentRail.MTNMOMO,
            railReference: "MTN-e5f6a1b2",
            fiatAmount: 1300.0,
            fiatCurrency: "GHS",
            status: TxStatus.OFFRAMP_PROCESSING,
            blockNumber: 99_950,
            createdAt: daysAgo(0), // today
            completedAt: null,
        },
    });
    // 5. PENDING M-Pesa — $75
    await prisma.transaction.create({
        data: {
            txHash: "0xabc5000000000000000000000000000000000000000000000000000000000005",
            senderId: user2.id,
            recipientId: mamaIngozi.id,
            musdAmount: 75.0,
            feeAmount: 0.75,
            railType: PaymentRail.MPESA,
            railReference: null,
            fiatAmount: 9750.0, // 75 * 130 KES/USD
            fiatCurrency: "KES",
            status: TxStatus.PENDING,
            blockNumber: null,
            createdAt: new Date(),
            completedAt: null,
        },
    });
    console.log("💸 Created 5 transactions");
    // ─── IndexerState singleton ────────────────────────────────────────────────
    await prisma.indexerState.create({
        data: {
            id: "singleton",
            lastBlock: 99_950,
        },
    });
    console.log("🔗 Created indexer state (lastBlock: 99950)");
    console.log("✅ Seed complete!");
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
