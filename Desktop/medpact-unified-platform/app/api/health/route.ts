import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'connected',
      version: '1.0.0',
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed',
      database: 'disconnected',
    }

    return NextResponse.json(health, { status: 503 })
  }
}
