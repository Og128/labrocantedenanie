export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'
import HeroSlider from '@/components/shop/HeroSlider'
// import NewsletterSection from '@/components/shop/NewsletterSection'
import { CATEGORY_LABELS } from '@/lib/utils'
import { ArrowRight, Leaf, Star, Shield } from 'lucide-react'

const categories = [
  { key: 'MEUBLES', label: 'Meubles', icon: '🪑', image: 'https://res.cloudinary.com/dttbty8el/image/upload/v1776946432/474393882_1715679812622824_2611294318711233869_n_f6megt.jpg' },
  { key: 'VAISSELLE', label: 'Vaisselle', icon: '🫖', image: 'https://res.cloudinary.com/dttbty8el/image/upload/v1776946435/126885897_770415883815893_2051473504175667570_n_s77pmd.jpg' },
  { key: 'DECORATION', label: 'Décoration', icon: '🪞', image: 'https://res.cloudinary.com/dttbty8el/image/upload/v1776946430/469765770_1685818375608968_8681378642126420447_n_mdqpnt.jpg' },
  { key: 'LUMINAIRES', label: 'Luminaires', icon: '🕯️', image: 'https://res.cloudinary.com/dttbty8el/image/upload/v1776946430/109941852_672769360247213_2841157625384242410_n_wzs7u8.jpg' },
  { key: 'BIJOUX', label: 'Bijoux', icon: '💍', image: 'https://res.cloudinary.com/dttbty8el/image/upload/v1776946436/126945261_770414723816009_6103322513661659153_n_ylyfwi.jpg' },
  { key: 'TABLEAUX', label: 'Tableaux', icon: '🖼️', image: 'https://res.cloudinary.com/dttbty8el/image/upload/v1776946437/205089756_899965087527638_4028771857320490208_n_hwcchl.jpg' },
]

// const testimonials = [
//   {
//     name: 'Marie-Hélène B.',
//     text: 'J\'ai trouvé un buffet provençal absolument magnifique. La description était parfaite et la livraison soignée. Je recommande vivement !',
//     rating: 5,
//     location: 'Lyon',
//   },
//   {
//     name: 'Pierre D.',
//     text: 'Service impeccable, objets exactement conformes aux photos. La vendeuse est passionnée et ça se ressent dans la qualité de sa sélection.',
//     rating: 5,
//     location: 'Paris',
//   },
//   {
//     name: 'Sophie M.',
//     text: 'Un vrai coup de cœur pour une lampe à pétrole trouvée ici. Emballage parfait, et la pièce est encore plus belle en vrai !',
//     rating: 5,
//     location: 'Bordeaux',
//   },
// ]

async function getNewProducts() {
  return prisma.product.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
}

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: 'AVAILABLE', featured: true },
    orderBy: { sortOrder: 'asc' },
    take: 3,
  })
}

export default async function HomePage() {
  const [newProducts, featuredProducts] = await Promise.all([
    getNewProducts(),
    getFeaturedProducts(),
  ])

  return (
    <div>
      {/* Hero */}
      <HeroSlider />

      {/* Values bar */}
      <section className="bg-brown text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield size={22} className="text-terracotta-300" />
            <span className="text-sm font-inter font-medium">Authenticité garantie</span>
            <span className="text-xs text-white/60 font-inter">Chaque pièce soigneusement sélectionnée</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Leaf size={22} className="text-terracotta-300" />
            <span className="text-sm font-inter font-medium">Éco-responsable</span>
            <span className="text-xs text-white/60 font-inter">Donner une seconde vie aux objets</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Star size={22} className="text-terracotta-300" />
            <span className="text-sm font-inter font-medium">Pièces uniques</span>
            <span className="text-xs text-white/60 font-inter">Un seul exemplaire par article</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Nos catégories</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Des meubles aux bijoux, explorez notre sélection d'objets d'époque
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/boutique?category=${cat.key}`}
                className="group flex flex-col items-center"
              >
                <div className="w-full aspect-square rounded-full overflow-hidden border-2 border-beige group-hover:border-terracotta-400 transition-colors mb-3 relative">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="200px"
                  />
                </div>
                <span className="text-sm font-inter text-stone-700 group-hover:text-terracotta-500 transition-colors text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-offwhite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="section-title">Coups de cœur</h2>
                <p className="section-subtitle">Notre sélection de pièces exceptionnelles</p>
              </div>
              <Link href="/boutique?featured=true" className="btn-ghost text-sm hidden sm:flex">
                Voir tout <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nouveautés */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Dernières arrivées</h2>
              <p className="section-subtitle">Les nouvelles pièces qui viennent d'intégrer la boutique</p>
            </div>
            <Link href="/boutique" className="btn-ghost text-sm hidden sm:flex">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/boutique" className="btn-secondary">
              Découvrir toute la boutique
            </Link>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-20 bg-stone-800 text-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-terracotta-300 text-sm font-inter uppercase tracking-widest mb-3">Notre histoire</p>
              <h2 className="font-playfair text-3xl md:text-4xl text-white mb-6">
                Une passion transmise,<br />des objets préservés
              </h2>
              <p className="text-cream/70 font-inter leading-relaxed mb-6">
                Depuis plus de vingt ans, nous parcourons les greniers, marchés aux puces et ventes aux enchères du Sud de la France pour dénicher les pièces les plus authentiques. Chaque objet que nous proposons est minutieusement sélectionné et décrit avec honnêteté.
              </p>
              <p className="text-cream/70 font-inter leading-relaxed mb-8">
                Notre philosophie ? Donner une seconde vie aux objets du passé tout en vous offrant une expérience d'achat transparente et personnalisée.
              </p>
              <Link href="/a-propos" className="btn-primary">
                En savoir plus
              </Link>
            </div>
            <div className="relative h-80 lg:h-auto rounded-sm overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
                alt="Notre brocante"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-brown-dark/30" />
              <div className="absolute bottom-6 left-6 bg-terracotta-500 text-white py-3 px-5">
                <p className="font-playfair text-lg">+20 ans de passion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials — commented out, no real reviews yet */}
      {/* <section className="py-16 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title">Ce que disent nos clients</h2>
          </div>
          ...
        </div>
      </section> */}

      {/* Newsletter — disabled per client request */}
      {/* <NewsletterSection /> */}
    </div>
  )
}
