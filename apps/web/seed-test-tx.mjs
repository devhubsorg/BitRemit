/**
 * Seed a fake Transaction row, then exercise:
 *   Step 8  — GET /api/remittance/{id}  → PENDING
 *   Step 8b — POST /api/offramp/callback (MPESA) → transitions to COMPLETED
 *   Step 8c — GET /api/remittance/{id}  → COMPLETED
 *   Step 9  — verify DB shows COMPLETED
 */

import { PrismaClient } from '../../packages/database/generated/client/index.js';

const prisma = new PrismaClient({ log: [] });

const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoiMHhEZXYyVGVzdEFkZHJlc3MiLCJzdWIiOiJjbW55bGxhc2owMDAxdWFoMGJjOW5oZjA0IiwiaWF0IjoxNzc2OTM1NTE5LCJleHAiOjE3Nzc1NDAzMTl9.bhJz5OYaHqmkLtMr0Uu_llb2sv3dzy1TVngDehtcOEQ';
const SENDER_ID    = 'cmnyllasj0001uah0bc9nhf04'; // Dev2
const RECIPIENT_ID = 'cmnyllbyf0006uah0bciipb7f'; // +2348031234567
const CALLBACK_SECRET = 'dfe4b8c3f768aaa2fecf32ff05dbab35ba7209070f5cd8c6d07c2d284fbd0666';
const BASE_URL = 'http://localhost:3000';
const RAIL_REFERENCE = `MPESA-SMOKE-${Date.now()}`;

// ── Step: Seed Transaction ───────────────────────────────────────────────────
console.log('\n[SEED] Creating test Transaction in DB...');
const tx = await prisma.transaction.create({
  data: {
    senderId:      SENDER_ID,
    recipientId:   RECIPIENT_ID,
    txHash:        `0xSMOKE_TEST_FAKE_HASH_${Date.now()}`,
    musdAmount:    '4.000000000000000000',
    feeAmount:     '0.040000000000000000',
    railType:      'MPESA',
    railReference: RAIL_REFERENCE,
    fiatAmount:    0,
    fiatCurrency:  'KES',
    status:        'PENDING',
    blockNumber:   null,
  },
});
console.log(`  ✅ Transaction created: id=${tx.id}  status=${tx.status}  railRef=${tx.railReference}`);

await prisma.$disconnect();

// ── Step 8a: Poll GET /api/remittance/{id} ────────────────────────────────────
console.log('\n[STEP 8a] GET /api/remittance/' + tx.id + ' (expect PENDING)');
const r1 = await fetch(`${BASE_URL}/api/remittance/${tx.id}`, {
  headers: { Authorization: `Bearer ${JWT}` },
});
const b1 = await r1.json();
console.log(`  STATUS: ${r1.status}`);
console.log(`  tx.status: ${b1.status}`);
console.log(`  tx.railType: ${b1.railType}  tx.musdAmount: ${b1.musdAmount}`);
if (b1.status !== 'PENDING') {
  console.error('  ❌ Expected PENDING');
  process.exit(1);
}
console.log('  ✅ PASS — status is PENDING');

// ── Step 8b: POST /api/offramp/callback (MPESA success) ──────────────────────
console.log('\n[STEP 8b] POST /api/offramp/callback (MPESA success callback)');
const callbackPayload = {
  CheckoutRequestID: RAIL_REFERENCE,
  ResponseCode:      '0',
  ResultDesc:        'The service request is processed successfully.',
  rail:              'mpesa',
  status:            'SUCCESS',
};
console.log('  Payload:', JSON.stringify(callbackPayload));

const r2 = await fetch(`${BASE_URL}/api/offramp/callback`, {
  method:  'POST',
  headers: {
    'Content-Type':     'application/json',
    'x-callback-secret': CALLBACK_SECRET,
  },
  body: JSON.stringify(callbackPayload),
});
const b2 = await r2.json();
console.log(`  STATUS: ${r2.status}`);
console.log(`  Body: ${JSON.stringify(b2)}`);
if (r2.status !== 200) {
  console.error('  ❌ Expected 200 from callback');
  process.exit(1);
}
console.log('  ✅ PASS — callback accepted');

// ── Step 8c: Re-poll GET /api/remittance/{id} ─────────────────────────────────
console.log('\n[STEP 8c] GET /api/remittance/' + tx.id + ' (expect COMPLETED)');
const r3 = await fetch(`${BASE_URL}/api/remittance/${tx.id}`, {
  headers: { Authorization: `Bearer ${JWT}` },
});
const b3 = await r3.json();
console.log(`  STATUS: ${r3.status}`);
console.log(`  tx.status: ${b3.status}`);
console.log(`  tx.completedAt: ${b3.completedAt}`);
if (b3.status !== 'COMPLETED') {
  console.error('  ❌ Expected COMPLETED — got', b3.status);
  process.exit(1);
}
console.log('  ✅ PASS — status is COMPLETED');

// ── Step 9: Verify DB directly ────────────────────────────────────────────────
console.log('\n[STEP 9] Verify DB record directly via Prisma...');
const prisma2 = new PrismaClient({ log: [] });
const dbTx = await prisma2.transaction.findUnique({
  where: { id: tx.id },
  include: { recipient: true, sender: true },
});
await prisma2.$disconnect();

console.log(`  id:           ${dbTx.id}`);
console.log(`  status:       ${dbTx.status}`);
console.log(`  completedAt:  ${dbTx.completedAt}`);
console.log(`  sender:       ${dbTx.sender?.email ?? dbTx.senderId}`);
console.log(`  recipient:    ${dbTx.recipient?.name} (${dbTx.recipient?.phoneNumber})`);
console.log(`  musdAmount:   ${dbTx.musdAmount}`);
console.log(`  railType:     ${dbTx.railType}`);
console.log(`  railRef:      ${dbTx.railReference}`);

if (dbTx.status !== 'COMPLETED' || !dbTx.completedAt) {
  console.error('  ❌ DB does not show COMPLETED with completedAt set');
  process.exit(1);
}
console.log('  ✅ PASS — DB confirms COMPLETED with completedAt timestamp');

console.log('\n✅✅✅ Steps 8 + 9 PASSED ✅✅✅');
