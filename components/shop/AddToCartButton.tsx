'use client'

import { useCart } from '@/lib/cart'
import { ShoppingBag, Check } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { Product } from '@prisma/client'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const { addItem, isInCart } = useCart()
  const isSold = product.status === 'SOLD'
  const inCart = isInCart(product.id)

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      slug: product.slug,
      weight: product.weight || 0,
      freeShipping: (product as any).freeShipping ?? false,
    })
    toast.success(`${product.title} ajouté au panier !`)
  }

  if (isSold) {
    return (
      <div className="w-full py-3 px-6 bg-stone-100 text-stone-500 text-center font-inter text-sm rounded-sm border border-stone-200">
        Cet article a été vendu
      </div>
    )
  }

  if (inCart) {
    return (
      <div className="flex gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-green-50 text-green-700 border border-green-200 rounded-sm font-inter text-sm">
          <Check size={16} />
          Dans votre panier
        </div>
        <Link href="/panier" className="flex-1 btn-primary text-center py-3">
          Voir le panier
        </Link>
      </div>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full btn-primary py-4 text-base gap-3"
    >
      <ShoppingBag size={18} />
      Ajouter au panier
    </button>
  )
}
