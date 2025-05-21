import { NextRequest, NextResponse } from 'next/server';

/**
 * Configure CORS middleware
 * @param req - The incoming request
 * @param res - The response to modify
 */
export function configureCors(req: NextRequest, res: NextResponse): NextResponse {
  // Get allowed origins from environment variable
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];
  
  // Get the origin from the request
  const origin = req.headers.get('origin') || '';
  
  // Check if the origin is allowed
  const isAllowedOrigin = allowedOrigins.includes(origin) || 
                          allowedOrigins.includes('*') ||
                          process.env.NODE_ENV === 'development';
  
  // Set CORS headers
  if (isAllowedOrigin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 204,
      headers: res.headers
    });
  }
  
  return res;
}
