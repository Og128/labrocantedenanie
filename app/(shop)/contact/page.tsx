'use client'

import { useState } from 'react'
import { MapPin, Mail, Clock } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(3, 'Sujet requis'),
  message: z.string().min(10, 'Message trop court'),
})

type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setSent(true)
        reset()
        toast.success('Message envoyé !')
      } else {
        throw new Error()
      }
    } catch {
      toast.error('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-offwhite">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title">Nous contacter</h1>
          <p className="section-subtitle">Une question sur un article ? Besoin d'un renseignement ? Nous vous répondons sous 24h.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Infos */}
          <div className="lg:col-span-2">
            <h2 className="font-playfair text-xl text-brown-dark mb-6">Coordonnées</h2>

            <div className="space-y-5">
              {[
                { icon: MapPin, label: 'Adresse', value: '14 Rue des Huguenots\n83670 Tavernes (Var)' },
                { icon: Mail, label: 'Email', value: 'contact@labrocantedenanie.com' },
                { icon: Clock, label: 'Présence', value: 'Vide-greniers & brocantes\ndans le Var, Haut-Var et Verdon' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-9 h-9 bg-terracotta-50 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-terracotta-500" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-inter uppercase tracking-wide">{label}</p>
                    <p className="text-stone-700 font-inter text-sm whitespace-pre-line mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-sm border border-beige p-6">
            <h2 className="font-playfair text-xl text-brown-dark mb-6">Envoyer un message</h2>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-green-600" />
                </div>
                <h3 className="font-playfair text-xl text-stone-700 mb-2">Message envoyé !</h3>
                <p className="text-stone-500 font-inter text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                <button onClick={() => setSent(false)} className="mt-6 btn-secondary text-sm">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">Nom *</label>
                    <input {...register('name')} className="input-field" placeholder="Dupont" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label-field">Email *</label>
                    <input {...register('email')} type="email" className="input-field" placeholder="vous@exemple.fr" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label-field">Sujet *</label>
                  <input {...register('subject')} className="input-field" placeholder="Question sur un article..." />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="label-field">Message *</label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Votre message..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button type="submit" disabled={sending} className="btn-primary w-full py-3">
                  {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
