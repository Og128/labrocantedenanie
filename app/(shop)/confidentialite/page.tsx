import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
}

export default function ConfidentialitePage() {
  return (
    <div className="bg-offwhite">
      <div className="bg-beige py-10 border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="section-title">Politique de confidentialité</h1>
          <p className="text-stone-400 font-inter text-sm mt-2">Conformément au RGPD (Règlement Général sur la Protection des Données)</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-stone max-w-none font-inter prose-headings:font-playfair prose-h2:text-brown-dark prose-h3:text-stone-700 prose-a:text-terracotta-500">

          <h2>1. Responsable du traitement</h2>
          <p>La Brocante du Sud, entreprise individuelle, 12 Rue de la République, 13100 Aix-en-Provence. Contact : <a href="mailto:contact@labrocantedusud.fr">contact@labrocantedusud.fr</a></p>

          <h2>2. Données collectées</h2>
          <p>Nous collectons uniquement les données nécessaires à la relation commerciale :</p>
          <ul>
            <li><strong>Données de commande</strong> : nom, prénom, adresse de livraison, email, téléphone</li>
            <li><strong>Données de paiement</strong> : traitées exclusivement par Stripe (nous n'avons pas accès aux données bancaires)</li>
            <li><strong>Données de navigation</strong> : adresse IP, pages visitées (via cookies analytiques, avec votre consentement)</li>
            <li><strong>Newsletter</strong> : email (avec votre consentement explicite)</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <ul>
            <li>Traitement et suivi des commandes</li>
            <li>Communication relative à vos commandes (emails transactionnels)</li>
            <li>Newsletter commerciale (avec votre consentement)</li>
            <li>Amélioration du site (analytics anonymisés)</li>
            <li>Obligations légales et fiscales</li>
          </ul>

          <h2>4. Base légale</h2>
          <ul>
            <li><strong>Exécution du contrat</strong> : données de commande et de livraison</li>
            <li><strong>Consentement</strong> : newsletter, cookies analytiques</li>
            <li><strong>Obligation légale</strong> : conservation des données comptables (10 ans)</li>
          </ul>

          <h2>5. Durée de conservation</h2>
          <ul>
            <li>Données de commande : 10 ans (obligation comptable)</li>
            <li>Données de compte client : durée de la relation commerciale + 3 ans</li>
            <li>Newsletter : jusqu'à désinscription</li>
          </ul>

          <h2>6. Partage des données</h2>
          <p>Vos données peuvent être transmises à nos sous-traitants dans le strict cadre de leur mission :</p>
          <ul>
            <li><strong>Stripe</strong> : paiement sécurisé (USA/Europe)</li>
            <li><strong>Resend</strong> : envoi d'emails transactionnels</li>
            <li><strong>Supabase</strong> : hébergement de la base de données</li>
            <li><strong>Cloudinary</strong> : hébergement des images</li>
          </ul>
          <p>Ces prestataires sont soumis à des obligations de confidentialité et ne peuvent utiliser vos données à d'autres fins.</p>

          <h2>7. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Accès</strong> : obtenir une copie de vos données</li>
            <li><strong>Rectification</strong> : corriger des données inexactes</li>
            <li><strong>Effacement</strong> : demander la suppression de vos données</li>
            <li><strong>Portabilité</strong> : recevoir vos données dans un format lisible</li>
            <li><strong>Opposition</strong> : vous opposer au traitement</li>
          </ul>
          <p>Pour exercer ces droits : <a href="mailto:contact@labrocantedusud.fr">contact@labrocantedusud.fr</a></p>
          <p>En cas de réclamation, vous pouvez saisir la <a href="https://www.cnil.fr">CNIL</a>.</p>

          <h2>8. Cookies</h2>
          <p>Ce site utilise :</p>
          <ul>
            <li><strong>Cookies essentiels</strong> (session, panier) : nécessaires au fonctionnement, pas de consentement requis</li>
            <li><strong>Cookies analytiques</strong> : mesure d'audience anonymisée, soumis à votre consentement via le bandeau cookies</li>
          </ul>
          <p>Vous pouvez gérer vos préférences à tout moment en cliquant sur le lien "Gérer les cookies" en bas de page.</p>
        </div>
      </div>
    </div>
  )
}
