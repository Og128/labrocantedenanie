'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ShippingRule } from '@prisma/client'

interface Props {
  rules: ShippingRule[]
}

export default function ShippingRulesForm({ rules }: Props) {
  const router = useRouter()
  const [costs, setCosts] = useState<Record<string, number>>(
    Object.fromEntries(rules.map((r) => [r.id, r.cost]))
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules: costs }),
      })

      if (!res.ok) throw new Error()

      toast.success('Tarifs mis à jour !')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-stone-400 font-inter mb-4">
        Modifiez les frais de livraison par tranche de prix de commande (€).
      </div>

      {rules.map((rule) => (
        <div key={rule.id} className="flex items-center gap-4 p-3 bg-stone-50 rounded-sm">
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-700 font-inter">{rule.name}</p>
            <p className="text-xs text-stone-400 font-inter">
              {formatPrice(rule.minPrice)} – {rule.maxPrice >= 9999 ? '∞' : formatPrice(rule.maxPrice)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-500 text-sm font-inter">Frais :</span>
            <input
              type="number"
              step="0.10"
              min="0"
              value={costs[rule.id]}
              onChange={(e) => setCosts((prev) => ({ ...prev, [rule.id]: parseFloat(e.target.value) }))}
              className="w-20 input-field py-1.5 text-sm text-center"
            />
            <span className="text-stone-500 text-sm">€</span>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Sauvegarde...' : 'Enregistrer les tarifs'}
        </button>
      </div>
    </div>
  )
}
