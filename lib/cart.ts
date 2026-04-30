import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  slug: string
  weight?: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isInCart: (id: string) => boolean
  total: () => number
  totalWeight: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find((i) => i.id === item.id)
        if (!exists) {
          set((state) => ({ items: [...state.items, item] }))
        }
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      isInCart: (id) => get().items.some((i) => i.id === id),
      total: () => get().items.reduce((acc, item) => acc + item.price, 0),
      totalWeight: () => get().items.reduce((acc, item) => acc + (item.weight || 0), 0),
    }),
    {
      name: 'brocante-cart',
    }
  )
)
