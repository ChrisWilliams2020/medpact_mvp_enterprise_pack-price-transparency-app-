import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Completely disabled - allow everything
  return NextResponse.next();
}

export const config = {
  matcher: [],  // Empty matcher = middleware won't run at all
};
