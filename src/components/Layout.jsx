import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigateUser = useNavigate()

  const handleLogout = () => {
    logout()
    navigateUser("/login")
  }

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "15px",
          padding: "10px",
          background: "#eee"
        }}
      >
        <Link to="/">Home</Link>

        {/* USER NORMAL */}
        {user?.role === "user" && (
          <>
            <Link to="/carrito">Carrito</Link>
          </>
        )}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin">Panel Admin</Link>
          </>
        )}

        {/* INVITADO */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/registro">Register</Link>
          </>
        )}

        {/* LOGOUT */}
        {user && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>

      <hr />

      {children}
    </div>
  )
}

export default Layout