export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import OrderStatusUpdate from '@/components/admin/OrderStatusUpdate'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Détail commande | Admin',
  robots: { index: false },
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
    },
  })

  if (!order) notFound()

  const address = order.shippingAddress as Record<string, string>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/commandes" className="text-stone-400 hover:text-stone-600 text-sm font-inter">
          ← Commandes
        </Link>
        <span className="text-stone-300">/</span>
        <h1 className="text-xl font-semibold text-stone-800 font-inter">
          Commande #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Items + customer */}
        <div className="xl:col-span-2 space-y-5">
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Articles commandés</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center py-3 border-b border-stone-100 last:border-0">
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-stone-100 shrink-0">
                    {item.product.images[0] && (
                      <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" sizes="56px" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/admin/produits/${item.product.id}`} className="font-medium text-stone-800 hover:text-terracotta-500 text-sm">
                      {item.product.title}
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">Pièce unique</p>
                  </div>
                  <span className="font-medium text-stone-800">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-sm font-inter">
              <div className="flex justify-between text-stone-500">
                <span>Sous-total</span>
                <span>{formatPrice(order.totalAmount - order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Livraison</span>
                <span>{order.shippingCost === 0 ? 'Offerte' : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-stone-800">
                <span>Total</span>
                <span className="text-terracotta-500">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Informations client</h2>
            <div className="grid grid-cols-2 gap-4 text-sm font-inter">
              <div>
                <p className="text-stone-400 mb-0.5">Nom</p>
                <p className="font-medium text-stone-800">{order.customerName}</p>
              </div>
              <div>
                <p className="text-stone-400 mb-0.5">Email</p>
                <a href={`mailto:${order.customerEmail}`} className="font-medium text-terracotta-500 hover:underline">
                  {order.customerEmail}
                </a>
              </div>
              {order.customerPhone && (
                <div>
                  <p className="text-stone-400 mb-0.5">Téléphone</p>
                  <p className="font-medium text-stone-800">{order.customerPhone}</p>
                </div>
              )}
              <div>
                <p className="text-stone-400 mb-0.5">Date de commande</p>
                <p className="font-medium text-stone-800">{format(order.createdAt, "d MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100">
              <p className="text-stone-400 text-sm mb-2">Adresse de livraison</p>
              <address className="not-italic text-sm text-stone-700 font-inter">
                {address.line1}<br />
                {address.line2 && <>{address.line2}<br /></>}
                {address.postalCode} {address.city}<br />
                {address.country}
              </address>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div>
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Gérer la commande</h2>
            <OrderStatusUpdate order={{ id: order.id, status: order.status, trackingNumber: order.trackingNumber }} />

            <div className="mt-5 pt-5 border-t border-stone-100 text-sm font-inter">
              <p className="text-stone-400 mb-1">Référence Stripe</p>
              <p className="font-mono text-xs text-stone-600 break-all">{order.stripePaymentId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
