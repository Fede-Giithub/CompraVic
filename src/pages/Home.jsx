import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"
import { useAuth } from "../context/AuthContext"
import ToastMessage from "../components/ToastMessage.jsx"
import { URLBACKEND } from "../constants"
import { useCart } from "../context/CartContext"
import ChatPopup from "../pages/ChatPopup"
import AddProduct from "../pages/AddProduct"
const Home = () => {
  const initialErrorState = {
    success: null,
    notification: null,
    error: { fetch: null, delete: null }
  }

  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [filters, setFilters] = useState({
    name: "", stock: 0, category: "", minPrice: 0, maxPrice: 0, author: ""
  })
  const [responseServer, setResponseServer] = useState(initialErrorState)

  const { user, token } = useAuth()
  const { addToCart } = useCart()

  const fetchingProducts = async (query = "") => {
    setResponseServer(initialErrorState)
    try {
      const response = await fetch(`${URLBACKEND}/products?${query}`)
      const dataProducts = await response.json()
      setProducts(Array.isArray(dataProducts?.data) ? dataProducts.data.reverse() : [])
      setResponseServer({ success: true, notification: "Éxito al cargar los productos", error: { ...responseServer.error, fetch: true } })
    } catch (e) {
      setResponseServer({ success: false, notification: "Error al traer los datos", error: { ...responseServer.error, fetch: false } })
    }
  }

  useEffect(() => { fetchingProducts() }, [])

  const deleteProduct = async (id) => {
    if (!confirm("¿Seguro que querés borrar el producto?")) return
    try {
      const response = await fetch(`${URLBACKEND}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.error) { alert(data.error); return }
      setProducts(products.filter((p) => p._id !== id))
      alert(`${data.data.name} borrado con éxito`)
    } catch (error) {
      console.log("Error al borrar producto")
    }
  }

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = new URLSearchParams()
    if (filters.name) query.append("name", filters.name)
    if (filters.stock) query.append("stock", filters.stock)
    if (filters.category) query.append("category", filters.category)
    if (filters.minPrice) query.append("minPrice", filters.minPrice)
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice)
    fetchingProducts(query.toString())
  }

  const handleResetFilters = () => {
    setFilters({ name: "", stock: 0, category: "", minPrice: 0, maxPrice: 0 })
    fetchingProducts()
  }

  return (
    <Layout>
      <div style={{ backgroundColor: "#f0f7f0", minHeight: "100vh" }}>
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>

          {/* Header */}
          <div style={{
            backgroundColor: "#2d6a4f",
            borderRadius: "12px",
            padding: "1.5rem 2rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem"
          }}>
            <h1 style={{ margin: 0, color: "#ffffff", fontSize: "1.6rem", fontWeight: 600 }}>
              Productos
            </h1>
            <span style={{
              backgroundColor: "#1b4332",
              color: "#d8f3dc",
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              fontSize: "0.875rem"
            }}>
              {user ? `${user.email} · ${user.role}` : "Invitado"}
            </span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSubmit} style={{
            backgroundColor: "#ffffff",
            border: "1px solid #b7e4c7",
            borderRadius: "10px",
            padding: "1rem 1.25rem",
            marginBottom: "1.75rem"
          }}>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center"
            }}>
              <input
                name="name"
                placeholder="Buscar por nombre..."
                value={filters.name}
                onChange={handleChange}
                style={{
                  flex: "1 1 220px",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "8px",
                  border: "1.5px solid #b7e4c7",
                  fontSize: "0.9rem",
                  outline: "none",
                  color: "#1b4332"
                }}
              />
              <button type="submit" style={{
                backgroundColor: "#2d6a4f",
                color: "#ffffff",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "0.9rem",
                whiteSpace: "nowrap"
              }}>
                Buscar
              </button>
              <button type="button" onClick={handleResetFilters} style={{
                backgroundColor: "#ffffff",
                color: "#2d6a4f",
                border: "1.5px solid #2d6a4f",
                padding: "0.5rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: "0.9rem",
                whiteSpace: "nowrap"
              }}>
                Reset
              </button>
            </div>
          </form>

          {/* Update modal */}
          {selectedProduct && (
            <UpdateProduct
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onUpdate={fetchingProducts}
            />
          )}

          {/* Product grid */}
          {products.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              color: "#2d6a4f",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #b7e4c7"
            }}>
              No hay productos disponibles
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.25rem"
            }}>
              {products.map((p) => (
                <div key={p._id} style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #b7e4c7",
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.2s",
                }}>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                  )}

                  <div style={{ padding: "1rem 1.1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <h5 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#1b4332" }}>
                      {p.name}
                    </h5>

                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#555", lineHeight: 1.5 }}>
                      {p.description}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                      <span style={{
                        backgroundColor: "#d8f3dc",
                        color: "#1b4332",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 500
                      }}>
                        {p.category}
                      </span>
                      <span style={{
                        backgroundColor: "#f0f7f0",
                        color: "#2d6a4f",
                        padding: "0.2rem 0.65rem",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        border: "1px solid #b7e4c7"
                      }}>
                        Stock: {p.stock}
                      </span>
                    </div>

                    <p style={{
                      margin: "0.4rem 0 0",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#2d6a4f"
                    }}>
                      ${p.price}
                    </p>

                    <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
                      {user?.role === "admin" && (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => setSelectedProduct(p)}
                            style={{
                              flex: 1,
                              backgroundColor: "#ffffff",
                              color: "#2d6a4f",
                              border: "1.5px solid #2d6a4f",
                              padding: "0.45rem 0",
                              borderRadius: "8px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontSize: "0.875rem"
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            style={{
                              flex: 1,
                              backgroundColor: "#fff0f0",
                              color: "#c0392b",
                              border: "1.5px solid #f5c6c6",
                              padding: "0.45rem 0",
                              borderRadius: "8px",
                              fontWeight: 500,
                              cursor: "pointer",
                              fontSize: "0.875rem"
                            }}
                          >
                            Borrar
                          </button>
                        </div>
                      )}

                      {user?.role === "user" && (
                        <button
                          onClick={() => addToCart(p)}
                          style={{
                            width: "100%",
                            backgroundColor: "#2d6a4f",
                            color: "#ffffff",
                            border: "none",
                            padding: "0.5rem",
                            borderRadius: "8px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          Agregar al carrito
                        </button>
                      )}

                      {!user && (
                        <p style={{ margin: 0, fontSize: "0.8rem", color: "#888", textAlign: "center" }}>
                          Iniciá sesión para comprar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Toasts */}
          {!responseServer.error.fetch && responseServer.notification && (
            <ToastMessage color="red" msg={responseServer.notification} />
          )}
          {responseServer.success && (
            <ToastMessage color="green" msg={responseServer.notification} />
          )}
        </section>
      </div>
    </Layout>
  )
}

export default Home