'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmée' },
  { value: 'PREPARING', label: 'En préparation' },
  { value: 'SHIPPED', label: 'Expédiée' },
  { value: 'DELIVERED', label: 'Livrée' },
  { value: 'CANCELLED', label: 'Annulée' },
  { value: 'REFUNDED', label: 'Remboursée' },
]

interface Props {
  order: {
    id: string
    status: string
    trackingNumber: string | null
  }
}

export default function OrderStatusUpdate({ order }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber: trackingNumber || null }),
      })

      if (!res.ok) throw new Error()

      toast.success('Commande mise à jour !')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label-field">Statut</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input-field"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label-field">Numéro de suivi</label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="input-field"
          placeholder="Ex: 1Z999AA10123456784"
        />
        {status === 'SHIPPED' && (
          <p className="text-xs text-amber-600 mt-1 font-inter">
            Un email sera automatiquement envoyé au client avec ce numéro de suivi.
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="btn-primary w-full gap-2"
      >
        <Save size={16} />
        {loading ? 'Sauvegarde...' : 'Enregistrer'}
      </button>
    </div>
  )
}
