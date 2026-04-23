import { NextResponse } from 'next/server'

// PayPal is disabled — no Business account configured.
export async function POST() {
  return NextResponse.json({ error: 'PayPal not available' }, { status: 503 })
}
