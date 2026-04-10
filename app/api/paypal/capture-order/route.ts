import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { capturePayPalOrder } from '@/lib/paypal'
import { calculateShipping } from '@/lib/shipping'
import { sendOrderConfirmationEmail } from '@/lib/resend'
import { z } from 'zod'

const captureSchema = z.object({
  orderID: z.string().min(1).max(50),
  items: z.array(z.object({ id: z.string().min(1).max(50) })).min(1).max(20),
  customerName: z.string().min(1).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(20).optional(),
  shippingAddress: z.object({
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(10),
    country: z.string().min(1).max(100),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderID, items, shippingAddress, customerName, customerEmail, customerPhone } =
      captureSchema.parse(body)

    // Capture payment on PayPal
    const capture = await capturePayPalOrder(orderID)

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Paiement non complété' }, { status: 400 })
    }

    // Re-verify product availability after payment capture
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

    const order = await prisma.order.create({
      data: {
        stripePaymentId: `paypal_${orderID}`,
        stripeSessionId: `paypal_${orderID}`,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        shippingAddress,
        shippingCost: shipping,
        totalAmount: total,
        status: 'CONFIRMED',
        items: {
          create: products.map((p) => ({
            productId: p.id,
            price: p.price,
          })),
        },
      },
      include: { items: true },
    })

    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { status: 'SOLD' },
    })

    await sendOrderConfirmationEmail({
      customerEmail,
      customerName,
      orderId: order.id,
      orderItems: products.map((p) => ({ title: p.title, price: p.price })),
      totalAmount: total,
      shippingCost: shipping,
      shippingAddress,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    console.error('PayPal capture-order error:', error)
    return NextResponse.json({ error: 'Erreur lors de la capture du paiement' }, { status: 500 })
  }
}
