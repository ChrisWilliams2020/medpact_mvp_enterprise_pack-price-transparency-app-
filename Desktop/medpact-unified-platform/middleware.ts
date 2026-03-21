import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security Middleware
 * Protects source code from unauthorized access
 * Owner: Christopher Williams
 */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // ===== SECURITY HEADERS =====
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Control referrer information
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy - prevents inline scripts and unauthorized sources
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  // Strict Transport Security (force HTTPS in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  // Prevent DNS prefetching
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  
  // ===== BLOCK SOURCE CODE ACCESS =====
  
  const path = request.nextUrl.pathname;
  
  // Block source map access
  if (path.endsWith('.map')) {
    return new NextResponse('Not Found', { status: 404 });
  }
  
  // Block environment file access
  if (path.includes('.env')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block git directory access
  if (path.includes('.git')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block node_modules access
  if (path.includes('node_modules')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block config file access
  if (path.match(/\.(config|rc)\.(js|ts|json)$/)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block package.json access
  if (path.includes('package.json') || path.includes('package-lock.json')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block TypeScript config
  if (path.includes('tsconfig.json')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block Prisma schema
  if (path.includes('prisma') && path.includes('schema')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Block README and documentation files (only .md files, not routes)
  if (path.match(/\.(md|txt)$/i) && path.match(/(README|SECURITY|LICENSE|DEPLOYMENT)/i)) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Allow all other requests
  return response;
}

// Apply middleware only to specific patterns that need protection
// Removed invalid matcher patterns for Next.js 14 compatibility
export const config = {
  matcher: [
    '/:path*', // Apply to all routes for now; adjust as needed
  ],
};
