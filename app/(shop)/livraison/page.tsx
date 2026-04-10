export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Package, RefreshCw, Clock, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Livraison & Retours',
  description: 'Informations sur nos modalités de livraison et notre politique de retours.',
}

export default async function LivraisonPage() {
  const rules = await prisma.shippingRule.findMany({
    where: { active: true },
    orderBy: { minPrice: 'asc' },
  })

  return (
    <div className="bg-offwhite">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="section-title">Livraison & Retours</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Shipping */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Package size={22} className="text-terracotta-500" />
            <h2 className="font-playfair text-2xl text-brown-dark">Tarifs de livraison</h2>
          </div>

          <div className="bg-white border border-beige rounded-sm overflow-hidden">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="bg-beige">
                  <th className="text-left px-5 py-3 text-brown font-semibold">Tranche de prix</th>
                  <th className="text-right px-5 py-3 text-brown font-semibold">Frais de livraison</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, i) => (
                  <tr key={rule.id} className={`border-t border-beige ${i % 2 === 0 ? '' : 'bg-cream'}`}>
                    <td className="px-5 py-3 text-stone-700">{rule.name}</td>
                    <td className="px-5 py-3 text-right font-medium text-stone-800">{formatPrice(rule.cost)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-terracotta-200 bg-terracotta-50">
                  <td className="px-5 py-3 text-terracotta-700 font-medium">Dès 150 € d'achat</td>
                  <td className="px-5 py-3 text-right font-bold text-terracotta-600">Livraison offerte !</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-stone-500 font-inter text-sm mt-4">
            Les frais de livraison sont calculés sur le montant total de la commande hors frais de port.
          </p>
        </section>

        {/* Delays */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Clock size={22} className="text-terracotta-500" />
            <h2 className="font-playfair text-2xl text-brown-dark">Délais de livraison</h2>
          </div>
          <div className="prose prose-stone font-inter text-stone-600 space-y-3">
            <p>Après confirmation du paiement, nous préparons votre commande sous <strong>1 à 2 jours ouvrés</strong>. Chaque article est soigneusement emballé pour éviter tout dommage pendant le transport.</p>
            <p>La livraison en France métropolitaine prend généralement <strong>2 à 5 jours ouvrés</strong> après expédition, selon le transporteur et la destination.</p>
            <p>Vous recevrez un email avec votre numéro de suivi dès que votre colis sera remis au transporteur.</p>
          </div>
        </section>

        {/* International */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Globe size={22} className="text-terracotta-500" />
            <h2 className="font-playfair text-2xl text-brown-dark">Livraison internationale</h2>
          </div>
          <div className="prose prose-stone font-inter text-stone-600">
            <p>Nous livrons en Belgique, Suisse et Luxembourg aux mêmes tarifs qu'en France. Pour les autres pays européens ou hors Europe, <a href="/contact" className="text-terracotta-500 hover:underline">contactez-nous</a> pour obtenir un devis personnalisé.</p>
            <p>Les frais de douane éventuels sont à la charge du destinataire.</p>
          </div>
        </section>

        {/* Returns */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <RefreshCw size={22} className="text-terracotta-500" />
            <h2 className="font-playfair text-2xl text-brown-dark">Politique de retours</h2>
          </div>
          <div className="prose prose-stone font-inter text-stone-600 space-y-3">
            <p>Conformément au droit de rétractation, vous disposez de <strong>14 jours</strong> à compter de la réception de votre commande pour nous retourner un article.</p>
            <p>Pour initier un retour :</p>
            <ol>
              <li>Contactez-nous par email à <a href="mailto:contact@labrocantedenanie.fr" className="text-terracotta-500">contact@labrocantedenanie.fr</a> en précisant votre numéro de commande.</li>
              <li>Nous vous confirmerons la procédure de retour sous 48h.</li>
              <li>Retournez l'article dans son emballage d'origine ou dans un emballage équivalent.</li>
              <li>Le remboursement sera effectué sous 14 jours après réception du colis.</li>
            </ol>
            <p className="bg-amber-50 border border-amber-200 p-4 rounded-sm text-amber-700 not-prose text-sm">
              ⚠️ Les articles doivent être retournés dans leur état d'origine. Tout article endommagé ou incomplet ne pourra pas être remboursé. Les frais de retour sont à la charge du client.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
