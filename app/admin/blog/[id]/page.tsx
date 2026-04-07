export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BlogPostForm from '@/components/admin/BlogPostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modifier article | Admin',
  robots: { index: false },
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 font-inter mb-6">Modifier l'article</h1>
      <BlogPostForm post={post} />
    </div>
  )
}
