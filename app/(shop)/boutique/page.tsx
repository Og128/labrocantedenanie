import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import type { Category } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Découvrez notre sélection d\'objets anciens, meubles, vaisselle et curiosités authentiques.',
}

interface SearchParams extends Record<string, string | undefined> {
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  page?: string
  featured?: string
  search?: string
}

const PRODUCTS_PER_PAGE = 12

async function getProducts(params: SearchParams) {
  const {
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = '1',
    featured,
    search,
  } = params

  const where: Record<string, unknown> = {
    status: 'AVAILABLE',
  }

  if (category) where.category = category as Category
  if (featured === 'true') where.featured = true

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice)
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice)
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy: Record<string, string> = {}
  switch (sort) {
    case 'price_asc': orderBy.price = 'asc'; break
    case 'price_desc': orderBy.price = 'desc'; break
    case 'oldest': orderBy.createdAt = 'asc'; break
    default: orderBy.createdAt = 'desc'; break
  }

  const skip = (parseInt(page) - 1) * PRODUCTS_PER_PAGE

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, take: PRODUCTS_PER_PAGE, skip }),
    prisma.product.count({ where }),
  ])

  return { products, total, pages: Math.ceil(total / PRODUCTS_PER_PAGE) }
}

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { products, total, pages } = await getProducts(params)
  const currentPage = parseInt(params.page || '1')

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="section-title">La Boutique</h1>
          <p className="section-subtitle mt-2">
            {total} article{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <ShopFilters currentParams={params} />
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-playfair text-2xl text-stone-400 mb-3">Aucun article trouvé</p>
                <p className="text-stone-400 font-inter text-sm">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <a
                        key={p}
                        href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-sm text-sm font-inter transition-colors ${
                          p === currentPage
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-white border border-beige text-stone-600 hover:border-terracotta-400'
                        }`}
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
