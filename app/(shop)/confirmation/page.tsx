export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, Clock, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail } from '@/lib/resend'
import ClearCartOnMount from '@/components/shop/ClearCartOnMount'

export const metadata: Metadata = {
  title: 'Commande confirmee',
  robots: { index: false },
}

// Returns: 'confirmed' | 'pending' | 'not_found'
type PaymentStatus = 'confirmed' | 'pending' | 'not_found'

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; paypal?: string; order_id?: string }>
}) {
  const { session_id, paypal, order_id } = await searchParams
  const isPayPal = !!paypal
  let orderReference = ''
  let status: PaymentStatus = 'not_found'

  // ─── STRIPE FLOW ──────────────────────────────────────────────────────────
  if (session_id) {
    try {
      // 1. Look up by stripeSessionId — set by both the webhook and the fallback below.
      //    This is the fast path when the webhook already fired before this page loaded.
      const existing = await prisma.order.findFirst({
        where: { stripeSessionId: session_id },
      })

      if (existing) {
        orderReference = existing.id.slice(-8).toUpperCase()
        status = 'confirmed'
      } else {
        // 2. Webhook hasn't fired yet (or was delayed). Verify payment directly with Stripe.
        const session = await stripe.checkout.sessions.retrieve(session_id)

        if (session.payment_status !== 'paid') {
          // Payment genuinely not complete — show pending state, do not create an order.
          status = 'pending'
        } else {
          // Payment is confirmed by Stripe. Create the order here as a fallback so the
          // customer sees their reference immediately. The webhook may still fire later;
          // the idempotency guard in the webhook will silently skip it.
          const meta = session.metadata!
          const productIds: string[] = JSON.parse(meta.productIds)
          const shippingAddress = JSON.parse(meta.shippingAddress)
          const shippingCost = parseFloat(meta.shippingCost)

          const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
          })

          const subtotal = products.reduce((sum, p) => sum + p.price, 0)
          const totalAmount = subtotal + shippingCost

          try {
            const order = await prisma.order.create({
              data: {
                stripePaymentId: session.payment_intent as string,
                stripeSessionId: session_id,
                customerName: meta.customerName,
                customerEmail: session.customer_email!,
                customerPhone: meta.customerPhone || '',
                shippingAddress,
                totalAmount,
                shippingCost,
                status: 'CONFIRMED',
                items: {
                  create: products.map((p) => ({
                    productId: p.id,
                    price: p.price,
                  })),
                },
              },
            })

            await prisma.product.updateMany({
              where: { id: { in: productIds } },
              data: { status: 'SOLD' },
            })

            orderReference = order.id.slice(-8).toUpperCase()
            status = 'confirmed'

            // Send email only from this fallback path. If the webhook fires later it will
            // find the existing order via the idempotency check and skip — no duplicate email.
            await sendOrderConfirmationEmail({
              customerName: meta.customerName,
              customerEmail: session.customer_email!,
              orderId: order.id,
              orderReference,
              orderItems: products.map((p) => ({ title: p.title, price: p.price })),
              totalAmount,
              shippingCost,
              shippingAddress,
            })
          } catch {
            // Unique constraint: the webhook won the race and already created the order.
            // Re-query by stripeSessionId to get the reference — no email needed (webhook sent it).
            const webhookOrder = await prisma.order.findFirst({
              where: { stripeSessionId: session_id },
            })
            if (webhookOrder) {
              orderReference = webhookOrder.id.slice(-8).toUpperCase()
              status = 'confirmed'
            }
          }
        }
      }
    } catch (error) {
      console.error('Stripe confirmation error:', error)
      // Invalid or non-existent session_id — status stays 'not_found'
    }
  }

  // ─── PAYPAL FLOW ──────────────────────────────────────────────────────────
  // The capture-order route returns the Prisma order.id. Look it up directly.
  if (isPayPal && order_id) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: order_id },
      })
      if (order) {
        orderReference = order.id.slice(-8).toUpperCase()
        status = 'confirmed'
      }
    } catch (error) {
      console.error('PayPal reference lookup error:', error)
    }
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────

  if (status === 'pending') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={40} className="text-amber-500" />
          </div>
          <h1 className="font-playfair text-3xl text-brown-dark mb-3">Paiement en cours</h1>
          <p className="text-stone-500 font-inter leading-relaxed mb-8">
            Votre paiement est en cours de traitement. Vous recevrez un email de confirmation dès qu'il sera validé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/boutique" className="btn-secondary flex-1 justify-center">
              Retour a la boutique
            </Link>
            <Link href="/contact" className="btn-primary flex-1 justify-center">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'not_found') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-stone-400" />
          </div>
          <h1 className="font-playfair text-3xl text-brown-dark mb-3">Commande introuvable</h1>
          <p className="text-stone-500 font-inter leading-relaxed mb-8">
            Nous n'avons pas pu retrouver votre commande. Si vous avez effectué un paiement, vérifiez votre email ou utilisez la page de suivi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/boutique" className="btn-secondary flex-1 justify-center">
              Retour a la boutique
            </Link>
            <Link href="/suivi" className="btn-primary flex-1 justify-center">
              Suivre ma commande <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // status === 'confirmed'
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <ClearCartOnMount />
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="font-playfair text-3xl text-brown-dark mb-3">
          Commande confirmee !
        </h1>

        <p className="text-stone-500 font-inter leading-relaxed mb-6">
          Merci pour votre achat{isPayPal ? ' via PayPal' : ''} ! Vous allez recevoir un email de confirmation avec votre reference de commande.
        </p>

        {orderReference && (
          <div className="bg-white border border-beige rounded-sm p-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-terracotta-500 shrink-0" />
              <div>
                <p className="text-sm font-inter font-medium text-stone-700">Reference de commande</p>
                <p className="text-xl text-brown-dark font-mono font-bold mt-0.5 tracking-widest">
                  {orderReference}
                </p>
                <p className="text-xs text-stone-400 font-inter mt-1">
                  Conservez cette reference pour suivre votre commande.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-beige rounded-sm p-5 mb-8 text-left">
          <h3 className="font-playfair text-lg text-brown-dark mb-3">Et maintenant ?</h3>
          <ul className="space-y-2 text-sm font-inter text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-terracotta-500 font-bold shrink-0">1.</span>
              Vous recevrez un email de confirmation avec le detail de votre commande.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta-500 font-bold shrink-0">2.</span>
              Nous preparons soigneusement votre colis (1-2 jours ouvres).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta-500 font-bold shrink-0">3.</span>
              Vous recevrez un email avec le numero de suivi des l'expedition.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/boutique" className="btn-secondary flex-1 justify-center">
            Retour a la boutique
          </Link>
          <Link href="/suivi" className="btn-primary flex-1 justify-center">
            Suivre ma commande <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
