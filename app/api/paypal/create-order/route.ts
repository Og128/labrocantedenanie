import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createPayPalOrder } from '@/lib/paypal'
import { calculateShipping } from '@/lib/shipping'

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Verify products are still available
    const productIds = items.map((i: { id: string }) => i.id)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'AVAILABLE' },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Un ou plusieurs articles ne sont plus disponibles' },
        { status: 400 }
      )
    }

    const subtotal = products.reduce((sum, p) => sum + p.price, 0)
    const shipping = await calculateShipping(subtotal)
    const total = subtotal + shipping

    const paypalOrderId = await createPayPalOrder(total)

    return NextResponse.json({ id: paypalOrderId })
  } catch (error) {
    console.error('PayPal create-order error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 })
  }
}
