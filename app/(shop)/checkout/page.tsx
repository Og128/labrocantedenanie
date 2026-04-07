'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Téléphone requis'),
  address: z.string().min(5, 'Adresse requise'),
  address2: z.string().optional(),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(5, 'Code postal requis'),
  country: z.string().min(1, 'Pays requis'),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)
  const shipping = total() > 150 ? 0 : total() < 30 ? 5.9 : total() < 80 ? 8.9 : 12.9

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'France' },
  })

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: {
            line1: data.address,
            line2: data.address2 || '',
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
          },
          customerName: `${data.firstName} ${data.lastName}`,
          customerEmail: data.email,
          customerPhone: data.phone,
        }),
      })

      const { url } = await res.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      toast.error('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
        <p className="text-stone-500 font-inter mb-4">Votre panier est vide.</p>
        <Link href="/boutique" className="btn-primary">Retour à la boutique</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link href="/panier" className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-terracotta-500 transition-colors font-inter mb-6">
          <ArrowLeft size={14} /> Retour au panier
        </Link>

        <h1 className="section-title mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5">
            <div className="bg-white border border-beige rounded-sm p-6">
              <h2 className="font-playfair text-lg text-brown-dark mb-4">Vos informations</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Prénom</label>
                  <input {...register('firstName')} className="input-field" placeholder="Marie" />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1 font-inter">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="label-field">Nom</label>
                  <input {...register('lastName')} className="input-field" placeholder="Dupont" />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1 font-inter">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="label-field">Email</label>
                <input {...register('email')} type="email" className="input-field" placeholder="marie@example.fr" />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-inter">{errors.email.message}</p>}
              </div>

              <div className="mt-4">
                <label className="label-field">Téléphone</label>
                <input {...register('phone')} type="tel" className="input-field" placeholder="06 XX XX XX XX" />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-inter">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="bg-white border border-beige rounded-sm p-6">
              <h2 className="font-playfair text-lg text-brown-dark mb-4">Adresse de livraison</h2>

              <div>
                <label className="label-field">Adresse</label>
                <input {...register('address')} className="input-field" placeholder="12 rue des Fleurs" />
                {errors.address && <p className="text-red-500 text-xs mt-1 font-inter">{errors.address.message}</p>}
              </div>

              <div className="mt-4">
                <label className="label-field">Complément d'adresse (optionnel)</label>
                <input {...register('address2')} className="input-field" placeholder="Appartement, bâtiment..." />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label-field">Code postal</label>
                  <input {...register('postalCode')} className="input-field" placeholder="13100" />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1 font-inter">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="label-field">Ville</label>
                  <input {...register('city')} className="input-field" placeholder="Aix-en-Provence" />
                  {errors.city && <p className="text-red-500 text-xs mt-1 font-inter">{errors.city.message}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className="label-field">Pays</label>
                <select {...register('country')} className="input-field">
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base gap-3"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  Redirection vers le paiement...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Procéder au paiement sécurisé
                </>
              )}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-beige rounded-sm p-5 sticky top-28">
              <h2 className="font-playfair text-lg text-brown-dark mb-4">Votre commande</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="relative w-14 h-16 shrink-0 rounded-sm overflow-hidden bg-beige">
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-inter text-stone-700 line-clamp-2">{item.title}</p>
                      <p className="text-sm font-playfair font-semibold text-brown mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-beige pt-4 space-y-2 text-sm font-inter">
                <div className="flex justify-between text-stone-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Offerte' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-800 text-base pt-2 border-t border-beige">
                  <span>Total</span>
                  <span className="text-terracotta-500 font-playfair text-xl">{formatPrice(total() + shipping)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
