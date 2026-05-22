import { useState } from "react"
import Layout from "../components/Layout"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { URLBACKEND } from "../constants"
import { useNavigate } from "react-router-dom"

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Calcular total
  const total = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0)

  const handleCheckout = async () => {
    if (user.role == "user") {
      
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${URLBACKEND}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          products: cart.map(p => ({
            productId: p._id,
            quantity: p.quantity
          }))
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || "Error al procesar la compra")
        return
      }

      alert("✅ Compra realizada con éxito!")
      // Limpiar carrito después de la compra
      cart.forEach(p => removeFromCart(p._id))
      navigate("/")
    } catch (error) {
      console.error(error)
      alert("Error al procesar la compra")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="page-banner">Carrito de Compras</div>
        <div className="page-section">
          <p>Tu carrito está vacío.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Ver Productos
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="page-banner">Carrito de Compras</div>

      <section className="page-section">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="cart-product">
                    {product.img && (
                      <img 
                        src={`${URLBACKEND}/uploads/${product.img}`} 
                        alt={product.name}
                        style={{ width: "50px", marginRight: "10px" }}
                      />
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>${product.price}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={product.quantity}
                    onChange={(e) => updateQuantity(product._id, parseInt(e.target.value))}
                    className="quantity-input"
                  />
                </td>
                <td>${product.price * product.quantity}</td>
                <td>
                  <button 
                    onClick={() => removeFromCart(product._id)}
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-summary">
          <h3>Total: ${total}</h3>
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Procesando..." : "Finalizar Compra"}
          </button>
        </div>
      </section>
    </Layout>
  )
}

export default CartPage