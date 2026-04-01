import { useState } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { URLBACKEND } from "../constants";

const AddProduct = () => {
    const [formData,setFormData] = useState({
        name:"",
        description:"",
        price:"",
        stock:"",
        img:"",
    })

    const navigate = useNavigate();
    const {token} = useAuth();

     const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    }

    console.log(token)

    try {
      const response = await fetch(`${URLBACKEND}/books`, { //ACA CAMBIE EL ENDPOINT
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
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
        category: "",
        author:""
      })
      navigate("/")
    } catch (error) {

    }
  }

}