export interface User {
    id: number
    username: string
    email: string
    role: string
  }
  
  export interface Product {
    id: number
    name: string
    price: number
    quantity: number
    description: string
    categoryName: string 
    supplierName: string
  }
  
  export interface Category {
    id: number
    name: string
    products?: Product[]
  }
  
  export interface Supplier {
    id: number
    name: string
    contactPerson: string
    address: string
    phoneNumber: string
    email: string
    products?: Product[]
  }
  
  export interface OrderItem {
    id: number
    product: Product
    quantity: number
    unitPrice: number
    subTotal: number
  }
  
  export enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
  }
  
  export interface Order {
    id: number
    orderNumber: string
    user: User
    orderDate: string
    status: OrderStatus
    shippingAddress: string
    totalAmount: number
    orderItems: OrderItem[]
  }
  
  export interface LoginCredentials {
    username: string
    password: string
  }
  
  export interface RegisterData {
    firstName: string
    username: string
    email: string
    password: string
  }
  
  export interface AuthResponse {
    token: string
    userId: number
    firstName: string
    username: string
    email: string
    role: string
  }
  
  export interface ApiError {
    message: string
    status: number
  }
  
  export interface PaginatedResponse<T> {
    content: T[]
    totalPages: number
    totalElements: number
    size: number
    number: number
    first: boolean
    last: boolean
  }
  
  