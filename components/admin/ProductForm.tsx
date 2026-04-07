'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Upload, X, Loader2, Save, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { CATEGORY_LABELS } from '@/lib/utils'
import type { Product } from '@prisma/client'

const productSchema = z.object({
  title: z.string().min(3, 'Titre requis (min. 3 caractères)'),
  description: z.string().min(10, 'Description requise'),
  price: z.number({ message: 'Prix requis' }).positive('Prix doit être positif'),
  category: z.string().min(1, 'Catégorie requise'),
  condition: z.string().min(1, 'État requis'),
  featured: z.boolean(),
  contactOnly: z.boolean(),
  weight: z.number().optional().nullable(),
  dimensions: z.string().optional(),
  tags: z.string().optional(),
  sortOrder: z.number(),
})

type ProductFormData = z.infer<typeof productSchema>

interface Props {
  product?: Product
}

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      condition: product.condition,
      featured: product.featured,
      contactOnly: (product as any).contactOnly ?? false,
      weight: product.weight || undefined,
      dimensions: product.dimensions || undefined,
      tags: product.tags.join(', '),
      sortOrder: product.sortOrder,
    } : {
      sortOrder: 0,
      featured: false,
      contactOnly: false,
    },
  })

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        uploadedUrls.push(url)
      } else {
        toast.error(`Erreur lors de l'upload de ${file.name}`)
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
    toast.success(`${uploadedUrls.length} photo(s) ajoutée(s)`)
  }, [])

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProductFormData) => {
    if (images.length === 0) {
      toast.error('Ajoutez au moins une photo')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...data,
        images,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        weight: data.weight || null,
        dimensions: data.dimensions || null,
      }

      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erreur serveur')
      }

      toast.success(product ? 'Article modifié !' : 'Article créé !')
      router.push('/admin/produits')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm('Supprimer cet article définitivement ?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Article supprimé')
      router.push('/admin/produits')
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="xl:col-span-2 space-y-5">

          {/* Title */}
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Informations principales</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Titre de l'article *</label>
                <input
                  {...register('title')}
                  className="input-field"
                  placeholder="Ex: Buffet provençal en chêne massif..."
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="label-field">Description *</label>
                <textarea
                  {...register('description')}
                  rows={8}
                  className="input-field resize-none"
                  placeholder="Décrivez l'article en détail : origine, matériaux, histoire, état, restaurations éventuelles..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">
              Photos ({images.length})
            </h2>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded overflow-hidden bg-stone-100 group">
                    <Image src={img} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-terracotta-500 text-white text-xs px-1.5 py-0.5 rounded">
                        Principale
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-sm p-6 cursor-pointer transition-colors ${
              uploading ? 'border-terracotta-300 bg-terracotta-50' : 'border-stone-200 hover:border-terracotta-400'
            }`}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageUpload}
                className="sr-only"
                disabled={uploading}
              />
              {uploading ? (
                <><Loader2 size={24} className="text-terracotta-500 animate-spin" /><span className="text-sm text-stone-500">Upload en cours...</span></>
              ) : (
                <><Upload size={24} className="text-stone-400" /><span className="text-sm text-stone-500">Glissez vos photos ici ou cliquez pour sélectionner</span><span className="text-xs text-stone-400">JPEG, PNG, WebP — 10 Mo max par fichier</span></>
              )}
            </label>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Détails</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Prix (€) *</label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-field"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="label-field">Catégorie *</label>
                <select {...register('category')} className="input-field">
                  <option value="">Choisir une catégorie</option>
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="label-field">État *</label>
                <select {...register('condition')} className="input-field">
                  <option value="">Choisir l'état</option>
                  <option value="EXCELLENT">Excellent état</option>
                  <option value="BON_ETAT">Bon état</option>
                  <option value="BON_ETAT_GENERAL">Bon état général</option>
                </select>
                {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition.message}</p>}
              </div>

              <div>
                <label className="label-field">Dimensions</label>
                <input
                  {...register('dimensions')}
                  className="input-field"
                  placeholder="Ex: H: 80cm | L: 120cm | P: 45cm"
                />
              </div>

              <div>
                <label className="label-field">Poids (kg)</label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  min="0"
                  className="input-field"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="label-field">Tags (séparés par des virgules)</label>
                <input
                  {...register('tags')}
                  className="input-field"
                  placeholder="chêne, rustique, campagne..."
                />
              </div>

              <div>
                <label className="label-field">Ordre d'affichage</label>
                <input
                  {...register('sortOrder', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="input-field"
                  placeholder="0"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="w-4 h-4 text-terracotta-500 border-stone-300 rounded"
                />
                <div>
                  <span className="text-sm font-inter font-medium text-stone-700">Coup de cœur</span>
                  <p className="text-xs text-stone-400">Mis en avant sur la page d'accueil</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  {...register('contactOnly')}
                  type="checkbox"
                  className="w-4 h-4 text-terracotta-500 border-stone-300 rounded"
                />
                <div>
                  <span className="text-sm font-inter font-medium text-stone-700">Contact uniquement</span>
                  <p className="text-xs text-stone-400">Impossible d'acheter en ligne — le client doit contacter la boutique</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-primary w-full gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Sauvegarde...' : product ? 'Enregistrer les modifications' : 'Créer l\'article'}
            </button>

            {product && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="btn-ghost w-full gap-2 text-red-500 hover:bg-red-50 justify-center"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Supprimer cet article
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
