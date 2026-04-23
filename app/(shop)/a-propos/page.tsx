import Image from 'next/image'
import { Leaf, Heart, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'L\'histoire de Nanie, passionnée de brocante depuis plus de 20 ans dans le Var et le Vaucluse.',
}

const laurisImages = [
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946437/150935937_824534828403998_6901791273376149921_n_u629li.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946436/150669153_824082731782541_807328711923599473_n_drbn4u.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946434/475325907_1719928252197980_4002765724795673911_n_jxn2oi.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946433/474867707_1719931515530987_4884462076446412061_n_zikek8.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946432/473202347_1708207193370086_7971037251323273153_n_gzildv.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946430/469765770_1685818375608968_8681378642126420447_n_mdqpnt.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946429/467870718_1673383260185813_1567943150624461360_n_rbh1mx.jpg',
  'https://res.cloudinary.com/dttbty8el/image/upload/v1776946429/467439035_1673383713519101_3798485183832807361_n_bqqlaz.jpg',
]

export default function AProposPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="bg-beige py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title mb-4">Notre histoire</h1>
          <p className="section-subtitle text-lg max-w-2xl mx-auto">
            Depuis plus de vingt ans, Nanie chine et récupère des objets authentiques pour leur offrir une nouvelle vie.
          </p>
        </div>
      </section>

      {/* Nanie's story */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative h-96 rounded-sm overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/dttbty8el/image/upload/v1776946433/475238524_1719931722197633_4349565079218907704_n_x9lpte.jpg"
                  alt="Nanie et ses trésors"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-terracotta-500 text-white p-5 rounded-sm">
                <p className="font-playfair text-2xl font-bold">20+</p>
                <p className="text-sm font-inter text-terracotta-100">ans de passion</p>
              </div>
            </div>

            <div>
              <p className="text-terracotta-500 text-sm font-inter uppercase tracking-widest mb-3">Mon histoire</p>
              <h2 className="font-playfair text-3xl text-brown-dark mb-6">
                Nadine Gautheron,<br />Nanie pour les intimes
              </h2>
              <div className="prose text-stone-600 font-inter leading-relaxed space-y-4">
                <p>
                  Nanie adore chiner depuis plus de 20 ans. Pour elle, chaque objet a une histoire — celle des mains qui l'ont tenu, des foyers qui l'ont accueilli, des moments qu'il a traversés.
                </p>
                <p>
                  Elle sillonne les vide-greniers et brocantes du <strong>Var, du Haut-Var et du Verdon</strong> pour récupérer des pièces authentiques, souvent oubliées, toujours uniques. Des objets vrais, avec du vécu.
                </p>
                <p>
                  Sa philosophie est simple : rien ne se perd, tout se transforme. En adoptant l'un de ces trésors, vous devenez le nouveau gardien de son histoire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boutique de Lauris */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-terracotta-500 text-sm font-inter uppercase tracking-widest mb-3">Une page de notre histoire</p>
            <h2 className="section-title mb-4">La boutique de Lauris</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Pendant cinq ans, Nanie a tenu une boutique brocante au cœur du village de Lauris, dans le Vaucluse.
              Un lieu plein de caractère, niché au milieu du village, où les chineurs venaient chercher la perle rare.
            </p>
          </div>

          {/* France Bleu mention */}
          <div className="bg-white border-l-4 border-terracotta-500 rounded-sm p-6 mb-10 max-w-2xl mx-auto">
            <p className="text-stone-500 font-inter text-xs uppercase tracking-widest mb-1">Ils en ont parlé</p>
            <p className="font-playfair text-lg text-brown-dark mb-2">France Bleu / Radio France</p>
            <p className="text-stone-600 font-inter text-sm leading-relaxed mb-3">
              La boutique de Lauris a eu les honneurs d'un reportage sur France Bleu,
              la radio locale de Radio France — une belle reconnaissance pour cette adresse devenue incontournable dans le village.
            </p>
            <a
              href="https://www.radiofrance.fr/francebleu/podcasts/un-jour-en-vaucluse/lauris-les-petits-bonheurs-de-nanie-3700376"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-terracotta-500 hover:text-terracotta-600 font-inter text-sm font-medium transition-colors"
            >
              Écouter le reportage →
            </a>
          </div>

          {/* Image gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {laurisImages.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-sm overflow-hidden bg-beige">
                <Image
                  src={img}
                  alt={`La boutique de Lauris - photo ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos valeurs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Authenticité',
                description: 'Uniquement des pièces originales, soigneusement sélectionnées. Chaque description est honnête et les photos fidèles à la réalité.',
              },
              {
                icon: Leaf,
                title: 'Éco-responsabilité',
                description: 'Acheter ancien, c\'est le geste éco-responsable par excellence. Pas de production, pas de transport intercontinental, une seconde vie donnée aux objets.',
              },
              {
                icon: Shield,
                title: 'Confiance',
                description: 'Paiement sécurisé, descriptions fidèles, retours acceptés sous 14 jours. Votre satisfaction est notre priorité.',
              },
            ].map((value, i) => {
              const Icon = value.icon
              return (
                <div key={i} className="text-center p-8 bg-white rounded-sm border border-beige">
                  <div className="w-14 h-14 bg-terracotta-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Icon size={24} className="text-terracotta-500" />
                  </div>
                  <h3 className="font-playfair text-xl text-brown-dark mb-3">{value.title}</h3>
                  <p className="text-stone-500 font-inter text-sm leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
