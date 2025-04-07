import axiosInstance from "./axiosConfig"
import type { LoginCredentials, RegisterData, AuthResponse } from "../types"

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/login", credentials)
    return response.data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/auth/register", data)
    return response.data
  },

  validateToken: async (): Promise<boolean> => {
    try {
      await axiosInstance.get("/auth/validate")
      return true
    } catch (error) {
      return false
    }
  },

  logout: (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },
}

