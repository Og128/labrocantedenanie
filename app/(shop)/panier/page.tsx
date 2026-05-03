'use client'

import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PanierPage() {
  const { items, removeItem, total, totalWeight, hasBillableItems } = useCart()
  const [shipping, setShipping] = useState<number | null>(null)

  useEffect(() => {
    if (!hasBillableItems()) {
      setShipping(0)
      return
    }
    fetch(`/api/shipping?weight=${totalWeight()}&total=${total()}`)
      .then((r) => r.json())
      .then((d) => setShipping(d.cost))
      .catch(() => setShipping(25))
  }, [items])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag size={48} className="text-stone-300 mb-4" />
        <h1 className="font-playfair text-2xl text-stone-600 mb-3">Votre panier est vide</h1>
        <p className="text-stone-400 font-inter mb-8">Découvrez notre sélection de pièces uniques</p>
        <Link href="/boutique" className="btn-primary">
          Découvrir la boutique
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="section-title mb-8">Mon panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-beige rounded-sm p-4 flex gap-4">
                <div className="relative w-20 h-24 shrink-0 rounded-sm overflow-hidden bg-beige">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/produit/${item.slug}`} className="font-playfair text-stone-800 hover:text-terracotta-500 transition-colors line-clamp-2">
                    {item.title}
                  </Link>
                  <p className="text-xs text-stone-400 font-inter mt-1">Pièce unique · Qté : 1</p>
                  <p className="font-playfair text-lg font-semibold text-brown-dark mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-stone-300 hover:text-red-500 transition-colors self-start"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white border border-beige rounded-sm p-6 h-fit sticky top-28">
            <h2 className="font-playfair text-xl text-brown-dark mb-5">Récapitulatif</h2>

            <div className="space-y-3 text-sm font-inter mb-5">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total ({items.length} article{items.length > 1 ? 's' : ''})</span>
                <span>{formatPrice(total())}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Livraison</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === null ? '...' : shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-600">🎉 Livraison offerte dès 150 € !</p>
              )}
              <div className="pt-3 border-t border-beige flex justify-between font-semibold text-stone-800 text-base">
                <span>Total</span>
                <span className="text-terracotta-500 font-playfair text-xl">
                  {shipping === null ? '...' : formatPrice(total() + shipping)}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full justify-center gap-2 py-3.5">
              Commander <ArrowRight size={16} />
            </Link>

            <p className="text-xs text-center text-stone-400 font-inter mt-3">
              🔒 Paiement sécurisé par Stripe
            </p>

            <div className="mt-4 pt-4 border-t border-beige text-center">
              <Link href="/boutique" className="text-sm text-stone-400 font-inter hover:text-terracotta-500 transition-colors">
                ← Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
