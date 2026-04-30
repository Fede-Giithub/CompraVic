import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import AboutUs from "../pages/AboutUs"
import AddProduct from "../pages/AddProduct"
import Login from "../pages/Login"
import Register from "../pages/Register"
import CartPage from "../pages/CartPage"
import ProtectedRoutes from "../components/ProtectedRoutes"

const RouterApp = () => {
  return (
    <BrowserRouter>
      <Routes>
      
        { <Route path="/" element={<Home />} /> }

        <Route path="/sobre-nosotros" element={<AboutUs />} />

        <Route
          path="/agregar-producto"
          element={
            <ProtectedRoutes requireAdmin={true}>
              <AddProduct />
            </ProtectedRoutes>
          }
        />

        <Route path="/carrito" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export { RouterApp }