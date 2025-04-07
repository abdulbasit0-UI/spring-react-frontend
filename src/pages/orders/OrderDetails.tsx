"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "react-feather"
import { orderApi } from "../../api/orderApi"
import { type Order, OrderStatus } from "../../types"
import { toast } from "react-toastify"

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await orderApi.getById(Number.parseInt(id))
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error("Failed to load order details")
        navigate("/orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, navigate])

  const handleStatusChange = async (status: string) => {
    if (!id || !order) return

    try {
      setStatusLoading(true)
      const updatedOrder = await orderApi.updateStatus(Number.parseInt(id), status)
      setOrder(updatedOrder)
      toast.success(`Order status updated to ${status}`)
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setStatusLoading(false)
    }
  }

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800"
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.SHIPPED:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Order not found or has been deleted.</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
          <span className="sr-only">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Order #{order.orderNumber}</h2>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.orderDate).toLocaleDateString()} at{" "}
                {new Date(order.orderDate).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}
              >
                {order.status}
              </span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusLoading}
                className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
            {/* <p className="text-sm text-gray-900">{order.user.username}</p> */}
            {/* <p className="text-sm text-gray-900">{order.user.email}</p> */}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
            <p className="text-sm text-gray-900">{order.shippingAddress}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* <div className="text-sm font-medium text-gray-900">{item.product.name}</div> */}
                      {/* <div className="text-xs text-gray-500">{item.product.categoryNam/e}</div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">${item.subTotal.toFixed(2)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <th colSpan={3} scope="row" className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails

