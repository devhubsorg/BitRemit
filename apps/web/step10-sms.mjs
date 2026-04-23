/**
 * Step 10 — Welcome SMS via Twilio
 * Registers a fresh recipient so the POST /api/recipients handler fires
 * the Twilio welcome SMS to the recipient's phone number.
 */

const JWT =
  "eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoiMHhEZXYyVGVzdEFkZHJlc3MiLCJzdWIiOiJjbW55bGxhc2owMDAxdWFoMGJjOW5oZjA0IiwiaWF0IjoxNzc2OTM1NTE5LCJleHAiOjE3Nzc1NDAzMTl9.bhJz5OYaHqmkLtMr0Uu_llb2sv3dzy1TVngDehtcOEQ";
const BASE_URL = "http://localhost:3000";

// Use a fresh number that doesn't exist in DB yet
const testPhone = "+2347079485796";

const body = {
  name: "SMS Smoke Test",
  phoneNumber: testPhone,
  paymentRail: "MPESA",
};

console.log(
  "[STEP 10] POST /api/recipients — fresh phone to trigger welcome SMS",
);
console.log("  Phone:", testPhone);
console.log(
  '  Expected SMS: "Your family set up a BitRemit account for you. You\'ll receive money via M-Pesa."',
);
console.log("");

const r = await fetch(`${BASE_URL}/api/recipients`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${JWT}`,
  },
  body: JSON.stringify(body),
});

const raw = await r.text();
let b;
try {
  b = JSON.parse(raw);
} catch {
  b = raw;
}

console.log("HTTP STATUS:", r.status);
console.log("RESPONSE:", JSON.stringify(b, null, 2));
console.log("");

if (r.status === 201) {
  console.log("✅ PASS — recipient created (id:", b.id + ")");
  console.log("");
  console.log("Twilio SMS was dispatched to", testPhone);
  console.log(
    "Check https://console.twilio.com/us1/monitor/logs/sms for delivery confirmation.",
  );
  console.log("");
  console.log("Expected message body:");
  console.log(
    '  "Your family set up a BitRemit account for you. You\'ll receive money via M-Pesa."',
  );
} else if (r.status === 409) {
  console.log(
    "⚠️  Phone already registered — pick a different number to re-test SMS",
  );
} else {
  console.error("❌ Unexpected status:", r.status);
  process.exit(1);
}
