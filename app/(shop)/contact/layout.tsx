import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez La Brocante de Nanie — brocante en ligne depuis le Var. Questions sur un article, demande de renseignements, nous répondons sous 24h.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
