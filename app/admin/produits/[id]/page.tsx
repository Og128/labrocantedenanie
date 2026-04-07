export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modifier un article | Admin',
  robots: { index: false },
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-800 font-inter mb-6">
        Modifier l'article
      </h1>
      <ProductForm product={product} />
    </div>
  )
}
