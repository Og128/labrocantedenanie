'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { CATEGORY_LABELS } from '@/lib/utils'
import { SlidersHorizontal, X } from 'lucide-react'

interface ShopFiltersProps {
  currentParams: Record<string, string | undefined>
}

const PRICE_RANGES = [
  { label: 'Moins de 50 €', max: '50' },
  { label: '50 € – 100 €', min: '50', max: '100' },
  { label: '100 € – 250 €', min: '100', max: '250' },
  { label: '250 € – 500 €', min: '250', max: '500' },
  { label: 'Plus de 500 €', min: '500' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récents' },
  { value: 'oldest', label: 'Plus anciens' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
]

export default function ShopFilters({ currentParams }: ShopFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    const merged = { ...currentParams, ...updates, page: '1' }
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => router.push(pathname)

  const hasFilters = !!(currentParams.category || currentParams.minPrice || currentParams.maxPrice || currentParams.featured)

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-sm font-inter font-semibold text-brown uppercase tracking-wider mb-3">Trier par</h3>
        <select
          value={currentParams.sort || 'newest'}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="w-full text-sm border border-beige rounded-sm px-3 py-2 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-inter font-semibold text-brown uppercase tracking-wider mb-3">Catégorie</h3>
        <div className="space-y-1.5">
          <button
            onClick={() => updateParams({ category: undefined })}
            className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors font-inter ${
              !currentParams.category
                ? 'bg-terracotta-50 text-terracotta-600 font-medium'
                : 'text-stone-600 hover:bg-beige'
            }`}
          >
            Toutes les catégories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => updateParams({ category: key })}
              className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors font-inter ${
                currentParams.category === key
                  ? 'bg-terracotta-50 text-terracotta-600 font-medium'
                  : 'text-stone-600 hover:bg-beige'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-inter font-semibold text-brown uppercase tracking-wider mb-3">Prix</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isActive =
              currentParams.minPrice === (range.min || '') &&
              currentParams.maxPrice === (range.max || '')
            return (
              <button
                key={range.label}
                onClick={() => updateParams({ minPrice: range.min, maxPrice: range.max })}
                className={`w-full text-left text-sm px-3 py-2 rounded-sm transition-colors font-inter ${
                  isActive
                    ? 'bg-terracotta-50 text-terracotta-600 font-medium'
                    : 'text-stone-600 hover:bg-beige'
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={currentParams.featured === 'true'}
            onChange={(e) =>
              updateParams({ featured: e.target.checked ? 'true' : undefined })
            }
            className="w-4 h-4 text-terracotta-500 border-beige rounded focus:ring-terracotta-400"
          />
          <span className="text-sm font-inter text-stone-700">Coups de cœur uniquement</span>
        </label>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 text-sm font-inter text-stone-500 hover:text-terracotta-500 transition-colors py-2"
        >
          <X size={14} />
          Effacer les filtres
        </button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden w-full flex items-center justify-between bg-white border border-beige px-4 py-3 rounded-sm text-sm font-inter font-medium text-stone-700 mb-4"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="flex items-center gap-2"><SlidersHorizontal size={16} /> Filtres</span>
        {hasFilters && (
          <span className="bg-terracotta-500 text-white text-xs px-2 py-0.5 rounded-full">
            Actifs
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <div className={`bg-white border border-beige rounded-sm p-5 ${mobileOpen ? '' : 'hidden lg:block'}`}>
        <FilterContent />
      </div>
    </>
  )
}
