export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Metadata } from 'next'
import type { OrderStatus } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Commandes | Admin',
  robots: { index: false },
}

export default async function AdminCommandesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const params = await searchParams
  const status = params.status as OrderStatus | undefined
  const page = parseInt(params.page || '1')
  const limit = 20

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: status ? { status } : {},
      include: {
        items: { include: { product: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: status ? { status } : {} }),
  ])

  const pages = Math.ceil(total / limit)

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 font-inter mb-6">Commandes</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[
          { label: 'Toutes', value: undefined },
          { label: 'En attente', value: 'PENDING' },
          { label: 'Confirmées', value: 'CONFIRMED' },
          { label: 'En préparation', value: 'PREPARING' },
          { label: 'Expédiées', value: 'SHIPPED' },
          { label: 'Livrées', value: 'DELIVERED' },
        ].map((f) => (
          <a
            key={f.label}
            href={f.value ? `?status=${f.value}` : '/admin/commandes'}
            className={`px-3 py-1.5 text-xs font-inter rounded-sm border transition-colors ${
              status === f.value || (!status && !f.value)
                ? 'bg-terracotta-500 text-white border-terracotta-500'
                : 'bg-white text-stone-600 border-stone-200 hover:border-terracotta-400'
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <div className="admin-card overflow-hidden p-0">
        {orders.length === 0 ? (
          <div className="text-center py-16 text-stone-400 font-inter">Aucune commande</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Réf.</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Client</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium hidden md:table-cell">Articles</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Montant</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Statut</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3 font-mono font-medium text-stone-700">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800">{order.customerName}</div>
                      <div className="text-xs text-stone-400">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                      {order.items.map((i) => i.product.title).join(', ').slice(0, 40)}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-800">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status] || ''}`}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">
                      {format(order.createdAt, 'd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="text-terracotta-500 hover:underline text-xs font-medium"
                      >
                        Détail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...(status && { status }), page: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded-sm text-sm font-inter ${
                p === page ? 'bg-terracotta-500 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-terracotta-400'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
