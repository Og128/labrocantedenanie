'use client'
import { useEffect } from 'react'
import { useCart } from '@/lib/cart'

export default function ClearCartOnMount() {
  const { clearCart } = useCart()
  useEffect(() => {
    clearCart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
