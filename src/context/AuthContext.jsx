import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

const decodeJWT = (token) => {
  if (!token) return null

  try {
    const base64Payload = token.split(".")[1]

    const payload = atob(
      base64Payload.replace(/-/g, "+").replace(/_/g, "/")
    )

    return JSON.parse(payload)
  } catch (error) {
    return null
  }
};

const AuthProvider = ({ children }) => {
  const savedToken = sessionStorage.getItem("token")
  const [token, setToken] = useState(savedToken || null)
  // 1 - ✅ si tengo token tengo usuario
  // 2 - descifrar el payload del token
  const [user, setUser] = useState(() => savedToken ? decodeJWT(savedToken) : null)

  const login = (token) => {
    sessionStorage.setItem("token",token)
    setToken(token)
    setUser(decodeJWT(token))
  }
  const logout = () => {
  sessionStorage.removeItem("token")
  setToken(null)
  setUser(null)
}
  
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
  }
  
const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }