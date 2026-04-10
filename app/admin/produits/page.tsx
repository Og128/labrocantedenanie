export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice, CATEGORY_LABELS, CONDITION_LABELS } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Edit, Eye } from 'lucide-react'
import ProductStatusToggle from '@/components/admin/ProductStatusToggle'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import type { Metadata } from 'next'
import type { Status } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Articles | Admin',
  robots: { index: false },
}

export default async function AdminProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string }>
}) {
  const params = await searchParams
  const status = params.status as Status | undefined
  const category = params.category

  const products = await prisma.product.findMany({
    where: {
      ...(status && { status }),
      ...(category && { category: category as any }),
    },
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-800 font-inter">Articles</h1>
        <Link href="/admin/produits/nouveau" className="btn-primary gap-2 text-sm">
          <PlusCircle size={16} />
          Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        {[
          { label: 'Tous', value: undefined },
          { label: 'Disponibles', value: 'AVAILABLE' },
          { label: 'Vendus', value: 'SOLD' },
        ].map((f) => (
          <a
            key={f.label}
            href={f.value ? `?status=${f.value}` : '/admin/produits'}
            className={`px-3 py-1.5 text-sm font-inter rounded-sm border transition-colors ${
              status === f.value || (!status && !f.value)
                ? 'bg-terracotta-500 text-white border-terracotta-500'
                : 'bg-white text-stone-600 border-stone-200 hover:border-terracotta-400'
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="admin-card text-center py-16">
          <p className="text-stone-400 font-inter mb-4">Aucun article pour l'instant</p>
          <Link href="/admin/produits/nouveau" className="btn-primary text-sm">
            Créer le premier article
          </Link>
        </div>
      ) : (
        <div className="admin-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Article</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium hidden lg:table-cell">État</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Prix</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Statut</th>
                  <th className="text-left px-4 py-3 text-stone-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded shrink-0 overflow-hidden bg-stone-100">
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          )}
                        </div>
                        <span className="font-medium text-stone-800 line-clamp-2 max-w-[200px]">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                      {CATEGORY_LABELS[product.category] || product.category}
                    </td>
                    <td className="px-4 py-3 text-stone-500 hidden lg:table-cell">
                      {CONDITION_LABELS[product.condition]}
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-800">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <ProductStatusToggle product={product} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/produits/${product.id}`}
                          className="p-1.5 text-stone-400 hover:text-terracotta-500 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </Link>
                        <Link
                          href={`/produit/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-blue-500 transition-colors"
                          title="Voir la fiche"
                        >
                          <Eye size={16} />
                        </Link>
                        <DeleteProductButton productId={product.id} productTitle={product.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
