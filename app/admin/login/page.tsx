'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setError('Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="font-playfair text-2xl text-white">La Brocante de Nanie</h1>
          <p className="text-stone-400 text-sm font-inter mt-1">Administration</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-stone-800 rounded-lg p-6 border border-stone-700">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-inter px-4 py-3 rounded-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-inter text-stone-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-700 border border-stone-600 rounded-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-sm font-inter"
              placeholder="admin@labrocantedenanie.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-inter text-stone-300 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-700 border border-stone-600 rounded-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent text-sm font-inter pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-terracotta-500 text-white font-inter font-medium text-sm rounded-sm hover:bg-terracotta-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-stone-600 text-xs font-inter mt-6">
          <a href="/" className="hover:text-stone-400 transition-colors">← Retour au site</a>
        </p>
      </div>
    </div>
  )
}
