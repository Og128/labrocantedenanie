export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import Image from 'next/image'
import { Package, LogOut } from 'lucide-react'
import type { Metadata } from 'next'
import SignOutButton from '@/components/shop/SignOutButton'

export const metadata: Metadata = {
  title: 'Mon compte',
  robots: { index: false },
}

export default async function ComptePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/api/auth/signin?callbackUrl=/compte')

  const orders = await prisma.order.findMany({
    where: { customerEmail: session.user?.email! },
    include: {
      items: {
        include: { product: { select: { title: true, images: true, slug: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Mon compte</h1>
            <p className="text-stone-400 font-inter text-sm mt-1">{session.user?.email}</p>
          </div>
          <SignOutButton />
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-playfair text-2xl text-brown-dark mb-5">Mes commandes</h2>

          {orders.length === 0 ? (
            <div className="bg-white border border-beige rounded-sm p-12 text-center">
              <Package size={36} className="text-stone-300 mx-auto mb-4" />
              <p className="text-stone-400 font-inter mb-5">Vous n'avez pas encore passé de commande.</p>
              <Link href="/boutique" className="btn-primary">Découvrir la boutique</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-beige rounded-sm overflow-hidden">
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-stone-50 border-b border-beige">
                    <div>
                      <p className="text-sm font-inter font-medium text-stone-700">
                        Commande #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-stone-400 font-inter mt-0.5">
                        {format(order.createdAt, "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="font-playfair font-semibold text-stone-800">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-beige">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 px-5 py-4 items-center">
                        <div className="relative w-12 h-14 shrink-0 rounded-sm overflow-hidden bg-beige">
                          {item.product.images[0] && (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/produit/${item.product.slug}`}
                            className="text-sm font-inter text-stone-700 hover:text-terracotta-500 transition-colors"
                          >
                            {item.product.title}
                          </Link>
                        </div>
                        <span className="text-sm font-inter text-stone-500">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div className="px-5 py-3 bg-blue-50 border-t border-blue-100">
                      <p className="text-sm font-inter text-blue-700">
                        📦 Numéro de suivi : <strong className="font-mono">{order.trackingNumber}</strong>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
