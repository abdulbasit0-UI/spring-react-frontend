"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, LoginCredentials, RegisterData, AuthResponse } from "../types"
import { authApi } from "../api/AuthApi"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (token && storedUser) {
        try {
          const isValid = await authApi.validateToken()
          if (isValid) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        } catch (error) {
          console.error("Error validating token:", error)
        }
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response: AuthResponse = await authApi.login(credentials)
      const user = {
        id: response.userId,
        name: response.firstName,
        username: response.username,
        email: response.email,
        role: response.role,

      }
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response: AuthResponse = await authApi.register(data)
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

