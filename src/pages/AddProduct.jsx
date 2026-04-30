import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { URLBACKEND } from "../constants";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    img: null,
  })

  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Verificar que el usuario sea admin
  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <div className="page-banner">Acceso Denegado</div>
        <p>No tienes permisos para acceder a esta página.</p>
      </Layout>
    )
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "img") {
      setFormData({ ...formData, img: files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    data.append("name", formData.name)
    data.append("description", formData.description)
    data.append("price", Number(formData.price))
    data.append("stock", Number(formData.stock))
    data.append("img", formData.img)

    try {
      const response = await fetch(`${URLBACKEND}/products`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      })

      if (!response.ok) {
        alert("❌ Error al cargar el producto")
        return
      }

      alert("✅ Éxito al guardar el nuevo producto")
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        img: null,
      })
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <div className="page-banner">Agregar Nuevo Libro</div>

      <section className="page-section">
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            minLength={3}
            maxLength={20}
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Descripción"
            name="description"
            minLength={3}
            maxLength={200}
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="number"
            placeholder="Precio"
            name="price"
            min={0}
            onChange={handleChange}
            value={formData.price}
          />
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            min={0}
            onChange={handleChange}
            value={formData.stock}
          />
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">Agregar</button>
        </form>
      </section>
    </Layout>
  )
}

export default AddProduct