import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Suivi de commande',
  robots: { index: false },
}

export default function SuiviLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
