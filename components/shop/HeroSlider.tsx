'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dttbty8el/image/upload/w_1600,q_auto,f_auto/v1776946432/473236053_1708207600036712_1926819426674144604_n_jauphw.jpg',
    title: 'Des trésors du passé',
    subtitle: 'pour embellir votre aujourd\'hui',
    cta: { label: 'Découvrir la boutique', href: '/boutique' },
    overlay: 'bg-brown-dark/40',
  },
  {
    id: 2,
    image: 'https://res.cloudinary.com/dttbty8el/image/upload/w_1600,q_auto,f_auto/v1776946432/474588537_1715679752622830_8512865997999164868_n_miezpq.jpg',
    title: 'Vaisselle & Arts de la table',
    subtitle: 'Une sélection raffinée de porcelaines et faïences anciennes',
    cta: { label: 'Explorer', href: '/boutique?category=VAISSELLE' },
    overlay: 'bg-stone-900/50',
  },
  {
    id: 3,
    image: 'https://res.cloudinary.com/dttbty8el/image/upload/w_1600,q_auto,f_auto/v1776946429/41500313_253633905494096_5900202677110833152_n_c691vi.jpg',
    title: 'Tableaux & Œuvres d\'art',
    subtitle: 'Peintures, lithographies et cadres anciens pour décorer vos murs',
    cta: { label: 'Voir les œuvres', href: '/boutique?category=TABLEAUX' },
    overlay: 'bg-brown-dark/50',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [isTransitioning]
  )

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="relative h-[calc(100svh-104px)] min-h-[500px] max-h-[800px] overflow-hidden bg-stone-900 -mt-[calc(40px+64px)]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className={`absolute inset-0 ${slide.overlay}`} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4 mt-[104px]">
        <div>
          <p className="text-terracotta-300 text-sm font-inter uppercase tracking-[0.3em] mb-4">
            La Brocante de Nanie
          </p>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium mb-4 leading-tight">
            {slides[current].title}
          </h1>
          <p className="text-white/80 font-inter text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {slides[current].subtitle}
          </p>
          <Link href={slides[current].cta.href} className="btn-primary text-base px-8 py-4">
            {slides[current].cta.label}
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Précédent"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors"
        aria-label="Suivant"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/40'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
