export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Package, ShoppingCart, TrendingUp, Eye, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tableau de bord | Admin',
  robots: { index: false },
}

async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalProducts,
    availableProducts,
    soldProducts,
    totalOrders,
    monthOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'AVAILABLE' } }),
    prisma.product.count({ where: { status: 'SOLD' } }),
    prisma.order.count(),
    prisma.order.findMany({
      where: { createdAt: { gte: startOfMonth }, status: { not: 'CANCELLED' } },
    }),
    prisma.order.findMany({
      include: {
        items: { include: { product: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const monthCA = monthOrders.reduce((acc, o) => acc + o.totalAmount, 0)

  return {
    totalProducts,
    availableProducts,
    soldProducts,
    totalOrders,
    monthOrders: monthOrders.length,
    monthCA,
    recentOrders,
  }
}

const ORDER_STATUS_FR: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: 'Articles en ligne',
      value: stats.availableProducts,
      icon: Package,
      color: 'bg-terracotta-50 text-terracotta-600',
      href: '/admin/produits',
    },
    {
      label: 'Articles vendus',
      value: stats.soldProducts,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
      href: '/admin/produits?status=SOLD',
    },
    {
      label: 'Commandes ce mois',
      value: stats.monthOrders,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/commandes',
    },
    {
      label: 'CA du mois',
      value: formatPrice(stats.monthCA),
      icon: Eye,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/commandes',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-800 font-inter">Tableau de bord</h1>
        <p className="text-stone-400 text-sm mt-1">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.label} href={card.href} className="admin-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-stone-400 font-inter">{card.label}</p>
                  <p className="text-2xl font-semibold text-stone-800 mt-1">{card.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent orders */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800 font-inter">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm text-terracotta-500 hover:underline font-inter flex items-center gap-1">
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="text-stone-400 text-sm font-inter text-center py-8">Aucune commande pour l'instant</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2.5 pr-4 text-stone-400 font-medium">Commande</th>
                  <th className="text-left py-2.5 pr-4 text-stone-400 font-medium">Client</th>
                  <th className="text-left py-2.5 pr-4 text-stone-400 font-medium">Articles</th>
                  <th className="text-left py-2.5 pr-4 text-stone-400 font-medium">Montant</th>
                  <th className="text-left py-2.5 text-stone-400 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 hover:bg-stone-50">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/commandes/${order.id}`} className="text-terracotta-500 hover:underline font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {format(order.createdAt, 'd MMM yyyy', { locale: fr })}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-stone-600">{order.customerName}</td>
                    <td className="py-3 pr-4 text-stone-500">
                      {order.items.map((i) => i.product.title).join(', ').slice(0, 40)}...
                    </td>
                    <td className="py-3 pr-4 font-medium text-stone-800">{formatPrice(order.totalAmount)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || ''}`}>
                        {ORDER_STATUS_FR[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
