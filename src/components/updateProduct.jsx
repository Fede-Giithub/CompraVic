import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { URLBACKEND } from "../constants";


const UpdateProduct = ({ product, onClose, onUpdate }) => {

  if (!product) return <p>Cargando producto...</p>;

  const [loader, setLoader] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    stock: Number(product.stock),
    price: Number(product.price),
    category: product.category,
    author: product.author
  })

  const { token } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToUpdate = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock)
    }

    try {
      setLoader(true)
      const response = await fetch(`${URLBACKEND}/products/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      })

      onUpdate()
      onClose()
    } catch (error) {
      console.log("Error al actualizar el producto :(")
    } finally {
      setLoader(false)
    }
  }

  return (
    <section className="modal-overlay">
      <div className="modal-box">
        <h2>Editar producto</h2>
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
          />
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
          />
          <input
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
          />
          <input
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
          />
          <button type="submit">{loader ? "Enviando..." : "Enviar"}</button>
        </form>
        <button className="close-btn" type="button" onClick={onClose}>Cancelar</button>
      </div>
    </section>
  )
}

export default UpdateProduct