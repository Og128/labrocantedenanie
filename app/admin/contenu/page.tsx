export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import SiteContentForm from '@/components/admin/SiteContentForm'
import ShippingRulesForm from '@/components/admin/ShippingRulesForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contenu du site | Admin',
  robots: { index: false },
}

export default async function ContenuPage() {
  const [contents, shippingRules] = await Promise.all([
    prisma.siteContent.findMany({ orderBy: { key: 'asc' } }),
    prisma.shippingRule.findMany({ orderBy: { minPrice: 'asc' } }),
  ])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-stone-800 font-inter">Contenu du site</h1>

      <div className="admin-card">
        <h2 className="font-playfair text-xl text-stone-800 mb-5">Textes du site</h2>
        <SiteContentForm contents={contents} />
      </div>

      <div className="admin-card">
        <h2 className="font-playfair text-xl text-stone-800 mb-5">Frais de livraison</h2>
        <ShippingRulesForm rules={shippingRules} />
      </div>
    </div>
  )
}
