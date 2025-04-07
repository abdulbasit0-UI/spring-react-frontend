import axiosInstance from "./axiosConfig"
import type { Supplier } from "../types"

export const supplierApi = {
  getAll: async (): Promise<Supplier[]> => {
    const response = await axiosInstance.get<Supplier[]>("/suppliers", {
    })
    return response.data
  },

  getAllWithoutPagination: async (): Promise<Supplier[]> => {
    const response = await axiosInstance.get<Supplier[]>("/suppliers")
    return response.data
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await axiosInstance.get<Supplier>(`/suppliers/${id}`)
    return response.data
  },

  create: async (supplier: Omit<Supplier, "id">): Promise<Supplier> => {
    const response = await axiosInstance.post<Supplier>("/suppliers", supplier)
    return response.data
  },

  update: async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await axiosInstance.put<Supplier>(`/suppliers/${id}`, supplier)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/suppliers/${id}`)
  },
}

