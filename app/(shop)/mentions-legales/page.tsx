import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mentions légales',
}

export default function MentionsLegalesPage() {
  return (
    <div className="bg-offwhite">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="section-title">Mentions légales</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-stone max-w-none font-inter prose-headings:font-playfair prose-h2:text-brown-dark">

          <h2>Éditeur du site</h2>
          <p>
            <strong>La Brocante de Nanie</strong><br />
            Entreprise individuelle<br />
            14 Rue des Huguenots, 83670 Tavernes<br />
            Email : contact@labrocantedenanie.com<br />
            SIRET : XXX XXX XXX XXXXX<br />
            N° TVA intracommunautaire : FRXX XXX XXX XXX
          </p>

          <h2>Directrice de la publication</h2>
          <p>Nadine Gautheron</p>

          <h2>Hébergement</h2>
          <p>
            Ce site est hébergé par :<br />
            <strong>Hostinger International Ltd</strong><br />
            61 Lordou Vironos str., 6023 Larnaca, Chypre<br />
            <a href="https://www.hostinger.fr" className="text-terracotta-500">www.hostinger.fr</a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, images, graphismes, logo) est protégé par le droit d'auteur. Toute reproduction, même partielle, est soumise à autorisation préalable.</p>

          <h2>Liens hypertextes</h2>
          <p>La Brocante de Nanie décline toute responsabilité quant au contenu des sites vers lesquels des liens hypertextes pourraient être établis.</p>

          <h2>Cookies</h2>
          <p>Ce site utilise des cookies techniques nécessaires à son bon fonctionnement et des cookies analytiques pour mesurer l'audience. Voir notre <a href="/confidentialite" className="text-terracotta-500">politique de confidentialité</a>.</p>

          <h2>Litiges</h2>
          <p>Tout litige relatif à l'utilisation du site est soumis au droit français et relève de la compétence des tribunaux de Draguignan.</p>
        </div>
      </div>
    </div>
  )
}
