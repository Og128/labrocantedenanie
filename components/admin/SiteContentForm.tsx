'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { SiteContent } from '@prisma/client'

const CONTENT_LABELS: Record<string, string> = {
  hero_title: 'Titre Hero (slogan)',
  hero_subtitle: 'Sous-titre Hero',
  about_text: 'Texte "À propos"',
  about_owner_name: 'Nom du brocanteur',
  contact_address: 'Adresse de contact',
  contact_phone: 'Téléphone',
  contact_email: 'Email de contact',
  contact_hours: 'Horaires d\'ouverture',
}

interface Props {
  contents: SiteContent[]
}

export default function SiteContentForm({ contents }: Props) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(contents.map((c) => [c.key, c.value]))
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: values }),
      })

      if (!res.ok) throw new Error()

      toast.success('Contenu mis à jour !')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <div key={content.key}>
          <label className="label-field">
            {CONTENT_LABELS[content.key] || content.key}
          </label>
          {content.type === 'richtext' ? (
            <textarea
              rows={6}
              value={values[content.key] || ''}
              onChange={(e) => setValues((prev) => ({ ...prev, [content.key]: e.target.value }))}
              className="input-field resize-none text-sm"
            />
          ) : (
            <input
              type="text"
              value={values[content.key] || ''}
              onChange={(e) => setValues((prev) => ({ ...prev, [content.key]: e.target.value }))}
              className="input-field"
            />
          )}
        </div>
      ))}

      <div className="pt-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary gap-2">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  )
}
