import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { URLBACKEND } from "../constants"

const UpdateProduct = ({ product, onClose, onUpdate }) => {

  if (!product) return null

  const [loader, setLoader] = useState(false)

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    stock: Number(product.stock),
    price: Number(product.price),
    category: product.category,
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      })

      if (response.ok) {
        onUpdate()
        onClose()
      }

    } catch (error) {
      console.log("Error al actualizar el producto :(")
    } finally {
      setLoader(false)
    }
  }

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Editar producto</h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="modal-body d-flex flex-column gap-3">

              <input
                className="form-control"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
              />

              <input
                className="form-control"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción"
              />

              <input
                className="form-control"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="Precio"
              />

              <input
                className="form-control"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock"
              />

              <input
                className="form-control"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
                placeholder="Categoría"
              />

            </div>

            <div className="modal-footer">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loader}
              >
                {loader ? "Enviando..." : "Guardar cambios"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  )
}

export default UpdateProduct