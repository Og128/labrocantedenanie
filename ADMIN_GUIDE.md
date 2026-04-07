# Guide Utilisateur — Administration La Brocante du Sud

Bienvenue dans votre interface d'administration. Ce guide vous explique comment gérer votre boutique en ligne au quotidien.

---

## 🔑 Connexion

1. Rendez-vous sur `https://votre-domaine.com/admin`
2. Saisissez votre email et votre mot de passe
3. Cliquez sur **Se connecter**

> 💡 En cas d'oubli de mot de passe, contactez votre développeur pour réinitialiser les identifiants dans la base de données.

---

## 📊 Tableau de bord

Le tableau de bord s'affiche en premier après la connexion. Il vous donne un aperçu rapide :

| Indicateur | Description |
|---|---|
| Articles en ligne | Nombre d'articles actuellement disponibles à la vente |
| Articles vendus | Nombre d'articles déjà vendus |
| Commandes ce mois | Nombre de commandes du mois en cours |
| CA du mois | Chiffre d'affaires du mois en cours |

En bas, les **5 dernières commandes** sont affichées avec leur statut.

---

## 📦 Gestion des articles

### Créer un nouvel article

1. Cliquez sur **Nouvel article** (bouton orange en haut à droite) ou dans le menu **Articles**
2. Remplissez les informations :
   - **Titre** : nom complet de l'objet (ex: "Buffet provençal en chêne massif XIXème")
   - **Description** : décrivez en détail l'objet (histoire, matériaux, état, restaurations...)
   - **Photos** : cliquez sur la zone d'upload pour ajouter vos photos. La première photo sera l'image principale. Formats acceptés : JPEG, PNG, WebP (10 Mo max)
   - **Prix** : prix en euros (ex: 245)
   - **Catégorie** : choisissez la catégorie la plus adaptée
   - **État** : soyez honnête sur l'état réel de l'objet
   - **Dimensions** : longueur, largeur, hauteur (ex: "H: 80cm | L: 120cm | P: 45cm")
   - **Poids** : en kilogrammes (utilisé pour le calcul des frais de livraison)
   - **Tags** : mots-clés séparés par des virgules (ex: "chêne, rustique, campagne, XIXème")
   - **Coup de cœur** : cochez pour mettre l'article en avant sur la page d'accueil
3. Cliquez sur **Créer l'article**

### Modifier un article

1. Dans la liste **Articles**, cliquez sur l'icône ✏️ à droite de l'article
2. Modifiez les champs souhaités
3. Cliquez sur **Enregistrer les modifications**

### Marquer un article comme vendu / disponible

Dans la liste des articles, chaque article dispose d'un bouton de statut :
- **Disponible** (vert) → cliquez pour passer en "Vendu"
- **Vendu** (gris) → cliquez pour remettre en "Disponible"

> ⚠️ Quand une commande est payée via Stripe, l'article est automatiquement marqué comme **Vendu**. Vous n'avez rien à faire.

### Supprimer un article

1. Ouvrez l'article à supprimer (icône ✏️)
2. Faites défiler jusqu'en bas
3. Cliquez sur **Supprimer cet article** (bouton rouge)
4. Confirmez la suppression

> ⚠️ Un article ayant fait l'objet d'une commande ne peut pas être supprimé.

---

## 🛒 Gestion des commandes

### Voir les commandes

Cliquez sur **Commandes** dans le menu. Vous pouvez filtrer par statut :
- **En attente** : paiement reçu, commande à préparer
- **Confirmée** : commande validée
- **En préparation** : vous préparez le colis
- **Expédiée** : colis remis au transporteur
- **Livrée** : client a reçu son colis

### Mettre à jour le statut d'une commande

1. Cliquez sur **Détail →** pour ouvrir la commande
2. Dans le panneau **Gérer la commande** (à droite) :
   - Sélectionnez le nouveau **Statut**
   - Si vous passez en "Expédiée", renseignez le **Numéro de suivi**
3. Cliquez sur **Enregistrer**

> 📧 Quand vous passez une commande en **"Expédiée"** avec un numéro de suivi, un email est **automatiquement envoyé** au client avec ce numéro.

### Informations disponibles sur une commande

- Articles commandés avec photos et prix
- Coordonnées complètes du client (nom, email, téléphone)
- Adresse de livraison
- Montant total, frais de livraison
- Référence du paiement Stripe

---

## 📝 Blog

### Créer un article de blog

1. Cliquez sur **Blog** → **Nouvel article**
2. Remplissez :
   - **Titre** : titre de l'article
   - **Résumé** : courte description (affichée dans la liste)
   - **Contenu** : corps de l'article en HTML basique
   - **Image de couverture** : URL d'une image (optionnel)
   - **Publié** : cochez pour rendre l'article visible sur le site
3. Cliquez sur **Créer l'article**

> 💡 Pour le contenu HTML, utilisez des balises simples : `<h2>Titre</h2>`, `<p>Paragraphe</p>`, `<ul><li>Item</li></ul>`, `<strong>Gras</strong>`

---

## ⚙️ Contenu du site

Cette section vous permet de modifier les textes importants du site sans faire appel à un développeur.

### Textes modifiables

| Champ | Où apparaît |
|---|---|
| Titre Hero | Grand titre sur la page d'accueil (slider) |
| Sous-titre Hero | Texte sous le titre du slider |
| Texte "À propos" | Page À propos |
| Nom du brocanteur | Affiché sur la page À propos |
| Adresse de contact | Footer et page Contact |
| Téléphone | Footer et page Contact |
| Email de contact | Footer et page Contact |
| Horaires d'ouverture | Footer et page Contact |

Modifiez les champs souhaités et cliquez sur **Enregistrer les modifications**.

### Frais de livraison

Le tableau de livraison vous permet d'ajuster les tarifs par tranche de prix :

| Tranche | Frais |
|---|---|
| Petits objets (< 30 €) | 5,90 € |
| Objets moyens (30–80 €) | 8,90 € |
| Objets importants (80–150 €) | 12,90 € |
| Grands objets (150–300 €) | 18,90 € |
| Meubles et objets lourds (> 300 €) | 29,90 € |

Modifiez les montants et cliquez sur **Enregistrer les tarifs**.

> 💡 La livraison est offerte automatiquement dès 150 € d'achat (calculé dans le code de paiement).

---

## 📸 Conseils pour les photos

- **Minimum 2-3 photos** par article : vue d'ensemble, détails, marques/signatures
- **Lumière naturelle** : photographiez près d'une fenêtre
- **Fond neutre** : sol en bois, tissu uni beige ou blanc
- **Résolution** : au minimum 800×800 pixels, idéalement 1200×1200
- Montrez honnêtement les éventuels défauts ou usures

---

## 🔒 Sécurité

- **Ne partagez jamais** vos identifiants de connexion
- **Déconnectez-vous** après chaque session (bouton "Déconnexion" en haut à droite)
- En cas de connexion suspecte, changez votre mot de passe immédiatement

---

## ❓ En cas de problème

| Problème | Solution |
|---|---|
| Je ne peux plus me connecter | Vérifiez l'email et le mot de passe. Contactez le développeur |
| Une commande n'apparaît pas | Vérifiez dans votre Dashboard Stripe que le paiement est bien "Succeeded" |
| L'email de suivi n'a pas été envoyé | Vérifiez que vous avez bien saisi le numéro de suivi avant de sauvegarder |
| Une photo n'upload pas | Vérifiez que le fichier est bien JPEG/PNG/WebP et fait moins de 10 Mo |
| Le site affiche une erreur 500 | Contactez le développeur avec les détails de l'erreur |

---

*Guide rédigé pour La Brocante du Sud — Version 1.0*
