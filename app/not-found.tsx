import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="font-playfair text-8xl text-beige font-bold mb-6 select-none">404</p>
        <h1 className="font-playfair text-3xl text-brown-dark mb-3">
          Page introuvable
        </h1>
        <p className="text-stone-500 font-inter leading-relaxed mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-secondary gap-2">
            <ArrowLeft size={16} />
            Accueil
          </Link>
          <Link href="/boutique" className="btn-primary gap-2">
            <Search size={16} />
            Voir la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}
