import Image from 'next/image'
import { Leaf, Heart, Shield } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'L\'histoire de La Brocante de Nanie, notre passion pour les objets anciens et notre engagement pour un commerce responsable.',
}

export default function AProposPage() {
  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <section className="bg-beige py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="section-title mb-4">Notre histoire</h1>
          <p className="section-subtitle text-lg max-w-2xl mx-auto">
            Depuis plus de vingt ans, nous écrivons l'histoire des objets d'antan pour qu'ils trouvent de nouveaux foyers où briller.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative h-96 rounded-sm overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
                  alt="Marie-Christine dans sa brocante"
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
                Marie-Christine Dubois,<br />brocanteur de passion
              </h2>
              <div className="prose text-stone-600 font-inter leading-relaxed space-y-4">
                <p>
                  Tout a commencé dans le grenier de ma grand-mère, à Aix-en-Provence, où je passais des heures à explorer des trésors oubliés. Ce goût pour les objets du passé ne m'a jamais quittée.
                </p>
                <p>
                  Après des études de restauration d'œuvres d'art, j'ai décidé de transformer ma passion en vocation. Chaque semaine, je parcours les marchés aux puces, les salles des ventes et les greniers de particuliers pour dénicher des pièces authentiques qui méritent une seconde vie.
                </p>
                <p>
                  Ma philosophie ? Chaque objet porte en lui l'histoire de ceux qui l'ont aimé avant vous. En l'adoptant, vous n'achetez pas simplement un meuble ou un bibelot — vous devenez le gardien d'un fragment de mémoire collective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos valeurs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Authenticité',
                description: 'Nous ne vendons que des pièces originales, soigneusement vérifiées. Chaque description est honnête et détaillée pour vous éviter toute mauvaise surprise.',
              },
              {
                icon: Leaf,
                title: 'Éco-responsabilité',
                description: 'Acheter ancien, c\'est le geste éco-responsable par excellence. Pas de production, pas de transport intercontinental, pas de déchets d\'emballage inutiles.',
              },
              {
                icon: Shield,
                title: 'Confiance',
                description: 'Paiement sécurisé, descriptions fidèles à la réalité, retours acceptés sous 14 jours. Votre satisfaction est notre priorité absolue.',
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
