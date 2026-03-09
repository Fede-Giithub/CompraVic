import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"


const ProtectedRoutes =()=>{
    const {user}=useAuth()

    if(!user){
        return <Navigate to={login}/>
    }else{
        return children
    }
}

export {ProtectedRoutes}