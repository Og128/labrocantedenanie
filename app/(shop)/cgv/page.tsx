import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente',
}

export default function CgvPage() {
  return (
    <div className="bg-offwhite">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="section-title">Conditions Générales de Vente</h1>
          <p className="text-stone-400 font-inter text-sm mt-2">Dernière mise à jour : janvier 2025</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-stone max-w-none font-inter prose-headings:font-playfair prose-h2:text-brown-dark prose-h3:text-stone-700 prose-a:text-terracotta-500">

          <h2>Article 1 – Objet</h2>
          <p>Les présentes Conditions Générales de Vente (CGV) s'appliquent à toutes les ventes conclues sur le site internet <strong>labrocantedenanie.fr</strong>, exploité par La Brocante de Nanie, entreprise individuelle dont le siège social est situé à Tavernes (83670).</p>

          <h2>Article 2 – Produits</h2>
          <p>Les articles proposés à la vente sont des objets de brocante et d'antiquité, à usage unique. Chaque article est décrit avec soin, les photographies étant aussi fidèles que possible à la réalité. Les légères différences de couleur dues à la calibration des écrans ne peuvent engager notre responsabilité.</p>
          <p>Du fait du caractère unique de chaque pièce, un article ne peut être réservé qu'à un seul acheteur. Le stock est mis à jour en temps réel.</p>

          <h2>Article 3 – Prix</h2>
          <p>Les prix sont indiqués en euros TTC (TVA applicable sur la marge). Ils ne comprennent pas les frais de livraison, facturés en sus selon le barème en vigueur disponible sur la page <a href="/livraison">Livraison & Retours</a>.</p>

          <h2>Article 4 – Commande</h2>
          <p>La commande est validée après :</p>
          <ol>
            <li>L'ajout de l'article au panier</li>
            <li>La saisie des informations de livraison</li>
            <li>Le paiement effectif via Stripe</li>
          </ol>
          <p>Un email de confirmation vous est envoyé immédiatement après le paiement.</p>

          <h2>Article 5 – Paiement</h2>
          <p>Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard, American Express), Apple Pay ou Google Pay via notre prestataire sécurisé Stripe. Aucune donnée bancaire n'est stockée sur nos serveurs.</p>

          <h2>Article 6 – Droit de rétractation</h2>
          <p>Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de 14 jours calendaires à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motif. Voir notre <a href="/livraison">politique de retours</a> pour la procédure détaillée.</p>

          <h2>Article 7 – Livraison</h2>
          <p>Les conditions de livraison sont détaillées sur la page <a href="/livraison">Livraison & Retours</a>. En cas de colis endommagé à la réception, vous devez émettre des réserves auprès du transporteur et nous contacter dans les 48h.</p>

          <h2>Article 8 – Responsabilité</h2>
          <p>La Brocante de Nanie ne saurait être tenue responsable des dommages indirects pouvant survenir du fait de l'achat des produits. Notre responsabilité est limitée à la valeur de la commande.</p>

          <h2>Article 9 – Litiges</h2>
          <p>En cas de litige, une solution amiable sera recherchée avant tout recours judiciaire. À défaut, les tribunaux compétents seront ceux du ressort de Draguignan.</p>
          <p>Conformément à l'ordonnance n°2015-1033, vous pouvez recourir au service de médiation de la consommation.</p>

          <h2>Article 10 – Droit applicable</h2>
          <p>Les présentes CGV sont soumises au droit français.</p>
        </div>
      </div>
    </div>
  )
}
