import { NextResponse } from 'next/server';

/**
 * GET /api/rates
 * Returns current FX rates for remittance rails.
 * Cached for 1 hour.
 */
export async function GET() {
  const rates = {
    MPESA: { rate: 130, currency: 'KES' },
    GCASH: { rate: 56, currency: 'PHP' },
    MTNMOMO: { rate: 1620, currency: 'NGN' }, // Updated rate for NG
  };

  return NextResponse.json(rates, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

export const revalidate = 3600;
