'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { RefreshCw } from 'lucide-react'
import type { Product } from '@prisma/client'

interface Props {
  product: Pick<Product, 'id' | 'status'>
}

export default function ProductStatusToggle({ product }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(product.status)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    const newStatus = status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE'
    setLoading(true)

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error()

      setStatus(newStatus)
      router.refresh()
      toast.success(`Article marqué comme ${newStatus === 'AVAILABLE' ? 'disponible' : 'vendu'}`)
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={`Cliquer pour marquer comme ${status === 'AVAILABLE' ? 'vendu' : 'disponible'}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 ${
        status === 'AVAILABLE'
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      }`}
    >
      <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
      {status === 'AVAILABLE' ? 'Disponible' : 'Vendu'}
    </button>
  )
}
