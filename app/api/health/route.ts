// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const healthData = {
    status: 'healthy',
    service: 'ribit-stripe-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
  }

  return NextResponse.json(healthData)
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}