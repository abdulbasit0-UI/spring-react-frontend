import axiosInstance from "./axiosConfig"
import type { Order, PaginatedResponse } from "../types"

export const orderApi = {
  getAll: async (page = 0, size = 10): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>("/orders", {
      params: { page, size },
    })
    return response.data
  },

  getById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`)
    return response.data
  },

  create: async (order: Omit<Order, "id" | "orderNumber">): Promise<Order> => {
    const response = await axiosInstance.post<Order>("/orders", order)
    return response.data
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    const response = await axiosInstance.patch<Order>(`/orders/${id}/status`, { status })
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/orders/${id}`)
  },
}

