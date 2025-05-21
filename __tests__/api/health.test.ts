import { createMocks } from 'node-mocks-http';
import healthHandler from '../../pages/api/health';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        $connect: jest.fn().mockResolvedValue(null),
        $disconnect: jest.fn().mockResolvedValue(null),
        $queryRaw: jest.fn().mockResolvedValue([{ '1': 1 }]),
      };
    }),
  };
});

describe('/api/health', () => {
  it('returns a 200 status and health data', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await healthHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const responseData = JSON.parse(res._getData());
    expect(responseData).toHaveProperty('status', 'ok');
    expect(responseData).toHaveProperty('timestamp');
    expect(responseData).toHaveProperty('uptime');
    expect(responseData).toHaveProperty('database', 'connected');
    expect(responseData).toHaveProperty('environment');
  });

  it('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await healthHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getHeaders()).toHaveProperty('allow', ['GET']);
  });
});
