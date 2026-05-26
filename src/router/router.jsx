import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home from "../pages/Home"
import AboutUs from "../pages/AboutUs"
import AddProduct from "../pages/AddProduct"
import Login from "../pages/Login"
import Register from "../pages/Register"
import CartPage from "../pages/CartPage"
import ProtectedRoutes from "../components/ProtectedRoutes"
import { useAuth } from "../context/AuthContext"
import ChatPopup from "../pages/ChatPopup"

const UserRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user || user.role !== "user") {
    return <Navigate to="/" />
  }

  return children
}

const RouterApp = () => {
  return (
    <BrowserRouter>
      <ChatPopup />
      <Routes>
      
        <Route path="/" element={<Home />} />

        <Route path="/sobre-nosotros" element={<AboutUs />} />

        <Route
          path="/agregar-producto"
          element={
            <ProtectedRoutes requireAdmin={true}>
              <AddProduct />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/carrito"
          element={
            <UserRoute>
              <CartPage />
            </UserRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export { RouterApp }