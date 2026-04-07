export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug } })
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) notFound()

  return (
    <article className="bg-offwhite">
      {post.coverImage && (
        <div className="relative h-64 md:h-96 bg-beige">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 max-w-3xl mx-auto px-4">
            <h1 className="font-playfair text-3xl md:text-4xl text-white">{post.title}</h1>
            {post.publishedAt && (
              <p className="text-white/70 text-sm font-inter mt-2">
                {format(post.publishedAt, "d MMMM yyyy", { locale: fr })}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {!post.coverImage && (
          <div className="mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl text-brown-dark">{post.title}</h1>
            {post.publishedAt && (
              <p className="text-stone-400 text-sm font-inter mt-2">
                {format(post.publishedAt, "d MMMM yyyy", { locale: fr })}
              </p>
            )}
          </div>
        )}

        <div
          className="prose prose-stone max-w-none font-inter prose-headings:font-playfair prose-a:text-terracotta-500"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-6 border-t border-beige">
          <Link href="/blog" className="btn-secondary text-sm">
            ← Retour au blog
          </Link>
        </div>
      </div>
    </article>
  )
}
