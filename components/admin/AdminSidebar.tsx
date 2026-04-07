'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  ExternalLink,
  PlusCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/admin/produits', icon: Package, label: 'Articles' },
  { href: '/admin/produits/nouveau', icon: PlusCircle, label: 'Nouvel article' },
  { href: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { href: '/admin/blog', icon: FileText, label: 'Blog' },
  { href: '/admin/contenu', icon: Settings, label: 'Contenu du site' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-stone-900 text-white z-40 hidden lg:flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-stone-700">
        <h1 className="font-playfair text-lg text-white">La Brocante du Sud</h1>
        <p className="text-stone-400 text-xs font-inter mt-0.5">Administration</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-inter transition-colors',
                isActive
                  ? 'bg-terracotta-500 text-white'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-stone-700">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-xs text-stone-500 hover:text-stone-300 transition-colors font-inter"
        >
          <ExternalLink size={12} />
          Voir le site public
        </a>
      </div>
    </aside>
  )
}
