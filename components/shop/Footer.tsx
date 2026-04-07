import Link from 'next/link'
import { Mail, Phone, MapPin, Share2, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-cream mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-playfair text-xl text-white mb-3">La Brocante de Nanie</h3>
            <p className="text-cream/70 text-sm font-inter leading-relaxed mb-5">
              Des trésors du passé pour embellir votre aujourd'hui.
              Sélection artisanale d'objets anciens depuis le Sud de la France.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-white/10 hover:bg-terracotta-500 rounded-full transition-colors" aria-label="Instagram">
                <Share2 size={16} />
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-terracotta-500 rounded-full transition-colors" aria-label="Réseau social">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-inter font-semibold text-white text-sm uppercase tracking-wider mb-4">Boutique</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/boutique', label: 'Tous les articles' },
                { href: '/boutique?category=MEUBLES', label: 'Meubles' },
                { href: '/boutique?category=VAISSELLE', label: 'Vaisselle' },
                { href: '/boutique?category=DECORATION', label: 'Décoration' },
                { href: '/boutique?category=LUMINAIRES', label: 'Luminaires' },
                { href: '/boutique?category=BIJOUX', label: 'Bijoux' },
                { href: '/boutique?category=LIVRES', label: 'Livres' },
                { href: '/boutique?category=MERCERIE', label: 'Mercerie' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/70 hover:text-cream text-sm font-inter transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="font-inter font-semibold text-white text-sm uppercase tracking-wider mb-4">Informations</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/a-propos', label: 'Notre histoire' },
                { href: '/livraison', label: 'Livraison & Retours' },
                { href: '/cgv', label: 'Conditions générales' },
                { href: '/mentions-legales', label: 'Mentions légales' },
                { href: '/confidentialite', label: 'Confidentialité' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/70 hover:text-cream text-sm font-inter transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm font-inter text-cream/70">
                <MapPin size={16} className="mt-0.5 shrink-0 text-terracotta-400" />
                <span>12 Rue de la République<br />13100 Aix-en-Provence</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-inter text-cream/70">
                <Phone size={16} className="shrink-0 text-terracotta-400" />
                <a href="tel:+33442000000" className="hover:text-cream transition-colors">+33 (0)4 42 XX XX XX</a>
              </li>
              <li className="flex items-center gap-3 text-sm font-inter text-cream/70">
                <Mail size={16} className="shrink-0 text-terracotta-400" />
                <a href="mailto:contact@labrocantedusud.fr" className="hover:text-cream transition-colors">contact@labrocantedusud.fr</a>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-cream/50 font-inter">
                Mar–Sam : 10h–18h30<br />Dim : 10h–17h
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-cream/40 text-xs font-inter">
            © {new Date().getFullYear()} La Brocante de Nanie. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <img src="/images/stripe-badge.svg" alt="Paiement sécurisé Stripe" className="h-6 opacity-50" />
          </div>
        </div>
      </div>
    </footer>
  )
}
