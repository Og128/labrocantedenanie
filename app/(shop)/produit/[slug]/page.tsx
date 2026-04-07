export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice, CATEGORY_LABELS, CONDITION_LABELS } from '@/lib/utils'
import AddToCartButton from '@/components/shop/AddToCartButton'
import ProductCard from '@/components/shop/ProductCard'
import type { Metadata } from 'next'
import { Tag, Ruler, Weight, CheckCircle, ChevronRight } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return {}

  return {
    title: product.title,
    description: `${product.description.replace(/<[^>]*>/g, '').slice(0, 160)}...`,
    openGraph: {
      images: [{ url: product.images[0] || '' }],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) notFound()

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      status: 'AVAILABLE',
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  const isSold = product.status === 'SOLD'

  return (
    <div className="bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-inter text-stone-400 mb-8">
          <Link href="/" className="hover:text-terracotta-500 transition-colors">Accueil</Link>
          <ChevronRight size={12} />
          <Link href="/boutique" className="hover:text-terracotta-500 transition-colors">Boutique</Link>
          <ChevronRight size={12} />
          <Link href={`/boutique?category=${product.category}`} className="hover:text-terracotta-500 transition-colors">
            {CATEGORY_LABELS[product.category]}
          </Link>
          <ChevronRight size={12} />
          <span className="text-stone-600 truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div className="space-y-3">
            <div className={`relative aspect-[4/5] rounded-sm overflow-hidden bg-beige ${isSold ? 'opacity-80' : ''}`}>
              <Image
                src={product.images[0] || '/images/placeholder.jpg'}
                alt={product.title}
                fill
                priority
                className={`object-cover ${isSold ? 'grayscale' : ''}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-stone-800/90 text-white font-inter font-medium text-lg px-8 py-3 uppercase tracking-widest">
                    Vendu
                  </span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-sm overflow-hidden bg-beige border border-beige hover:border-terracotta-400 transition-colors cursor-pointer">
                    <Image
                      src={img}
                      alt={`${product.title} - photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-xs font-inter text-terracotta-500 uppercase tracking-widest mb-2">
              {CATEGORY_LABELS[product.category]}
            </p>

            <h1 className="font-playfair text-3xl md:text-4xl text-brown-dark mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className={`font-playfair text-3xl font-semibold ${isSold ? 'text-stone-400 line-through' : 'text-brown-dark'}`}>
                {formatPrice(product.price)}
              </span>
              {isSold ? (
                <span className="bg-stone-100 text-stone-600 text-sm font-inter px-3 py-1 rounded-sm">Vendu</span>
              ) : (
                <span className="bg-terracotta-50 text-terracotta-600 text-xs font-inter px-3 py-1.5 rounded-sm border border-terracotta-200">
                  Pièce unique
                </span>
              )}
            </div>

            {/* Condition */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-cream rounded-sm border border-beige">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-inter text-stone-600">
                État : <strong>{CONDITION_LABELS[product.condition]}</strong>
              </span>
            </div>

            {/* Specs */}
            {(product.dimensions || product.weight) && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.dimensions && (
                  <div className="flex items-start gap-2 p-3 bg-cream rounded-sm">
                    <Ruler size={16} className="text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 font-inter">Dimensions</p>
                      <p className="text-sm text-stone-700 font-inter">{product.dimensions}</p>
                    </div>
                  </div>
                )}
                {product.weight && (
                  <div className="flex items-start gap-2 p-3 bg-cream rounded-sm">
                    <Weight size={16} className="text-stone-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400 font-inter">Poids</p>
                      <p className="text-sm text-stone-700 font-inter">{product.weight} kg</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-inter text-stone-500 bg-beige px-2.5 py-1 rounded-full">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Add to cart */}
            <div className="mt-auto pt-4 border-t border-beige">
              <AddToCartButton product={product} />

              <p className="text-xs text-stone-400 font-inter mt-3 text-center">
                🔒 Paiement sécurisé · Livraison soignée · Retour sous 14 jours
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-cream rounded-sm p-8 mb-16 border border-beige">
          <h2 className="font-playfair text-2xl text-brown-dark mb-5">Description détaillée</h2>
          <div
            className="prose prose-stone max-w-none font-inter"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
