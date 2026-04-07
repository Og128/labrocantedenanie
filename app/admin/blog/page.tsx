export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { PlusCircle, Edit, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Admin',
  robots: { index: false },
}

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-stone-800 font-inter">Articles de blog</h1>
        <Link href="/admin/blog/nouveau" className="btn-primary gap-2 text-sm">
          <PlusCircle size={16} />
          Nouvel article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-card text-center py-16">
          <p className="text-stone-400 font-inter mb-4">Aucun article de blog</p>
          <Link href="/admin/blog/nouveau" className="btn-primary text-sm">Écrire le premier article</Link>
        </div>
      ) : (
        <div className="admin-card overflow-hidden p-0">
          <table className="w-full text-sm font-inter">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Titre</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium hidden md:table-cell">Date de publication</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Statut</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-800 line-clamp-1">{post.title}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                    {post.publishedAt
                      ? format(post.publishedAt, "d MMM yyyy", { locale: fr })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.published ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {post.published ? <><Eye size={10} /> Publié</> : <><EyeOff size={10} /> Brouillon</>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-1.5 text-stone-400 hover:text-terracotta-500 transition-colors"
                        title="Modifier"
                      >
                        <Edit size={15} />
                      </Link>
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-400 hover:text-blue-500 transition-colors"
                          title="Voir"
                        >
                          <Eye size={15} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
