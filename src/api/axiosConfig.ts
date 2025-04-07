import axios, { type AxiosError, type AxiosResponse } from "axios"
import { toast } from "react-toastify"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    
  },
})

// Request interceptor for adding the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
        toast.error("Your session has expired. Please log in again.")
      } else if (status === 403) {
        // Forbidden
        toast.error("You don't have permission to perform this action.")
      } else if (status === 404) {
        // Not found
        toast.error("The requested resource was not found.")
      } else if (status >= 500) {
        // Server error
        toast.error("A server error occurred. Please try again later.")
      } else {
        // Other errors
        const errorMessage = error.response.data?.message || "An error occurred"
        toast.error(errorMessage)
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("No response from server. Please check your internet connection.")
    } else {
      // Something happened in setting up the request that triggered an Error
      toast.error("An error occurred while processing your request.")
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

