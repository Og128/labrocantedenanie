'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

interface Props {
  productId: string
  productTitle: string
}

export default function DeleteProductButton({ productId, productTitle }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Supprimer "${productTitle}" ? Cette action est irréversible.`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la suppression')
        return
      }

      toast.success('Article supprimé')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Supprimer l'article"
      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  )
}
