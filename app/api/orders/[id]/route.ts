import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendShippingEmail } from '@/lib/resend'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true } },
    },
  })

  if (!order) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      trackingNumber: body.trackingNumber,
    },
  })

  // Send shipping email when status changes to SHIPPED
  if (body.status === 'SHIPPED' && body.trackingNumber) {
    await sendShippingEmail({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      orderId: order.id,
      trackingNumber: body.trackingNumber,
    })
  }

  return NextResponse.json(order)
}
