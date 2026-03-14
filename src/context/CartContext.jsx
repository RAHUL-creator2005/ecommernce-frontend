import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

const getInitialCart = () => {
  try {
    const stored = localStorage.getItem('cart')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCart)

  const persist = (nextItems) => {
    setItems(nextItems)
    try {
      localStorage.setItem('cart', JSON.stringify(nextItems))
    } catch {
      // ignore storage errors
    }
  }

  const addItem = (product, qty = 1) => {
    if (!product) return
    const id = product._id || product.id
    if (!id) return

    const next = [...items]
    const existingIndex = next.findIndex((item) => item.id === id)
    if (existingIndex >= 0) {
      next[existingIndex] = {
        ...next[existingIndex],
        qty: next[existingIndex].qty + qty,
      }
    } else {
      next.push({
        id,
        title: product.title || product.name,
        price: product.price,
        image: product.image,
        qty,
      })
    }

    persist(next)
  }

  const updateQty = (id, qty) => {
    if (!id) return
    const next = items.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, Number(qty) || 1) } : item
    )
    persist(next)
  }

  const removeItem = (id) => {
    if (!id) return
    const next = items.filter((item) => item.id !== id)
    persist(next)
  }

  const clearCart = () => {
    persist([])
  }

  const value = useMemo(
    () => ({ items, addItem, updateQty, removeItem, clearCart }),
    [items]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider')
  }
  return ctx
}
