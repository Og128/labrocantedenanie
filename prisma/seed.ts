import { PrismaClient, Category, Condition, Status } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyage
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.shippingRule.deleteMany()
  await prisma.siteContent.deleteMany()
  await prisma.user.deleteMany()

  // Compte admin
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'Admin123!',
    12
  )
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@labrocantedusud.fr',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Compte admin créé')

  // Règles de livraison
  await prisma.shippingRule.createMany({
    data: [
      { name: 'Petits objets (< 30€)', minPrice: 0, maxPrice: 30, cost: 5.9, active: true },
      { name: 'Objets moyens (30-80€)', minPrice: 30, maxPrice: 80, cost: 8.9, active: true },
      { name: 'Objets importants (80-150€)', minPrice: 80, maxPrice: 150, cost: 12.9, active: true },
      { name: 'Grands objets (150-300€)', minPrice: 150, maxPrice: 300, cost: 18.9, active: true },
      { name: 'Meubles et objets lourds (> 300€)', minPrice: 300, maxPrice: 9999, cost: 29.9, active: true },
    ],
  })
  console.log('✅ Règles de livraison créées')

  // Contenu du site
  await prisma.siteContent.createMany({
    data: [
      {
        key: 'hero_title',
        value: 'Des trésors du passé pour embellir votre aujourd\'hui',
        type: 'text',
      },
      {
        key: 'hero_subtitle',
        value: 'Chaque objet a une histoire. Laissez-nous vous aider à écrire la vôtre.',
        type: 'text',
      },
      {
        key: 'about_text',
        value: `Passionnée par les objets d'antan depuis toujours, j'ai ouvert La Brocante du Sud pour partager ma passion avec le plus grand nombre. Nichée au cœur du Sud de la France, notre brocante propose une sélection minutieuse d'objets authentiques, de meubles anciens et de curiosités dénichées dans les brocantes, ventes aux enchères et greniers de particuliers.

Chaque pièce est soigneusement choisie pour sa qualité, son histoire et son âme. Nous croyons que donner une seconde vie aux objets est non seulement beau, mais aussi essentiel pour un mode de consommation plus responsable.

Bienvenue dans notre univers chaleureux, où le passé rencontre le présent.`,
        type: 'richtext',
      },
      {
        key: 'about_owner_name',
        value: 'Marie-Christine Dubois',
        type: 'text',
      },
      {
        key: 'contact_address',
        value: '12 Rue de la République, 13100 Aix-en-Provence',
        type: 'text',
      },
      {
        key: 'contact_phone',
        value: '+33 (0)4 42 XX XX XX',
        type: 'text',
      },
      {
        key: 'contact_email',
        value: 'contact@labrocantedusud.fr',
        type: 'text',
      },
      {
        key: 'contact_hours',
        value: 'Mardi-Samedi : 10h-18h30 | Dimanche : 10h-17h',
        type: 'text',
      },
    ],
  })
  console.log('✅ Contenu du site créé')

  // Produits de démonstration
  const products = [
    {
      title: 'Buffet provençal en chêne massif',
      slug: 'buffet-provencal-chene-massif',
      description: `<p>Magnifique buffet deux corps en chêne massif d'époque début XXème siècle. Finement sculpté avec des motifs floraux typiquement provençaux, cet imposant meuble est en excellent état de conservation.</p>
<p>Restauré avec soin par nos soins : bois ciré, ferronneries d'origine conservées et remises en état. Les deux portes du bas s'ouvrent sur de grands espaces de rangement, tandis que les deux portes vitrées du haut protègent vos plus belles pièces de vaisselle.</p>
<p>Une pièce maîtresse pour une salle à manger ou une cuisine de caractère.</p>`,
      price: 485,
      category: Category.MEUBLES,
      condition: Condition.EXCELLENT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      ],
      featured: true,
      weight: 45,
      dimensions: 'H: 185cm | L: 130cm | P: 55cm',
      tags: ['chêne', 'provençal', 'buffet', 'rustique', 'XXème'],
      sortOrder: 1,
    },
    {
      title: 'Service à thé Art Déco en porcelaine de Limoges',
      slug: 'service-the-art-deco-limoges',
      description: `<p>Exquis service à thé complet en porcelaine de Limoges, dans le pur style Art Déco des années 1930. Décor géométrique aux tons or et cobalt, signé par la manufacture.</p>
<p>Le service comprend : 1 théière, 1 sucrier avec couvercle, 1 pot à lait, 6 tasses et soucoupes. L'ensemble est en parfait état, aucun ébréchage ni fêlure. Le décor doré est intact.</p>
<p>Idéal comme pièce de collection ou pour des thés élégants entre amateurs d'art.</p>`,
      price: 195,
      category: Category.VAISSELLE,
      condition: Condition.EXCELLENT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      ],
      featured: true,
      weight: 2.5,
      dimensions: 'Théière : H: 14cm | L: 24cm',
      tags: ['Limoges', 'porcelaine', 'Art Déco', 'service à thé', 'collection'],
      sortOrder: 2,
    },
    {
      title: 'Miroir doré style Louis XVI',
      slug: 'miroir-dore-style-louis-xvi',
      description: `<p>Superbe miroir à parcloses en bois sculpté et doré à la feuille d'or, de style Louis XVI. Cadre richement orné de feuilles d'acanthe, de rubans et de petites fleurs.</p>
<p>La dorure d'époque présente quelques légères usures du temps qui lui confèrent tout son charme authentique. La glace est d'origine, avec son léger effet miroir ancien caractéristique.</p>
<p>Parfait au-dessus d'une cheminée ou comme accent décoratif dans un couloir.</p>`,
      price: 320,
      category: Category.DECORATION,
      condition: Condition.BON_ETAT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800',
      ],
      featured: false,
      weight: 8,
      dimensions: 'H: 95cm | L: 65cm',
      tags: ['miroir', 'doré', 'Louis XVI', 'bois sculpté', 'salon'],
      sortOrder: 3,
    },
    {
      title: 'Lampe à pétrole en laiton ciselé',
      slug: 'lampe-petrole-laiton-cisele',
      description: `<p>Splendide lampe à pétrole en laiton ciselé avec globe en verre soufflé opaline blanche, datant de la Belle Époque (vers 1890-1910). Un objet décoratif rare et particulièrement bien conservé.</p>
<p>Le pied en laiton est richement orné de motifs floraux ciselés à la main. Le globe original en verre opaline est intact, sans aucune fêlure. Électrifiable sur demande.</p>`,
      price: 165,
      category: Category.LUMINAIRES,
      condition: Condition.BON_ETAT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
      ],
      featured: true,
      weight: 3.2,
      dimensions: 'H totale: 58cm | Diamètre globe: 20cm',
      tags: ['lampe', 'laiton', 'Belle Époque', 'opaline', 'luminaire'],
      sortOrder: 4,
    },
    {
      title: 'Broche Art Nouveau fleur en argent et émail',
      slug: 'broche-art-nouveau-argent-email',
      description: `<p>Délicate broche en argent 925 représentant une fleur stylisée avec cœur en émail vert et bleu, dans le style caractéristique de l'Art Nouveau (circa 1900-1910).</p>
<p>Poinçon d'argent visible au revers. Mécanisme de fermeture en parfait état. Une pièce d'exception pour les amatrices de bijoux anciens.</p>`,
      price: 85,
      category: Category.BIJOUX,
      condition: Condition.EXCELLENT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800',
      ],
      featured: false,
      weight: 0.1,
      dimensions: 'Diamètre: 3.5cm',
      tags: ['bijou', 'argent', 'Art Nouveau', 'broche', 'émail'],
      sortOrder: 5,
    },
    {
      title: 'Courtepointe ancienne patchwork multicolore',
      slug: 'courtepointe-ancienne-patchwork',
      description: `<p>Magnifique courtepointe ancienne en patchwork de coton réalisée à la main, datant des années 1920-1930. Composition harmonieuse de tissus imprimés aux motifs fleuris et géométriques.</p>
<p>Légèrement pâlie par le temps, ce qui lui confère un caractère authentique. Quelques petites reprises discrètes témoignent de son histoire. Lavée et désinfectée avant mise en vente.</p>`,
      price: 145,
      category: Category.TEXTILES,
      condition: Condition.BON_ETAT_GENERAL,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800',
      ],
      featured: false,
      weight: 1.8,
      dimensions: '220cm x 180cm',
      tags: ['patchwork', 'coton', 'fait main', 'lit', 'vintage'],
      sortOrder: 6,
    },
    {
      title: 'Balance de boulanger en fonte et laiton',
      slug: 'balance-boulanger-fonte-laiton',
      description: `<p>Authentique balance de boulanger à plateaux en laiton repoussé sur socle en fonte émaillée noire, fin XIXème siècle. Marquage "Fabrication Française" visible sur le socle.</p>
<p>Fournie avec son jeu complet de 12 poids en fonte de 1g à 1kg. Mécanisme parfaitement fonctionnel. Un superbe objet décoratif pour une cuisine rustique ou un bureau.</p>`,
      price: 210,
      category: Category.OBJETS_METIER,
      condition: Condition.BON_ETAT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800',
      ],
      featured: false,
      weight: 6.5,
      dimensions: 'H: 38cm | L: 55cm | P: 18cm',
      tags: ['balance', 'boulangerie', 'fonte', 'laiton', 'cuisine'],
      sortOrder: 7,
    },
    {
      title: 'Huile sur toile "Paysage provençal" signée',
      slug: 'huile-toile-paysage-provencal',
      description: `<p>Belle huile sur toile représentant un paysage provençal typique : oliviers centenaires sous le soleil de midi, cabanon en pierre sèche au second plan. Signée "M. Bernard" en bas à droite.</p>
<p>La toile est en bon état, sans déchirure. Le châssis est stable. Le cadre en bois doré d'époque présente quelques petites usures de patine, parfaitement cohérentes avec l'âge de l'œuvre (circa 1950).</p>`,
      price: 380,
      category: Category.TABLEAUX,
      condition: Condition.BON_ETAT,
      status: Status.AVAILABLE,
      images: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      ],
      featured: true,
      weight: 4,
      dimensions: 'H: 55cm | L: 73cm (avec cadre: 70cm x 88cm)',
      tags: ['peinture', 'huile sur toile', 'Provence', 'paysage', 'signée'],
      sortOrder: 8,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }
  console.log(`✅ ${products.length} produits créés`)

  // Articles de blog
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Comment reconnaître un meuble ancien authentique ?',
        slug: 'reconnaitre-meuble-ancien-authentique',
        excerpt: 'Quelques conseils pratiques pour ne pas vous faire avoir lors de vos achats en brocante ou vente aux enchères.',
        content: `<h2>Les signes qui ne trompent pas</h2>
<p>Reconnaître un vrai meuble ancien n'est pas toujours évident. Voici nos conseils d'experte pour distinguer les pièces authentiques des reproductions...</p>
<h3>Examinez le bois</h3>
<p>Un meuble ancien porte les marques du temps : irrégularités du bois, légères craquelures du vernis, traces d'usure naturelle aux endroits de contact (poignées, pieds, arêtes)...</p>`,
        published: true,
        publishedAt: new Date('2024-03-15'),
        coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      },
      {
        title: 'La porcelaine de Limoges : histoire et identification',
        slug: 'porcelaine-limoges-histoire-identification',
        excerpt: 'Plongez dans l\'histoire fascinante de la porcelaine de Limoges et apprenez à identifier les pièces authentiques.',
        content: `<h2>Deux siècles d'excellence</h2>
<p>La manufacture de Limoges est l'une des plus prestigieuses au monde. Depuis 1771, ses artisans perpétuent un savoir-faire unique...</p>`,
        published: true,
        publishedAt: new Date('2024-04-02'),
        coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      },
    ],
  })
  console.log('✅ Articles de blog créés')

  console.log('\n🎉 Seeding terminé avec succès !')
  console.log('\n📋 Récapitulatif :')
  console.log('   - 1 compte admin')
  console.log('   - 5 règles de livraison')
  console.log('   - 8 produits de démonstration')
  console.log('   - 2 articles de blog')
  console.log('   - Contenu du site configuré')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
