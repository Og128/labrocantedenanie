'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title: string
  isSold: boolean
}

export default function ProductGallery({ images, title, isSold }: Props) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="space-y-3">
      <div className={`relative aspect-[4/5] rounded-sm overflow-hidden bg-beige ${isSold ? 'opacity-80' : ''}`}>
        <Image
          src={images[selected] || '/images/placeholder.jpg'}
          alt={title}
          fill
          priority
          className={`object-cover ${isSold ? 'grayscale' : ''}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-stone-800/90 text-white font-inter font-medium text-lg px-8 py-3 uppercase tracking-widest">
              Vendu
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative aspect-square rounded-sm overflow-hidden bg-beige border-2 transition-colors ${
                selected === i ? 'border-terracotta-500' : 'border-beige hover:border-terracotta-400'
              }`}
            >
              <Image
                src={img}
                alt={`${title} - photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
