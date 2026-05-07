// Removed @jest/globals import to use global types
import { GET as getNonce } from '@/app/api/auth/nonce/route';
import { POST as verifySIWE } from '@/app/api/auth/verify/route';
import { GET as getSession } from '@/app/api/auth/session/route';
import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { jwtVerify } from 'jose';

// Helper to create a NextRequest
function createRequest(url: string, options: any = {}) {
  return new NextRequest(new URL(url, 'http://localhost'), options);
}

describe('Auth API Routes', () => {
  // @ts-ignore
  const redis = new Redis();

  describe('GET /api/auth/nonce', () => {
    test('returns a 32-character hex nonce', async () => {
      const res = await getNonce();
      const body = await res.json();
      
      expect(res.status).toBe(200);
      expect(body.nonce).toHaveLength(32);
      expect(body.nonce).toMatch(/^[0-9a-f]+$/);
    });

    test('returns different nonces on consecutive calls', async () => {
      const res1 = await getNonce();
      const res2 = await getNonce();
      const body1 = await res1.json();
      const body2 = await res2.json();
      
      expect(body1.nonce).not.toBe(body2.nonce);
    });
  });

  describe('POST /api/auth/verify', () => {
    const mockMessage = 'example.com wants you to sign in with your Ethereum account...';
    const mockSignature = '0x123...';

    test('returns 401 if nonce is not in Redis (expired or missing)', async () => {
      (redis.get as jest.Mock).mockResolvedValue(null);

      const req = createRequest('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ message: mockMessage, signature: mockSignature }),
      });

      const res = await verifySIWE(req);
      expect(res.status).toBe(401);
    });

    // Note: To test valid SIWE, we'd need a real SIWE message/signature pair or a deeper mock of the SiweMessage class
    // For this test, we assume the internal SIWE validation is handled by the library and we mock the outcome if possible.
  });

  describe('GET /api/auth/session', () => {
    test('returns 401 if no Authorization header', async () => {
      const req = createRequest('/api/auth/session');
      const res = await getSession(req);
      expect(res.status).toBe(401);
    });

    test('returns address if valid JWT provided', async () => {
      const mockAddress = '0x1234567890123456789012345678901234567890';
      (jwtVerify as jest.Mock).mockResolvedValue({
        payload: { address: mockAddress }
      });

      const req = createRequest('/api/auth/session', {
        headers: { Authorization: 'Bearer mock_token' }
      });

      const res = await getSession(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.address).toBe(mockAddress);
    });

    test('returns 401 for tampered/invalid JWT', async () => {
      (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

      const req = createRequest('/api/auth/session', {
        headers: { Authorization: 'Bearer bad_token' }
      });

      const res = await getSession(req);
      expect(res.status).toBe(401);
    });
  });
});
