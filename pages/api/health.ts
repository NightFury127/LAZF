import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

type HealthResponse = {
  status: string;
  timestamp: string;
  uptime: number;
  database: string;
  environment: string;
};

/**
 * Health check endpoint for monitoring
 * Used by Railway and other deployment platforms to verify the app is running
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  let dbStatus = 'disconnected';

  // Check database connection
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();
    dbStatus = 'connected';
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  // Return health status
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development',
  });
}
