import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import logo from "../imagenes/logo.png"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigateUser = useNavigate()

  const handleLogout = () => {
    logout()
    navigateUser("/login")
  }

  return (
    <div style={{ backgroundColor: "#f0f7f0", minHeight: "100vh" }}>
      <nav style={{
        backgroundColor: "#2d6a4f",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>

        {/* Links izquierda */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none"
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "38px",
                height: "38px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Link>

          <Link to="/" style={navLinkStyle}>
            Home
          </Link>

          {user?.role === "user" && (
            <Link to="/carrito" style={navLinkStyle}>
              Carrito
            </Link>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/agregar-producto"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#2d6a4f",
                  padding: "0.35rem 1rem",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                + Agregar producto
              </Link>
            </>
          )}

        </div>

        {/* Links derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

          {!user && (
            <>
              <Link to="/login" style={navLinkStyle}>
                Login
              </Link>

              <Link
                to="/registro"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#2d6a4f",
                  padding: "0.35rem 1rem",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                Registro
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "transparent",
                color: "#d8f3dc",
                border: "1.5px solid #52b788",
                padding: "0.35rem 1rem",
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}

        </div>
      </nav>

      <main>
        {children}
      </main>
    </div>
  )
}

const navLinkStyle = {
  color: "#d8f3dc",
  textDecoration: "none",
  padding: "0.35rem 0.75rem",
  borderRadius: "8px",
  fontSize: "0.9rem",
  fontWeight: 500,
}

export default Layout