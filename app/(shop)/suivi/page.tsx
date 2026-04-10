'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, XCircle, RotateCcw, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; step: number }> = {
  PENDING:    { label: 'En attente',      icon: Clock,        color: 'text-amber-500',    step: 1 },
  CONFIRMED:  { label: 'Confirmee',       icon: CheckCircle,  color: 'text-blue-500',     step: 2 },
  PREPARING:  { label: 'En preparation',  icon: Package,      color: 'text-purple-500',   step: 3 },
  SHIPPED:    { label: 'Expediee',        icon: Truck,        color: 'text-terracotta-500', step: 4 },
  DELIVERED:  { label: 'Livree',          icon: CheckCircle,  color: 'text-green-600',    step: 5 },
  CANCELLED:  { label: 'Annulee',         icon: XCircle,      color: 'text-red-500',      step: 0 },
  REFUNDED:   { label: 'Remboursee',      icon: RotateCcw,    color: 'text-stone-500',    step: 0 },
}

const STEPS = [
  { key: 'CONFIRMED',  label: 'Confirmee' },
  { key: 'PREPARING',  label: 'Preparation' },
  { key: 'SHIPPED',    label: 'Expediee' },
  { key: 'DELIVERED',  label: 'Livree' },
]

interface OrderData {
  id: string
  reference: string
  status: string
  createdAt: string
  totalAmount: number
  shippingCost: number
  shippingAddress: { line1: string; line2?: string; city: string; postalCode: string; country: string }
  trackingNumber: string | null
  items: { title: string; price: number; image: string | null }[]
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function SuiviPage() {
  const [email, setEmail] = useState('')
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderData | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch('/api/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reference }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Commande introuvable.')
      } else {
        setOrder(data.order)
      }
    } catch {
      setError('Une erreur est survenue. Veuillez reessayer.')
    } finally {
      setLoading(false)
    }
  }

  const statusConfig = order ? STATUS_CONFIG[order.status] : null
  const currentStep = statusConfig?.step ?? 0
  const isCancelledOrRefunded = order?.status === 'CANCELLED' || order?.status === 'REFUNDED'

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-beige py-12 border-b border-stone-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Package size={36} className="text-terracotta-500 mx-auto mb-3" />
          <h1 className="section-title mb-2">Suivi de commande</h1>
          <p className="text-stone-500 font-inter text-sm">
            Entrez votre email et votre reference de commande pour suivre votre colis.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Search Form */}
        <div className="bg-white rounded-sm border border-beige p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-inter font-medium text-stone-700 mb-1">
                Email utilise lors de la commande
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-inter font-medium text-stone-700 mb-1">
                Reference de commande
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                placeholder="Ex: AB3C9F12"
                maxLength={8}
                className="input-field w-full font-mono tracking-widest uppercase"
              />
              <p className="text-xs text-stone-400 font-inter mt-1">
                La reference de 8 caracteres se trouve dans votre email de confirmation.
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 text-sm text-red-700 font-inter">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Recherche...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Search size={16} />
                  Rechercher ma commande
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Order Result */}
        {order && statusConfig && (
          <div className="space-y-5">
            {/* Header */}
            <div className="bg-white rounded-sm border border-beige p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-stone-400 font-inter uppercase tracking-wider">Reference</p>
                  <p className="font-mono font-bold text-brown-dark text-lg">{order.reference}</p>
                  <p className="text-xs text-stone-400 font-inter mt-0.5">
                    Commandee le {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-100`}>
                  <statusConfig.icon size={18} className={statusConfig.color} />
                  <span className={`font-inter font-medium text-sm ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            {!isCancelledOrRefunded && (
              <div className="bg-white rounded-sm border border-beige p-5">
                <div className="flex items-center justify-between relative">
                  {/* Progress line */}
                  <div className="absolute left-0 right-0 top-4 h-0.5 bg-stone-100 mx-8" />
                  <div
                    className="absolute left-8 top-4 h-0.5 bg-terracotta-500 transition-all duration-500"
                    style={{ width: `${Math.max(0, ((currentStep - 2) / 3) * 100)}%`, maxWidth: 'calc(100% - 64px)' }}
                  />
                  {STEPS.map((step, i) => {
                    const stepNum = i + 2
                    const done = currentStep >= stepNum
                    const active = currentStep === stepNum
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          done
                            ? 'bg-terracotta-500 border-terracotta-500'
                            : 'bg-white border-stone-200'
                        }`}>
                          {done
                            ? <CheckCircle size={16} className="text-white" />
                            : <span className={`w-2 h-2 rounded-full ${active ? 'bg-terracotta-500' : 'bg-stone-200'}`} />
                          }
                        </div>
                        <span className={`text-xs font-inter text-center ${done ? 'text-terracotta-500 font-medium' : 'text-stone-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tracking Number */}
            {order.trackingNumber && (
              <div className="bg-terracotta-50 border border-terracotta-100 rounded-sm p-4 flex items-center gap-3">
                <Truck size={20} className="text-terracotta-500 shrink-0" />
                <div>
                  <p className="text-sm font-inter font-medium text-terracotta-700">Numero de suivi</p>
                  <p className="font-mono font-bold text-terracotta-600">{order.trackingNumber}</p>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-sm border border-beige p-5">
              <h2 className="font-playfair text-lg text-brown-dark mb-4">Articles commandes</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
                    {item.image && (
                      <div className="relative w-14 h-14 rounded-sm overflow-hidden bg-beige shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-inter text-sm font-medium text-stone-700 truncate">{item.title}</p>
                    </div>
                    <p className="font-inter text-sm font-medium text-brown-dark shrink-0">{formatPrice(item.price)}</p>
                  </div>
                ))}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm text-stone-500 font-inter">
                    <span>Livraison</span>
                    <span>{order.shippingCost === 0 ? 'Offerte' : formatPrice(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-inter font-semibold text-brown-dark">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-sm border border-beige p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-terracotta-500" />
                <h2 className="font-playfair text-lg text-brown-dark">Adresse de livraison</h2>
              </div>
              <p className="text-sm font-inter text-stone-600 leading-relaxed">
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                {order.shippingAddress.postalCode} {order.shippingAddress.city}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-stone-400 font-inter mb-2">Une question sur votre commande ?</p>
              <Link href="/contact" className="text-terracotta-500 text-sm font-inter hover:underline">
                Contacter la boutique
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
