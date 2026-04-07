import BlogPostForm from '@/components/admin/BlogPostForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nouvel article de blog | Admin',
  robots: { index: false },
}

export default function NouvelArticleBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 font-inter mb-6">Nouvel article de blog</h1>
      <BlogPostForm />
    </div>
  )
}
