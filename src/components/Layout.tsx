"use client"

import type React from "react"
import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Home, Package, Tag, Truck, ShoppingCart, LogOut, Menu, X } from "react-feather"

const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home size={18} /> },
    { path: "/products", label: "Products", icon: <Package size={18} /> },
    { path: "/categories", label: "Categories", icon: <Tag size={18} /> },
    { path: "/suppliers", label: "Suppliers", icon: <Truck size={18} /> },
    { path: "/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  ]

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Inventory App</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path) ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 pt-6 border-t">
            <div className="flex items-center px-4 py-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <button className="text-gray-500 lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} />
              </button>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {navItems.find((item) => isActive(item.path))?.label || "Dashboard"}
                </h2>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center">
                    <span className="hidden md:block mr-2 text-sm text-gray-700">{user?.username}</span>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      {user?.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

