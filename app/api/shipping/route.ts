import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { calculateShipping } from '@/lib/shipping'

export async function GET(req: NextRequest) {
  const total = parseFloat(req.nextUrl.searchParams.get('total') || '0')
  const cost = await calculateShipping(total)
  return NextResponse.json({ cost })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { rules } = await req.json()

    for (const [id, cost] of Object.entries(rules)) {
      await prisma.shippingRule.update({
        where: { id },
        data: { cost: cost as number },
      })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
