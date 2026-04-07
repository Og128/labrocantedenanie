import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { cn, formatPrice, CATEGORY_LABELS, CONDITION_LABELS } from '@/lib/utils'
import type { Product } from '@prisma/client'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const isSold = product.status === 'SOLD'
  const mainImage = product.images[0] || '/images/placeholder.jpg'

  return (
    <Link href={`/produit/${product.slug}`} className={cn('card-product block', className)}>
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-beige">
        <Image
          src={mainImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            isSold && 'grayscale opacity-70'
          )}
        />

        {isSold && (
          <div className="badge-sold">Vendu</div>
        )}

        {product.featured && !isSold && (
          <div className="badge-new">Coup de ♥</div>
        )}

        {/* Hover overlay */}
        {!isSold && (
          <div className="absolute inset-0 bg-brown-dark/0 group-hover:bg-brown-dark/10 transition-colors duration-300" />
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-inter text-terracotta-500 uppercase tracking-wider mb-1">
          {CATEGORY_LABELS[product.category] || product.category}
        </p>
        <h3 className="font-playfair text-stone-800 font-medium leading-tight line-clamp-2 mb-1">
          {product.title}
        </h3>
        <p className="text-xs text-stone-400 font-inter mb-3">
          {CONDITION_LABELS[product.condition]}
        </p>

        <div className="flex items-center justify-between">
          <span className={cn(
            'font-playfair text-lg font-semibold',
            isSold ? 'text-stone-400 line-through' : 'text-brown-dark'
          )}>
            {formatPrice(product.price)}
          </span>
          {!isSold && (
            <span className="text-xs text-stone-400 font-inter">Pièce unique</span>
          )}
        </div>
      </div>
    </Link>
  )
}
