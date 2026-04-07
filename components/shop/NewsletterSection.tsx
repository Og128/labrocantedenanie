'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage('Merci ! Vous êtes maintenant inscrit à notre newsletter.')
        setEmail('')
      } else {
        throw new Error()
      }
    } catch {
      setStatus('error')
      setMessage('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <section className="py-16 bg-terracotta-500">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <Mail size={32} className="text-terracotta-200 mx-auto mb-4" />
        <h2 className="font-playfair text-3xl text-white mb-3">
          Ne manquez aucune nouveauté
        </h2>
        <p className="text-terracotta-100 font-inter mb-8">
          Recevez nos nouvelles arrivées et nos sélections coups de cœur directement dans votre boîte mail.
        </p>

        {status === 'success' ? (
          <div className="bg-white/20 text-white py-4 px-6 rounded-sm font-inter">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              className="flex-1 px-4 py-3 bg-white text-stone-800 placeholder-stone-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-brown-dark text-white font-inter font-medium hover:bg-brown-dark/80 transition-colors rounded-sm disabled:opacity-50"
            >
              {status === 'loading' ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-terracotta-100 text-sm font-inter mt-3">{message}</p>
        )}

        <p className="text-terracotta-200 text-xs font-inter mt-4">
          En vous inscrivant, vous acceptez notre{' '}
          <a href="/confidentialite" className="underline hover:text-white">politique de confidentialité</a>.
          Désinscription possible à tout moment.
        </p>
      </div>
    </section>
  )
}
