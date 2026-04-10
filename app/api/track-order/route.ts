import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email().max(254),
  reference: z.string().min(1).max(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, reference } = schema.parse(body)

    const ref = reference.trim().toLowerCase()

    const order = await prisma.order.findFirst({
      where: {
        customerEmail: { equals: email.trim(), mode: 'insensitive' },
        id: { endsWith: ref },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable. Verifiez votre email et votre reference.' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        id: order.id,
        reference: order.id.slice(-8).toUpperCase(),
        status: order.status,
        createdAt: order.createdAt,
        totalAmount: order.totalAmount,
        shippingCost: order.shippingCost,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        items: order.items.map((item) => ({
          title: item.product.title,
          price: item.price,
          image: item.product.images[0] || null,
        })),
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('Track order error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
