// Global jest types used
import { GET, POST } from '@/app/api/recipients/route';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@bitremit/database';
import { createWalletClient, createPublicClient } from 'viem';
import twilio from 'twilio';

// Mock requireAuth
jest.mock('web3', () => ({
  requireAuth: jest.fn().mockResolvedValue({ userId: 'user_123', address: '0xabc...' }),
}));

import { requireAuth } from 'web3';

function createRequest(url: string, options: any = {}) {
  return new NextRequest(new URL(url, 'http://localhost'), options);
}

describe('Recipients API Routes', () => {
  describe('GET /api/recipients', () => {
    test('returns recipients for authenticated user', async () => {
      const mockRecipients = [{ id: '1', name: 'John Doe' }];
      (prisma.recipient.findMany as jest.Mock).mockResolvedValue(mockRecipients);

      const req = createRequest('/api/recipients');
      const res = await GET(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body).toEqual(mockRecipients);
      expect(prisma.recipient.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { receivedTxs: { some: { senderId: 'user_123' } } }
      }));
    });

    test('returns 401 if unauthenticated', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce(new NextResponse(null, { status: 401 }));
      
      const req = createRequest('/api/recipients');
      const res = await GET(req);
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/recipients', () => {
    const validBody = {
      name: 'Alice Smith',
      phoneNumber: '+254712345678',
      paymentRail: 'MPESA'
    };

    beforeEach(() => {
      process.env.BACKEND_SIGNER_PRIVATE_KEY = '0x123...';
      process.env.TWILIO_ACCOUNT_SID = 'sid';
      process.env.TWILIO_AUTH_TOKEN = 'token';
      process.env.TWILIO_PHONE_NUMBER = '+123456';
    });

    test('successfully creates recipient and triggers services', async () => {
      const mockRecipient = { ...validBody, id: 'rec_1' };
      (prisma.recipient.create as jest.Mock).mockResolvedValue(mockRecipient);
      
      // Mock Viem contract write
      const mockWriteContract = jest.fn().mockResolvedValue('0xtxhash');
      const mockWaitForReceipt = jest.fn().mockResolvedValue({});
      (createWalletClient as jest.Mock).mockReturnValue({ writeContract: mockWriteContract });
      (createPublicClient as jest.Mock).mockReturnValue({ waitForTransactionReceipt: mockWaitForReceipt });

      const req = createRequest('/api/recipients', {
        method: 'POST',
        body: JSON.stringify(validBody)
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(201);
      expect(body).toEqual(mockRecipient);
      
      // Verify DB call
      expect(prisma.recipient.create).toHaveBeenCalled();
      
      // Verify Blockchain call
      expect(mockWriteContract).toHaveBeenCalledWith(expect.objectContaining({
        functionName: 'registerRecipient'
      }));

      // Verify Twilio call
      expect(twilio).toHaveBeenCalled();
    });

    test('returns 400 for invalid phone format', async () => {
      const req = createRequest('/api/recipients', {
        method: 'POST',
        body: JSON.stringify({ ...validBody, phoneNumber: 'invalid' })
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    test('returns 409 if phone number already registered in DB', async () => {
      (prisma.recipient.create as jest.Mock).mockRejectedValue({ code: 'P2002' });
      
      const mockWriteContract = jest.fn().mockResolvedValue('0xtxhash');
      (createWalletClient as jest.Mock).mockReturnValue({ writeContract: mockWriteContract });
      (createPublicClient as jest.Mock).mockReturnValue({ waitForTransactionReceipt: jest.fn() });

      const req = createRequest('/api/recipients', {
        method: 'POST',
        body: JSON.stringify(validBody)
      });

      const res = await POST(req);
      expect(res.status).toBe(409);
    });
  });
});
