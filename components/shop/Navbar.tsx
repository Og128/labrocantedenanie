'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/boutique', label: 'Boutique' },
  { href: '/boutique?category=MEUBLES', label: 'Meubles' },
  { href: '/boutique?category=DECORATION', label: 'Décoration' },
  { href: '/boutique?category=VAISSELLE', label: 'Vaisselle' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { items } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-offwhite shadow-sm border-b border-beige' : 'bg-offwhite/90 backdrop-blur-sm'
      )}
    >
      {/* Top bar */}
      <div className="bg-terracotta-500 text-white text-center text-xs py-1.5 px-4 font-inter">
        Livraison offerte dès 150€ d'achat en France métropolitaine
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-playfair text-xl font-semibold text-brown-dark">
              La Brocante du Sud
            </span>
            <span className="text-xs text-stone-400 font-inter hidden sm:block">
              Objets anciens & curiosités
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 text-sm font-inter text-stone-600 hover:text-terracotta-500 transition-colors rounded-sm',
                  pathname === link.href && 'text-terracotta-500 font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/boutique"
              className="p-2 text-stone-500 hover:text-terracotta-500 transition-colors"
              aria-label="Rechercher"
            >
              <Search size={20} />
            </Link>

            <Link
              href="/panier"
              className="relative p-2 text-stone-500 hover:text-terracotta-500 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag size={20} />
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-stone-500 hover:text-terracotta-500 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-offwhite border-t border-beige">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'px-3 py-2.5 text-sm font-inter text-stone-600 hover:text-terracotta-500 hover:bg-beige rounded-sm transition-colors',
                  pathname === link.href && 'text-terracotta-500 font-medium bg-terracotta-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
