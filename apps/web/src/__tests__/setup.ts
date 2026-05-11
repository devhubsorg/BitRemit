// Using global jest types

// 1. Mock Prisma (@bitremit/database)
jest.mock('@bitremit/database', () => ({
  prisma: {
    recipient: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// 2. Mock Viem
jest.mock('viem', () => {
  const actual = jest.requireActual('viem');
  return {
    ...actual,
    createWalletClient: jest.fn(),
    createPublicClient: jest.fn(),
    readContract: jest.fn(),
    writeContract: jest.fn(),
  };
});

// 3. Mock Twilio
jest.mock('twilio', () => {
  return jest.fn().mockReturnValue({
    messages: {
      create: jest.fn().mockResolvedValue({ sid: 'mock_sid' }),
    },
  });
});

// 4. Mock Redis (@upstash/redis)
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  })),
}));

// 5. Mock Jose (JWT)
jest.mock('jose', () => {
  const actual = jest.requireActual('jose');
  return {
    ...actual,
    jwtVerify: jest.fn(),
    SignJWT: jest.fn().mockImplementation(() => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue('mock_token'),
    })),
  };
});

// Clear all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
