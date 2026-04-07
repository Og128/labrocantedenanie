import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { calculateShipping } from '@/lib/shipping'
import { z } from 'zod'

const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    image: z.string(),
    slug: z.string(),
  })),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customerName, customerEmail, customerPhone, shippingAddress } =
      checkoutSchema.parse(body)

    if (items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 })
    }

    // Verify products are still available
    const productIds = items.map((i) => i.id)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: 'AVAILABLE' },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Certains articles ne sont plus disponibles' },
        { status: 400 }
      )
    }

    const subtotal = products.reduce((acc, p) => acc + p.price, 0)
    const shippingCost = await calculateShipping(subtotal)
    const total = subtotal + shippingCost

    const lineItems: any[] = products.map((product) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.title,
          images: product.images.slice(0, 1),
          metadata: { productId: product.id },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: 1,
    }))

    // Add shipping as a line item
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Frais de livraison',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/panier`,
      customer_email: customerEmail,
      metadata: {
        customerName,
        customerPhone: customerPhone || '',
        shippingAddress: JSON.stringify(shippingAddress),
        productIds: JSON.stringify(productIds),
        shippingCost: String(shippingCost),
      },
      payment_intent_data: {
        metadata: {
          customerName,
          productIds: JSON.stringify(productIds),
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
