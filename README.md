# La Brocante de Nanie — Site E-commerce

Site e-commerce complet pour une brocante provençale, avec back-office CMS intégré.
Production : [labrocantedenanie.com](https://labrocantedenanie.com)

## Stack technique

- **Framework** : Next.js 14 (App Router, TypeScript)
- **Styling** : TailwindCSS 3
- **BDD** : PostgreSQL via Prisma ORM (hébergée sur Supabase)
- **Auth admin** : NextAuth.js v4 (credentials)
- **Paiement** : Stripe (cartes, Apple Pay, Google Pay)
- **Images** : Cloudinary
- **Emails** : Resend
- **Déploiement** : Hostinger Web Apps Node.js

---

## 🚀 Installation locale

### 1. Prérequis

- Node.js 18+
- PostgreSQL (ou compte Supabase)
- Comptes : Stripe, Cloudinary, Resend

### 2. Cloner et installer

```bash
git clone <repo-url>
cd la-brocante-du-sud
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env
# Éditez .env avec vos propres valeurs
```

Voir `.env.example` pour la documentation de chaque variable.

### 4. Base de données

```bash
# Créer les tables
npm run db:push

# Charger les données de démonstration (optionnel)
npm run db:seed
```

### 5. Lancer en développement

```bash
npm run dev
# → http://localhost:3000
# Admin : http://localhost:3000/admin
```

---

## 📦 Déploiement sur Hostinger Web Apps

### Étape 1 — Préparer le dépôt GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/votre-user/la-brocante-du-sud.git
git push -u origin main
```

### Étape 2 — Créer l'application sur Hostinger

1. Connectez-vous à votre panneau Hostinger
2. Allez dans **Web Apps** → **Créer une application**
3. Choisissez **Node.js**
4. Connectez votre dépôt GitHub
5. Configurez :
   - **Branch** : `main`
   - **Build command** : `npm run build`
   - **Start command** : `npm start`
   - **Node version** : 18.x ou 20.x

### Étape 3 — Variables d'environnement

Dans Hostinger → Web App → **Environment Variables**, ajoutez toutes les variables de `.env.example` avec vos valeurs de production.

> ⚠️ **Important** : Ne définissez jamais `PORT` vous-même, Hostinger l'injecte automatiquement.

### Étape 4 — Base de données (Supabase)

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez l'URL de connexion PostgreSQL dans **Settings → Database**
3. Ajoutez-la dans `DATABASE_URL` des variables d'environnement Hostinger
4. Après le premier déploiement, exécutez via SSH ou localement avec la DB de prod :
   ```bash
   DATABASE_URL="votre-url-supabase" npm run db:push
   DATABASE_URL="votre-url-supabase" npm run db:seed
   ```

### Étape 5 — Stripe webhooks

1. Dans votre [Dashboard Stripe](https://dashboard.stripe.com/webhooks) → **Ajouter un endpoint**
2. URL : `https://votre-domaine.com/api/webhooks/stripe`
3. Événements à écouter : `checkout.session.completed`
4. Copiez le **Signing secret** → variable `STRIPE_WEBHOOK_SECRET`

### Étape 6 — Cloudinary

1. Créez un compte sur [cloudinary.com](https://cloudinary.com)
2. Dans **Settings → Upload → Upload presets**, créez un preset `brocante-uploads` (mode : Unsigned)
3. Renseignez les variables `CLOUDINARY_*` dans Hostinger

### Étape 7 — Resend (emails)

1. Créez un compte sur [resend.com](https://resend.com)
2. Vérifiez votre domaine (DNS)
3. Créez une clé API → variable `RESEND_API_KEY`
4. Renseignez `EMAIL_FROM` avec votre adresse vérifiée

---

## 📁 Structure du projet

```
la-brocante-du-sud/
├── app/
│   ├── (shop)/          # Pages publiques (accueil, boutique, produit...)
│   ├── admin/           # Back-office protégé
│   └── api/             # Routes API (Stripe, produits, commandes...)
├── components/
│   ├── ui/              # Composants réutilisables (Button, Providers...)
│   ├── shop/            # Composants boutique (Navbar, ProductCard...)
│   └── admin/           # Composants back-office (ProductForm, OrderStatusUpdate...)
├── lib/
│   ├── prisma.ts        # Client Prisma singleton
│   ├── cloudinary.ts    # Upload images
│   ├── stripe.ts        # Client Stripe
│   ├── resend.ts        # Emails transactionnels
│   ├── auth.ts          # Configuration NextAuth
│   ├── cart.ts          # Store Zustand panier
│   ├── shipping.ts      # Calcul frais de livraison
│   └── utils.ts         # Fonctions utilitaires
├── prisma/
│   ├── schema.prisma    # Schéma de la base de données
│   └── seed.ts          # Données de démonstration
├── .env.example         # Template variables d'environnement
└── middleware.ts        # Protection des routes admin
```

---

## 🛒 Fonctionnalités

### Boutique publique
- Page d'accueil avec hero slider, catégories, nouveautés, coups de cœur (images Cloudinary)
- Boutique avec filtres (catégorie, prix, coups de cœur) et pagination
- Fiches produit avec galerie photos, description, dimensions, produits similaires
- Panier persistant (localStorage via Zustand)
- Frais de livraison dynamiques (calculés depuis la BDD via `/api/shipping`)
- Checkout avec formulaire d'adresse → redirection Stripe
- Page confirmation de commande
- Mon compte : historique des commandes avec statuts et numéro de suivi
- Suivi de commande par référence
- Pages légales : CGV, Livraison & Retours, Mentions légales, Confidentialité
- Sitemap XML automatique + robots.txt

### Back-office admin (`/admin`)
- Tableau de bord avec statistiques (CA mensuel, articles, commandes)
- Gestion articles : création, modification, suppression, toggle statut
- Upload photos via Cloudinary (drag & drop, validation type/taille)
- Gestion commandes : filtres par statut, mise à jour statut, numéro de suivi
- Email automatique à l'expédition (client) + notification admin à chaque vente
- Gestion du contenu du site (textes éditables)
- Configuration des frais de livraison

---

## 🔐 Sécurité

- Routes admin protégées par middleware NextAuth
- Webhook Stripe vérifié par signature HMAC
- Upload images : validation type + taille côté serveur
- Variables sensibles jamais exposées côté client
- Headers de sécurité (X-Frame-Options, X-Content-Type-Options...)

---

## 🧑‍💻 Commandes utiles

```bash
npm run dev          # Démarrer en développement
npm run build        # Build de production
npm start            # Démarrer en production (utilisé par Hostinger)
npm run db:push      # Appliquer le schéma Prisma à la BDD
npm run db:seed      # Charger les données de démo
npm run db:studio    # Ouvrir Prisma Studio (interface visuelle BDD)
npm run lint         # Vérifier le code
```

---

## 📧 Support

Pour toute question : contact@labrocantedenanie.com
