import Link from 'next/link'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commande confirmée',
  robots: { index: false },
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>

        <h1 className="font-playfair text-3xl text-brown-dark mb-3">
          Commande confirmée !
        </h1>

        <p className="text-stone-500 font-inter leading-relaxed mb-6">
          Merci pour votre achat ! Vous allez recevoir un email de confirmation dans quelques minutes.
          Nous préparerons votre commande avec le plus grand soin.
        </p>

        {session_id && (
          <div className="bg-white border border-beige rounded-sm p-4 mb-6 text-left">
            <div className="flex items-center gap-3">
              <Package size={18} className="text-terracotta-500 shrink-0" />
              <div>
                <p className="text-sm font-inter font-medium text-stone-700">Référence de commande</p>
                <p className="text-xs text-stone-400 font-mono mt-0.5">{session_id.slice(-12).toUpperCase()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-beige rounded-sm p-5 mb-8 text-left">
          <h3 className="font-playfair text-lg text-brown-dark mb-3">Et maintenant ?</h3>
          <ul className="space-y-2 text-sm font-inter text-stone-600">
            <li className="flex items-start gap-2">
              <span className="text-terracotta-500 font-bold shrink-0">1.</span>
              Vous recevrez un email de confirmation avec le détail de votre commande.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta-500 font-bold shrink-0">2.</span>
              Nous préparons soigneusement votre colis (1-2 jours ouvrés).
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta-500 font-bold shrink-0">3.</span>
              Vous recevrez un email avec le numéro de suivi dès l'expédition.
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/boutique" className="btn-secondary flex-1 justify-center">
            Continuer mes achats
          </Link>
          <Link href="/compte" className="btn-primary flex-1 justify-center">
            Mes commandes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
