import axiosInstance from "./axiosConfig"
import type { Product } from "../types"

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>("/products", {
    })
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`)
    return response.data
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await axiosInstance.post<Product>("/products", product)
    return response.data
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await axiosInstance.put<Product>(`/products/${id}`, product)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`)
  },
}

