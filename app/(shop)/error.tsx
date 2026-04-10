'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RefreshCw, ArrowLeft } from 'lucide-react'

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Shop error:', error.digest ?? error.message)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="font-playfair text-8xl text-beige font-bold mb-6 select-none">Oops</p>
        <h1 className="font-playfair text-3xl text-brown-dark mb-3">
          Une erreur est survenue
        </h1>
        <p className="text-stone-500 font-inter leading-relaxed mb-8">
          Quelque chose s'est mal passé. Vous pouvez réessayer ou retourner à la boutique.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/boutique" className="btn-secondary gap-2">
            <ArrowLeft size={16} />
            Retour à la boutique
          </Link>
          <button onClick={reset} className="btn-primary gap-2">
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      </div>
    </div>
  )
}
