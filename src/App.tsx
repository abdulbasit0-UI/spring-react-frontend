"use client"

import type React from "react"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import ProductList from "./pages/products/ProductList"
import ProductCreate from "./pages/products/ProductCreate"
import ProductEdit from "./pages/products/ProductEdit"
import CategoryList from "./pages/categories/CategoryList"
import CategoryCreate from "./pages/categories/CategoryCreate"
import CategoryEdit from "./pages/categories/CategoryEdit"
import SupplierList from "./pages/suppliers/SupplierList"
import SupplierCreate from "./pages/suppliers/SupplierCreate"
import SupplierEdit from "./pages/suppliers/SupplierEdit"
import OrderList from "./pages/orders/OrderList"
import OrderDetails from "./pages/orders/OrderDetails"
import OrderCreate from "./pages/orders/OrderCreate"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products">
          <Route index element={<ProductList />} />
          <Route path="create" element={<ProductCreate />} />
          <Route path="edit/:id" element={<ProductEdit />} />
        </Route>
        <Route path="categories">
          <Route index element={<CategoryList />} />
          <Route path="create" element={<CategoryCreate />} />
          <Route path="edit/:id" element={<CategoryEdit />} />
        </Route>
        <Route path="suppliers">
          <Route index element={<SupplierList />} />
          <Route path="create" element={<SupplierCreate />} />
          <Route path="edit/:id" element={<SupplierEdit />} />
        </Route>
        <Route path="orders">
          <Route index element={<OrderList />} />
          <Route path="create" element={<OrderCreate />} />
          <Route path=":id" element={<OrderDetails />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

