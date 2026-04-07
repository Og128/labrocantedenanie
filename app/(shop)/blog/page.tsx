export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Conseils, histoires et actualités de La Brocante du Sud.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="bg-offwhite">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title">Le Blog</h1>
          <p className="section-subtitle">Conseils, histoires d'objets et coulisses de la brocante</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <p className="text-center text-stone-400 font-inter py-16">Aucun article pour l'instant.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white rounded-sm border border-beige overflow-hidden hover:shadow-md transition-shadow">
                <div className="md:flex">
                  {post.coverImage && (
                    <div className="md:w-64 relative h-48 md:h-auto shrink-0">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="256px"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col justify-center">
                    {post.publishedAt && (
                      <p className="text-xs text-stone-400 font-inter uppercase tracking-wide mb-2">
                        {format(post.publishedAt, "d MMMM yyyy", { locale: fr })}
                      </p>
                    )}
                    <h2 className="font-playfair text-xl text-brown-dark mb-3 group-hover:text-terracotta-500 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-stone-500 font-inter text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="text-terracotta-500 font-inter text-sm font-medium hover:underline self-start">
                      Lire la suite →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
