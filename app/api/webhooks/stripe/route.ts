import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/resend'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const metadata = session.metadata!
      const productIds = JSON.parse(metadata.productIds) as string[]
      const shippingAddress = JSON.parse(metadata.shippingAddress)
      const shippingCost = parseFloat(metadata.shippingCost)

      // Get products
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      })

      const totalAmount = (session.amount_total || 0) / 100

      // Create order
      const order = await prisma.order.create({
        data: {
          customerEmail: session.customer_email || '',
          customerName: metadata.customerName,
          customerPhone: metadata.customerPhone || null,
          shippingAddress,
          stripePaymentId: session.payment_intent as string,
          stripeSessionId: session.id,
          totalAmount,
          shippingCost,
          status: 'CONFIRMED',
          items: {
            create: products.map((p) => ({
              productId: p.id,
              quantity: 1,
              price: p.price,
            })),
          },
        },
      })

      // Mark products as sold
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: 'SOLD' },
      })

      // Send confirmation email
      await sendOrderConfirmationEmail({
        customerName: metadata.customerName,
        customerEmail: session.customer_email || '',
        orderId: order.id,
        orderItems: products.map((p) => ({ title: p.title, price: p.price })),
        totalAmount,
        shippingCost,
        shippingAddress,
      })

      console.log(`✅ Order ${order.id} created for ${session.customer_email}`)
    } catch (error) {
      console.error('Error processing webhook:', error)
      return NextResponse.json({ error: 'Processing error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

// App Router handles raw body automatically — no bodyParser config needed
