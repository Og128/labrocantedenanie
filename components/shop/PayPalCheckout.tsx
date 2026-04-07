'use client'

import { useEffect, useRef } from 'react'
import { loadScript } from '@paypal/paypal-js'

interface Props {
  onCreateOrder: () => Promise<string | null>
  onApprove: (data: { orderID: string }) => Promise<void>
  onError: () => void
}

export default function PayPalCheckout({ onCreateOrder, onApprove, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendered = useRef(false)

  useEffect(() => {
    if (rendered.current || !containerRef.current) return
    rendered.current = true

    loadScript({
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
      currency: 'EUR',
    }).then((paypal) => {
      if (!paypal?.Buttons || !containerRef.current) return
      paypal.Buttons({
        style: { layout: 'horizontal', color: 'gold', shape: 'rect', label: 'paypal', height: 48 },
        createOrder: async () => {
          const id = await onCreateOrder()
          if (!id) throw new Error('Impossible de créer la commande')
          return id
        },
        onApprove: async (data) => {
          await onApprove({ orderID: data.orderID })
        },
        onError: () => onError(),
      }).render(containerRef.current!)
    })
  }, [onCreateOrder, onApprove, onError])

  return <div ref={containerRef} className="min-h-[48px]" />
}
