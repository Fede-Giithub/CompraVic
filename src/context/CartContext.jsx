import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // 👇 cargar desde localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // 👇 guardar en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // 👉 agregar producto
  const addToCart = (product) => {
    const existing = cart.find((p) => p._id === product._id)

    if (existing) {
      setCart(cart.map((p) =>
        p._id === product._id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  // 👉 eliminar producto
  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p._id !== id))
  }

  // 👉 cambiar cantidad
  const updateQuantity = (id, quantity) => {
    setCart(cart.map((p) =>
      p._id === id ? { ...p, quantity } : p
    ))
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)