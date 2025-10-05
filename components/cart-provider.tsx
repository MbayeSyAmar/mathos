"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

// Définir le type pour le contexte
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  description?: string
}

type CartContextType = {
  items: CartItem[]
  totalPrice: number
  totalItems: number
  addToCart: (product: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isCartOpen: boolean
  toggleCart: () => void
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
        calculateTotal(parsedCart)
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }

    // Sync with Firebase if user is logged in
    const syncCartWithFirebase = async () => {
      const user = auth.currentUser
      if (user) {
        try {
          const cartDoc = await getDoc(doc(db, "user_carts", user.uid))
          if (cartDoc.exists()) {
            const firebaseCart = cartDoc.data().items
            if (firebaseCart && firebaseCart.length > 0) {
              setItems(firebaseCart)
              calculateTotal(firebaseCart)
              localStorage.setItem("cart", JSON.stringify(firebaseCart))
            }
          }
        } catch (error) {
          console.error("Error syncing cart with Firebase:", error)
        }
      }
    }

    syncCartWithFirebase()
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(items))
    calculateTotal(items)

    // Sync with Firebase if user is logged in
    const syncCartWithFirebase = async () => {
      const user = auth.currentUser
      if (user) {
        try {
          await setDoc(doc(db, "user_carts", user.uid), {
            items: items,
            updatedAt: new Date(),
          })
        } catch (error) {
          console.error("Error syncing cart with Firebase:", error)
        }
      }
    }

    syncCartWithFirebase()
  }, [items])

  const calculateTotal = (cartItems: CartItem[]) => {
    if (!cartItems || !Array.isArray(cartItems)) {
      setTotalPrice(0)
      setTotalItems(0)
      return
    }

    const sum = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
    setTotalPrice(sum)

    const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
    setTotalItems(itemCount)
  }

  const addToCart = (product: CartItem) => {
    setItems((prevItems) => {
      if (!prevItems) return [{ ...product, quantity: product.quantity || 1 }]

      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) } : item,
        )
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }]
      }
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => {
      if (!prevItems) return []
      return prevItems.filter((item) => item.id !== productId)
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prevItems) => {
      if (!prevItems) return []
      return prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  const value: CartContextType = {
    items,
    totalPrice,
    totalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isCartOpen,
    toggleCart,
    setIsCartOpen,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
