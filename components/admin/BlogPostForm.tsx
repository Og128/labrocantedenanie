'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, Trash2, Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { slugify } from '@/lib/utils'
import type { BlogPost } from '@prisma/client'

const schema = z.object({
  title: z.string().min(3, 'Titre requis'),
  excerpt: z.string().min(10, 'Résumé requis'),
  content: z.string().min(20, 'Contenu requis'),
  coverImage: z.string().optional(),
  published: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface Props {
  post?: BlogPost
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: post ? {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || '',
      published: post.published,
    } : { published: false },
  })

  const published = watch('published')

  const onSubmit = async (data: FormData) => {
    setSaving(true)
    try {
      const slug = slugify(data.title)
      const payload = {
        ...data,
        slug: post?.slug || slug,
        publishedAt: data.published ? (post?.publishedAt || new Date().toISOString()) : null,
      }

      const url = post ? `/api/blog/${post.id}` : '/api/blog'
      const method = post ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      toast.success(post ? 'Article modifié !' : 'Article créé !')
      router.push('/admin/blog')
      router.refresh()
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!post || !confirm('Supprimer cet article définitivement ?')) return
    setDeleting(true)
    try {
      await fetch(`/api/blog/${post.id}`, { method: 'DELETE' })
      toast.success('Article supprimé')
      router.push('/admin/blog')
    } catch {
      toast.error('Erreur lors de la suppression')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Contenu</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Titre *</label>
                <input {...register('title')} className="input-field" placeholder="Titre de l'article..." />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="label-field">Résumé (affiché en liste) *</label>
                <textarea
                  {...register('excerpt')}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Courte description de l'article..."
                />
                {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>}
              </div>

              <div>
                <label className="label-field">Contenu (HTML) *</label>
                <textarea
                  {...register('content')}
                  rows={16}
                  className="input-field resize-none font-mono text-sm"
                  placeholder="<h2>Mon titre</h2><p>Mon contenu en HTML...</p>"
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
                <p className="text-xs text-stone-400 mt-1 font-inter">Vous pouvez utiliser des balises HTML : h2, h3, p, ul, ol, li, strong, em, a...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="admin-card">
            <h2 className="font-inter font-semibold text-stone-700 mb-4">Paramètres</h2>
            <div className="space-y-4">
              <div>
                <label className="label-field">Image de couverture (URL)</label>
                <input
                  {...register('coverImage')}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('published')}
                    className="w-4 h-4 text-terracotta-500 border-stone-300 rounded"
                  />
                  <div>
                    <span className="text-sm font-inter font-medium text-stone-700">
                      {published ? 'Publié' : 'Brouillon'}
                    </span>
                    <p className="text-xs text-stone-400">
                      {published ? 'Visible sur le site' : 'Non visible publiquement'}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button type="submit" disabled={saving} className="btn-primary w-full gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Sauvegarde...' : post ? 'Enregistrer' : 'Créer l\'article'}
            </button>
            {post && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="btn-ghost w-full gap-2 text-red-500 hover:bg-red-50 justify-center"
              >
                {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
