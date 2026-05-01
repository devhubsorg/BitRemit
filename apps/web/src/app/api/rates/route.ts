import { NextResponse } from "next/server";

// Lightweight FX endpoint used by StepAmount.
// Values can be replaced later by a provider-backed service.
const FX_RATES = {
  KES: 130.35,
  PHP: 56.4,
  NGN: 1620,
};

export async function GET() {
  return NextResponse.json(FX_RATES);
}
