import axiosInstance from "./axiosConfig"
import type { Category } from "../types"

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>("/category")
    return response.data
  },

  getAllWithoutPagination: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>("/category")
    return response.data
  },

  getById: async (id: number): Promise<Category> => {
    const response = await axiosInstance.get<Category>(`/category/${id}`)
    return response.data
  },

  create: async (category: Omit<Category, "id">): Promise<Category> => {
    const response = await axiosInstance.post<Category>("/category", category)
    return response.data
  },

  update: async (id: number, category: Partial<Category>): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/category/${id}`, category)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/category/${id}`)
  },
}

