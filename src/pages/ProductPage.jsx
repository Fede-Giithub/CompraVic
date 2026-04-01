import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Layout from "../components/Layout"
import { URLBACKEND } from "../constants"

const ProductPage = () => {
  const { id } = useParams() // 👈 obtenés el id de la URL
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${URLBACKEND}/books/${id}`)
        const data = await response.json()
        setProduct(data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProduct()
  }, [id])

  if (!product) return <p>Cargando...</p>

  return (
    <Layout>
      <div className="product-detail">

        {/* 👇 IMAGEN */}
        {product.img && (
          <img
            src={`${URLBACKEND}/uploads/${product.img}`}
            alt={product.name}
            style={{ width: "300px", objectFit: "cover" }}
          />
        )}

        <h1>{product.name}</h1>
        <p>{product.description}</p>

        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Autor:</strong> {product.author}</p>

        {/* 👇 BOTÓN */}
        <button onClick={() => alert("Agregado al carrito 🛒")}>
          Agregar al carrito
        </button>

      </div>
    </Layout>
  )
}

export default ProductPage