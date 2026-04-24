import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
// import CookieBanner from '@/components/ui/CookieBanner'
import Providers from '@/components/ui/Providers'

export const metadata: Metadata = {
  title: {
    default: 'La Brocante de Nanie — Des trésors du passé pour embellir votre aujourd\'hui',
    template: '%s | La Brocante de Nanie',
  },
  description:
    'Découvrez notre sélection d\'objets anciens, meubles, vaisselle et curiosités authentiques. La Brocante de Nanie vous propose des pièces uniques chargées d\'histoire.',
  keywords: [
    'brocante',
    'antiquités',
    'objets anciens',
    'meubles anciens',
    'Provence',
    'seconde main',
    'vintage',
  ],
  authors: [{ name: 'La Brocante de Nanie' }],
  creator: 'La Brocante de Nanie',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'La Brocante de Nanie',
    title: 'La Brocante de Nanie',
    description:
      'Des objets anciens, meubles et curiosités authentiques directement depuis le Sud de la France.',
    images: [
      {
        url: 'https://res.cloudinary.com/dttbty8el/image/upload/w_1200,h_630,c_fill,q_auto,f_auto/v1777022877/lbdn_logo_1_cotdaz.jpg',
        width: 1200,
        height: 630,
        alt: 'La Brocante de Nanie',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Brocante de Nanie',
    description: 'Des trésors du passé pour embellir votre aujourd\'hui',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FDFBF8',
              color: '#6B4F3A',
              border: '1px solid #E8DDD0',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#C4623A',
                secondary: '#FDFBF8',
              },
            },
          }}
        />
        {/* <CookieBanner /> */}
        </Providers>
      </body>
    </html>
  )
}
