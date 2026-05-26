import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"
import { useAuth } from "../context/AuthContext"
import ToastMessage from "../components/ToastMessage.jsx"
import { URLBACKEND } from "../constants"
import { useCart } from "../context/CartContext"
import ChatPopup from "../pages/ChatPopup"



const Home = () => {
  const initialErrorState = {
    success: null,
    notification: null,
    error: {
      fetch: null,
      delete: null
    }
  }

  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [filters, setFilters] = useState({
    name: "",
    stock: 0,
    category: "",
    minPrice: 0,
    maxPrice: 0,
    author: ""
  })

  const [responseServer, setResponseServer] = useState(initialErrorState)

  const { user, token } = useAuth()
  const { addToCart } = useCart()


  const fetchingProducts = async (query = "") => {
    setResponseServer(initialErrorState)

    try {
      const response = await fetch(`${URLBACKEND}/products?${query}`)
      const dataProducts = await response.json()

      setProducts(
        Array.isArray(dataProducts?.data)
          ? dataProducts.data.reverse()
          : []
      )

      setResponseServer({
        success: true,
        notification: "Éxito al cargar los productos",
        error: {
          ...responseServer.error,
          fetch: true
        }
      })
    } catch (e) {
      setResponseServer({
        success: false,
        notification: "Error al traer los datos",
        error: {
          ...responseServer.error,
          fetch: false
        }
      })
    }
  }

  useEffect(() => {
    fetchingProducts()
  }, [])

  const deleteProduct = async (id) => {
    if (!confirm("¿Seguro que querés borrar el producto?")) return

    try {
      const response = await fetch(`${URLBACKEND}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
        return
      }

      setProducts(products.filter((p) => p._id !== id))

      alert(`${data.data.name} borrado con éxito`)
    } catch (error) {
      console.log("Error al borrar producto")
    }
  }

  const handleUpdateProducts = (p) => {
    setSelectedProduct(p)
  }

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

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
    setFilters({
      name: "",
      stock: 0,
      category: "",
      minPrice: 0,
      maxPrice: 0
    })

    fetchingProducts()
  }

  return (
    <Layout>
      <section className="container mt-4">
        <h1 className="mb-4">Productos</h1>

        <p>
          Bienvenido{" "}
          <strong>
            {user ? `${user.email} (${user.role})` : "Invitado"}
          </strong>
        </p>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control"
                name="name"
                placeholder="Buscar por nombre"
                value={filters.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <button type="submit" className="btn btn-primary w-100">
                Buscar
              </button>
            </div>

            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={handleResetFilters}
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {selectedProduct && (
          <UpdateProduct
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onUpdate={fetchingProducts}
          />
        )}

        <div className="row">
          {products.length === 0 && (
            <p>No hay productos disponibles</p>
          )}

          {products.map((p) => (
            <div key={p._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                {p.image && (
                  <img
                    src={p.image}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>

                  <p className="card-text">{p.description}</p>

                  <p>
                    <strong>Categoría:</strong> {p.category}
                  </p>

                  <p>
                    <strong>Stock:</strong> {p.stock}
                  </p>

                  <p>
                    <strong>Precio:</strong> ${p.price}
                  </p>

                  {/* ADMIN */}
                  {user?.role === "admin" && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleUpdateProducts(p)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => deleteProduct(p._id)}
                      >
                        Borrar
                      </button>
                    </div>
                  )}

                  {/* USER NORMAL */}
                  {user?.role === "user" && (
                    <button
                      className="btn btn-success"
                      onClick={() => addToCart(p)}
                    >
                      Agregar al carrito
                    </button>
                  )}

                  {/* INVITADO */}
                  {!user && (
                    <p className="text-muted">
                      Iniciá sesión para comprar
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!responseServer.error.fetch &&
          responseServer.notification && (
            <ToastMessage
              color="red"
              msg={responseServer.notification}
            />
          )}

        {responseServer.success && (
          <ToastMessage
            color="green"
            msg={responseServer.notification}
          />
        )}
      </section>
    </Layout>
  )
}

export default Home