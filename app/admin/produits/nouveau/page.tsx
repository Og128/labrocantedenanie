import ProductForm from '@/components/admin/ProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nouvel article | Admin',
  robots: { index: false },
}

export default function NouvelArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 font-inter mb-6">Nouvel article</h1>
      <ProductForm />
    </div>
  )
}
