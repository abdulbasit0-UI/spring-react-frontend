"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Trash2, ShoppingCart } from "react-feather"
import { orderApi } from "../../api/orderApi"
import { productApi } from "../../api/productApi"
import { type Product, OrderStatus } from "../../types"
import { useAuth } from "../../context/AuthContext"
import { toast } from "react-toastify"

interface OrderItem {
  productId: number
  product: Product
  quantity: number
  unitPrice: number
  subTotal: number
}

const OrderCreate: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [shippingAddress, setShippingAddress] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [fetchingProducts, setFetchingProducts] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setFetchingProducts(true)
        const response = await productApi.getAll()
        // Only show products with stock available
        const availableProducts = response.filter((product) => product.quantity > 0)
        setProducts(availableProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      } finally {
        setFetchingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // Calculate total amount whenever order items change
  useEffect(() => {
    const total = orderItems.reduce((sum, item) => sum + item.subTotal, 0)
    setTotalAmount(total)
  }, [orderItems])

  const handleAddItem = () => {
    if (!selectedProductId) {
      toast.error("Please select a product")
      return
    }

    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero")
      return
    }

    const productId = Number.parseInt(selectedProductId)
    const product = products.find((p) => p.id === productId)

    if (!product) {
      toast.error("Selected product not found")
      return
    }

    // Check if quantity exceeds available stock
    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} units available in stock`)
      return
    }

    // Check if product is already in the order
    const existingItemIndex = orderItems.findIndex((item) => item.productId === productId)

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...orderItems]
      const existingItem = updatedItems[existingItemIndex]
      const newQuantity = existingItem.quantity + quantity

      // Check combined quantity against stock
      if (newQuantity > product.quantity) {
        toast.error(`Cannot add more. Only ${product.quantity} units available in stock`)
        return
      }

      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        subTotal: product.price * newQuantity,
      }

      setOrderItems(updatedItems)
    } else {
      // Add new item
      const newItem: OrderItem = {
        productId,
        product,
        quantity,
        unitPrice: product.price,
        subTotal: product.price * quantity,
      }

      setOrderItems([...orderItems, newItem])
    }

    // Reset selection
    setSelectedProductId("")
    setQuantity(1)
    toast.success("Product added to order")
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...orderItems]
    updatedItems.splice(index, 1)
    setOrderItems(updatedItems)
  }

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      toast.error("Quantity must be greater than zero")
      return
    }

    const item = orderItems[index]
    const product = products.find((p) => p.id === item.productId)

    if (!product) return

    // Check if quantity exceeds available stock
    if (newQuantity > product.quantity) {
      toast.error(`Only ${product.quantity} units available in stock`)
      return
    }

    const updatedItems = [...orderItems]
    updatedItems[index] = {
      ...item,
      quantity: newQuantity,
      subTotal: product.price * newQuantity,
    }

    setOrderItems(updatedItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order")
      return
    }

    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address")
      return
    }

    try {
      setLoading(true)

      // Format order items for API
      const formattedOrderItems = orderItems.map((item) => ({
        productId:  item.productId,
        quantity: item.quantity,
      }))

      // Create order object
      const orderData = {
        orderDate: new Date().toISOString(),
        status: OrderStatus.PENDING,
        shippingAddress,
        totalAmount,
        items: formattedOrderItems,
      }

      const response = await orderApi.create(orderData)
      toast.success("Order created successfully")
      navigate(`/orders/${response.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (fetchingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
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
        <h1 className="text-2xl font-bold text-gray-800">Create Order</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Add Products Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Add Products</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  id="product"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price.toFixed(2)} ({product.quantity} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus size={16} className="mr-2" />
                  Add to Order
                </button>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>

            {orderItems.length > 0 ? (
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                          <div className="text-xs text-gray-500">{item.product.categoryName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${item.unitPrice.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, Number.parseInt(e.target.value))}
                            min="1"
                            max={item.product.quantity}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">${item.subTotal.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                            <span className="sr-only">Remove</span>
                          </button>
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
                        ${totalAmount.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-md">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No items in order</h3>
                <p className="mt-1 text-sm text-gray-500">Add some products to create an order</p>
              </div>
            )}
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Shipping Information</h2>

            <div>
              <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || orderItems.length === 0}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || orderItems.length === 0 ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderCreate

