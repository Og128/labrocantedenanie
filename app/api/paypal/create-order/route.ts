import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPayPalOrder } from '@/lib/paypal'
import { calculateShipping } from '@/lib/shipping'
import { z } from 'zod'

const bodySchema = z.object({
  items: z.array(z.object({ id: z.string().min(1).max(50) })).min(1).max(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items } = bodySchema.parse(body)

    const productIds = items.map((i) => i.id)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'AVAILABLE' },
    })

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id))
      const unavailableIds = productIds.filter((id) => !foundIds.has(id))
      return NextResponse.json(
        { error: 'Un ou plusieurs articles ne sont plus disponibles', unavailableIds },
        { status: 400 }
      )
    }

    const subtotal = products.reduce((sum, p) => sum + p.price, 0)
    const shipping = await calculateShipping(subtotal)
    const total = subtotal + shipping

    const paypalOrderId = await createPayPalOrder(total)

    return NextResponse.json({ id: paypalOrderId })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('PayPal create-order error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 })
  }
}
