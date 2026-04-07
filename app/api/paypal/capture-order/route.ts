import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { capturePayPalOrder } from '@/lib/paypal'
import { calculateShipping } from '@/lib/shipping'
import { sendOrderConfirmationEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { orderID, items, shippingAddress, customerName, customerEmail, customerPhone } = await req.json()

    if (!orderID || !items || !customerEmail) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    // Capture payment on PayPal
    const capture = await capturePayPalOrder(orderID)

    if (capture.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Paiement non complété' }, { status: 400 })
    }

    // Verify products still available
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

    // Create order in DB
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
            title: p.title,
            price: p.price,
            image: p.images[0] || '',
          })),
        },
      },
      include: { items: true },
    })

    // Mark products as SOLD
    await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { status: 'SOLD' },
    })

    // Send confirmation email
    await sendOrderConfirmationEmail({
      customerEmail,
      customerName,
      orderId: order.id,
      orderItems: products.map((p) => ({
        title: p.title,
        price: p.price,
      })),
      totalAmount: total,
      shippingCost: shipping,
      shippingAddress,
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('PayPal capture-order error:', error)
    return NextResponse.json({ error: 'Erreur lors de la capture du paiement' }, { status: 500 })
  }
}
