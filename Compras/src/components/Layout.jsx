import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Children } from "react"


const Layout = ({children})=> {
    const {user,logOut} = useAuth()
    const navigateUser= useNavigate()


}

