"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, Tag, Truck, ShoppingCart } from "react-feather"
import { productApi } from "../api/productApi"
import { categoryApi } from "../api/categoryApi"
import { supplierApi } from "../api/supplierApi"
import { orderApi } from "../api/orderApi"
import type { Product } from "../types"

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    suppliers: 0,
    orders: 0,
  })

  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch counts
        const productsResponse = await productApi.getAll()
        const categoriesResponse = await categoryApi.getAll()
        const suppliersResponse = await supplierApi.getAll()
        const ordersResponse = await orderApi.getAll()

        setStats({
          products: productsResponse.length,
          categories: categoriesResponse.length,
          suppliers: suppliersResponse.length,
          orders: ordersResponse.length,
        })

        // Fetch recent products
        const recentProductsResponse = await productApi.getAll()
        setRecentProducts(recentProductsResponse)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const StatCard = ({
    title,
    value,
    icon,
    color,
    link,
  }: {
    title: string
    value: number
    icon: React.ReactNode
    color: string
    link: string
  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={link} className="block h-full">
        <div className="p-5">
          <div className="flex items-center">
            <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>{icon}</div>
            <div className="ml-5">
              <p className="text-gray-500 text-sm font-medium">{title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
          </div>
        </div>
        <div className={`px-5 py-2 bg-gray-50 border-t`}>
          <Link to={link} className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </Link>
        </div>
      </Link>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<Package size={24} className="text-white" />}
          color="bg-blue-500"
          link="/products"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<Tag size={24} className="text-white" />}
          color="bg-green-500"
          link="/categories"
        />
        <StatCard
          title="Suppliers"
          value={stats.suppliers}
          icon={<Truck size={24} className="text-white" />}
          color="bg-purple-500"
          link="/suppliers"
        />
        <StatCard
          title="Orders"
          value={stats.orders}
          icon={<ShoppingCart size={24} className="text-white" />}
          color="bg-orange-500"
          link="/orders"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentProducts?.length > 0 ? (
            recentProducts.map((product) => (
              <div key={product.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {product.categoryName} | Supplier: {product.supplierName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">${product.price.toFixed(2)}</p>
                    <p
                      className={`text-xs mt-1 ${
                        product.quantity > 10
                          ? "text-green-600"
                          : product.quantity > 0
                            ? "text-orange-500"
                            : "text-red-600"
                      }`}
                    >
                      Stock: {product.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No products found.{" "}
              <Link to="/products/create" className="text-blue-600 hover:text-blue-500">
                Add your first product
              </Link>
            </div>
          )}
        </div>
        {recentProducts?.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t">
            <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

