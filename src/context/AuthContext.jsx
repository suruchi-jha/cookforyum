"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { login as apiLogin, register as apiRegister, api } from "../services/api"
import config from "../config"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem(config.tokenKey)
        const storedUser = localStorage.getItem(config.userKey)

        if (token && storedUser) {
          // Set the user from localStorage
          setUser(JSON.parse(storedUser))

          // Update auth header for future requests
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
      } catch (err) {
        console.error("Authentication error:", err)
        localStorage.removeItem(config.tokenKey)
        localStorage.removeItem(config.userKey)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const result = await apiLogin(email, password)

      if (result.success) {
        setUser(result.user)
      }

      return result
    } catch (err) {
      setError(err.message || "Login failed")
      return {
        success: false,
        message: err.message || "Invalid email or password",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      setError(null)
      return await apiRegister(name, email, password)
    } catch (err) {
      setError(err.message || "Registration failed")
      return {
        success: false,
        message: err.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem(config.tokenKey)
    localStorage.removeItem(config.userKey)
    setUser(null)
    // Clear Authorization header
    delete api.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

