import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigateUser = useNavigate()

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/carrito">Carrito</Link>
        <Link to="/login">Login</Link>
      </nav>

      <hr />

      {children}
    </div>
  )
}

export default Layout