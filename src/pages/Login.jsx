import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"
import { URLBACKEND } from "../constants"

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" })

  const { login } = useAuth()
  const navigateUser = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${URLBACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const responseData = await response.json()

      if (responseData.error) {
        alert(responseData.error)
        return
      }

      login(responseData.token)
      navigateUser("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <div style={{
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          border: "1px solid #b7e4c7",
          borderRadius: "12px",
          padding: "2rem 2rem 1.75rem",
        }}>

          {/* Header */}
          <div style={{
            backgroundColor: "#2d6a4f",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            marginBottom: "1.75rem",
            textAlign: "center",
          }}>
            <h1 style={{ margin: 0, color: "#ffffff", fontSize: "1.3rem", fontWeight: 600 }}>
              Iniciar sesión
            </h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {[
              { name: "email", placeholder: "Email", type: "email", label: "Email" },
              { name: "password", placeholder: "Contraseña", type: "password", label: "Contraseña" },
            ].map(({ name, placeholder, type, label }) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 500, color: "#2d6a4f" }}>
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  onChange={handleChange}
                  value={formData[name]}
                  required
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
              Ingresar
            </button>

            <p style={{ margin: 0, textAlign: "center", fontSize: "0.85rem", color: "#888" }}>
              ¿No tenés cuenta?{" "}
              <a href="/registro" style={{ color: "#2d6a4f", fontWeight: 500, textDecoration: "none" }}>
                Registrate
              </a>
            </p>

          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Login