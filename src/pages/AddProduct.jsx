import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { URLBACKEND } from "../constants"

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", stock: "",categoria:"", img: null,
  })

  const navigate = useNavigate()
  const { token, user } = useAuth()

  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <div style={{ maxWidth: "480px", margin: "4rem auto", padding: "0 1rem", textAlign: "center" }}>
          <div style={{
            backgroundColor: "#fff0f0",
            border: "1px solid #f5c6c6",
            borderRadius: "12px",
            padding: "2rem",
            color: "#c0392b"
          }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>Acceso denegado</p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "#888" }}>
              No tenés permisos para acceder a esta página.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData({ ...formData, [name]: name === "img" ? files[0] : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append("name", formData.name)
    data.append("description", formData.description)
    data.append("price", Number(formData.price))
    data.append("stock", Number(formData.stock))
    data.append("category", formData.categoria)
    data.append("img", formData.img)

    try {
      const response = await fetch(`${URLBACKEND}/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

    if (!response.ok) {
  const errorData = await response.json()
  console.log("Status:", response.status)
  console.log("Error del servidor:", errorData)
  alert(`Error ${response.status}: ${JSON.stringify(errorData)}`)
  return
}

      alert("Producto guardado con éxito")
      setFormData({ name: "", description: "", price: "", stock: "", img: null })
      navigate("/")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <div style={{ backgroundColor: "#f0f7f0", minHeight: "100vh" }}>
        <section style={{ maxWidth: "560px", margin: "0 auto", padding: "2rem 1rem" }}>

          {/* Header */}
          <div style={{
            backgroundColor: "#2d6a4f",
            borderRadius: "12px",
            padding: "1.25rem 1.75rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <h1 style={{ margin: 0, color: "#ffffff", fontSize: "1.4rem", fontWeight: 600 }}>
              Agregar producto
            </h1>
            <button
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "transparent",
                color: "#d8f3dc",
                border: "1.5px solid #52b788",
                padding: "0.3rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              ← Volver
            </button>
          </div>

          {/* Form card */}
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid #b7e4c7",
            borderRadius: "12px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {[
                { name: "name", placeholder: "Nombre", type: "text", min: 3, max: 20 },
                { name: "description", placeholder: "Descripción", type: "text", min: 3, max: 200 },
                { name: "price", placeholder: "Precio", type: "number" },
                { name: "categoria", placeholder: "Categoría", type: "text", min: 2, max: 50 },
                { name: "stock", placeholder: "Stock", type: "number" },
              ].map(({ name, placeholder, type, min, max }) => (
                <div key={name} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "#2d6a4f" }}>
                    {placeholder}
                  </label>
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    minLength={min}
                    maxLength={max}
                    min={type === "number" ? 0 : undefined}
                    onChange={handleChange}
                    value={formData[name]}
                    style={{
                      padding: "0.5rem 0.875rem",
                      borderRadius: "8px",
                      border: "1.5px solid #b7e4c7",
                      fontSize: "0.9rem",
                      outline: "none",
                      color: "#1b4332",
                      backgroundColor: "#f9fdf9",
                    }}
                  />
                </div>
              ))}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "#2d6a4f" }}>
                  Imagen
                </label>
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleChange}
                  style={{
                    padding: "0.4rem 0.875rem",
                    borderRadius: "8px",
                    border: "1.5px solid #b7e4c7",
                    fontSize: "0.875rem",
                    color: "#1b4332",
                    backgroundColor: "#f9fdf9",
                    cursor: "pointer",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#2d6a4f",
                  color: "#ffffff",
                  border: "none",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                Agregar producto
              </button>

            </form>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default AddProduct