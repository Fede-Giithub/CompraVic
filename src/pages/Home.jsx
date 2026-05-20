import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import UpdateProduct from "../components/UpdateProduct"
import { useAuth } from "../context/AuthContext"
import ToastMessage from "../components/ToastMessage.jsx"
import { URLBACKEND } from "../constants"


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

  const fetchingProducts = async (query = "") => {
    setResponseServer(initialErrorState)

    try {
      const response = await fetch(`${URLBACKEND}/products?${query}`)
      const dataProducts = await response.json()

      setProducts(Array.isArray(dataProducts?.data) ? dataProducts.data.reverse() : [])

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
  }

  return (
    <Layout>
      <button className="btn btn-primary">
  Botón Bootstrap
</button>

      <section>
        <p>
          Bienvenido {user ? user.id : "invitado"}
        </p>
      </section>

      <section>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nombre" onChange={handleChange} />
          <button type="submit">Buscar</button>
        </form>
      </section>

      {selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={fetchingProducts}
        />
      )}

      <section>
        {products.length === 0 && <p>No hay productos</p>}

        {products.map((p) => (
          <div key={p._id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>

            {user && (
              <>
                <button onClick={() => handleUpdateProducts(p)}>Editar</button>
                <button onClick={() => deleteProduct(p._id)}>Borrar</button>
              </>
            )}
          </div>
        ))}
      </section>

      {!responseServer.error.fetch && responseServer.notification && (
        <ToastMessage color="red" msg={responseServer.notification} />
      )}

      {responseServer.success && (
        <ToastMessage color="green" msg={responseServer.notification} />
      )}
    </Layout>
  )
}

export default Home