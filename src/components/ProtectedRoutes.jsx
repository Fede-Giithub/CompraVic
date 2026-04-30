import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


const ProtectedRoutes = ({ children, requireAdmin = false }) => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" />
    }

    if (requireAdmin && user.role !== "admin") {
        return <Navigate to="/" />
    }

    return children
}

export default ProtectedRoutes