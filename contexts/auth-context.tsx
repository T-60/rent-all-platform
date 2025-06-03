"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Notification, Product, RentalDetails } from "@/lib/mock-data"
import { getInitialNotifications } from "@/lib/mock-data"

interface User {
  id: string
  name: string
  email: string
  university: string
  password: string
  rentedProducts: string[]
  ownedProducts: string[]
  rentalHistory: RentalDetails[]
}

interface AuthContextType {
  user: User | null
  users: User[]
  notifications: Notification[]
  userProducts: Product[]
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, university: string, password: string) => boolean
  logout: () => void
  rentProduct: (
    productId: string,
    productName: string,
    hours: number,
    pickupDate: string,
    pickupTime: string,
    pickupAddress: string,
    returnAddress: string,
    pricePerHour: number,
  ) => void
  addProduct: (product: Omit<Product, "id" | "ownerId" | "createdAt">) => void
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
  isAuthenticated: boolean
  updateProduct: (productId: string, updates: Partial<Product>) => void
  deleteProduct: (productId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userProducts, setUserProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    // Cargar usuarios y sesión desde localStorage
    const savedUsers = localStorage.getItem("rent-all-users")
    const savedSession = localStorage.getItem("rent-all-session")
    const savedUserProducts = localStorage.getItem("rent-all-user-products")

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    }

    if (savedSession) {
      const sessionUser = JSON.parse(savedSession)
      setUser(sessionUser)
    }

    if (savedUserProducts) {
      setUserProducts(JSON.parse(savedUserProducts))
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem("rent-all-session", JSON.stringify(foundUser))

      // Cargar notificaciones del usuario o crear las iniciales
      const userNotificationsKey = `rent-all-notifications-${foundUser.id}`
      const savedUserNotifications = localStorage.getItem(userNotificationsKey)

      if (savedUserNotifications) {
        const userNotifications = JSON.parse(savedUserNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
        setNotifications(userNotifications)
      } else {
        // Primera vez que inicia sesión, crear notificación de bienvenida
        const initialNotifications = getInitialNotifications()
        setNotifications(initialNotifications)
        localStorage.setItem(userNotificationsKey, JSON.stringify(initialNotifications))
      }

      return true
    }
    return false
  }

  const register = (name: string, email: string, university: string, password: string): boolean => {
    if (users.find((u) => u.email === email)) {
      return false // Usuario ya existe
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      university,
      password,
      rentedProducts: [],
      ownedProducts: [],
      rentalHistory: [],
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    localStorage.setItem("rent-all-users", JSON.stringify(updatedUsers))

    setUser(newUser)
    localStorage.setItem("rent-all-session", JSON.stringify(newUser))

    // Crear notificaciones iniciales para el nuevo usuario
    const initialNotifications = getInitialNotifications()
    setNotifications(initialNotifications)
    localStorage.setItem(`rent-all-notifications-${newUser.id}`, JSON.stringify(initialNotifications))

    return true
  }

  const logout = () => {
    setUser(null)
    setNotifications([])
    localStorage.removeItem("rent-all-session")
    router.push("/auth")
  }

  const rentProduct = (
    productId: string,
    productName: string,
    hours: number,
    pickupDate: string,
    pickupTime: string,
    pickupAddress: string,
    returnAddress: string,
    pricePerHour: number,
  ) => {
    if (user) {
      const totalPrice = hours * pricePerHour

      const rentalDetail: RentalDetails = {
        id: `rental-${Date.now()}`,
        productId,
        productName,
        hours,
        totalPrice,
        pickupDate,
        pickupTime,
        pickupAddress,
        returnAddress,
        rentalDate: new Date(),
        status: "active",
      }

      const updatedUser = {
        ...user,
        rentedProducts: [...user.rentedProducts, productId],
        rentalHistory: [...user.rentalHistory, rentalDetail],
      }
      setUser(updatedUser)
      localStorage.setItem("rent-all-session", JSON.stringify(updatedUser))

      // Actualizar en la lista de usuarios
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      localStorage.setItem("rent-all-users", JSON.stringify(updatedUsers))

      // Crear notificación de alquiler
      const rentalNotification: Notification = {
        id: `rental-${Date.now()}`,
        title: "¡Alquiler confirmado!",
        message: `Tu alquiler de ${productName} por ${hours} horas ha sido confirmado. Total: S/ ${totalPrice}`,
        read: false,
        timestamp: new Date(),
        type: "rental",
      }

      const updatedNotifications = [rentalNotification, ...notifications]
      setNotifications(updatedNotifications)
      localStorage.setItem(`rent-all-notifications-${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const addProduct = (productData: Omit<Product, "id" | "ownerId" | "createdAt">) => {
    if (user) {
      const newProduct: Product = {
        ...productData,
        id: `user-product-${Date.now()}`,
        ownerId: user.id,
        createdAt: new Date(),
        owner: user.name,
        university: user.university,
      }

      const updatedUserProducts = [...userProducts, newProduct]
      setUserProducts(updatedUserProducts)
      localStorage.setItem("rent-all-user-products", JSON.stringify(updatedUserProducts))

      // Actualizar usuario con producto añadido
      const updatedUser = {
        ...user,
        ownedProducts: [...user.ownedProducts, newProduct.id],
      }
      setUser(updatedUser)
      localStorage.setItem("rent-all-session", JSON.stringify(updatedUser))

      // Actualizar en la lista de usuarios
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      localStorage.setItem("rent-all-users", JSON.stringify(updatedUsers))

      // Crear notificación
      const productNotification: Notification = {
        id: `product-${Date.now()}`,
        title: "¡Producto añadido!",
        message: `Tu producto "${newProduct.name}" ha sido publicado exitosamente.`,
        read: false,
        timestamp: new Date(),
        type: "system",
      }

      const updatedNotifications = [productNotification, ...notifications]
      setNotifications(updatedNotifications)
      localStorage.setItem(`rent-all-notifications-${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    setNotifications(updatedNotifications)
    if (user) {
      localStorage.setItem(`rent-all-notifications-${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    if (user) {
      localStorage.setItem(`rent-all-notifications-${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    if (user) {
      const updatedUserProducts = userProducts.map((product) =>
        product.id === productId ? { ...product, ...updates } : product,
      )
      setUserProducts(updatedUserProducts)
      localStorage.setItem("rent-all-user-products", JSON.stringify(updatedUserProducts))

      // Crear notificación
      const updateNotification: Notification = {
        id: `update-${Date.now()}`,
        title: "Producto actualizado",
        message: `Tu producto "${updates.name || "producto"}" ha sido actualizado exitosamente.`,
        read: false,
        timestamp: new Date(),
        type: "system",
      }

      const updatedNotifications = [updateNotification, ...notifications]
      setNotifications(updatedNotifications)
      localStorage.setItem(`rent-all-notifications-${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  const deleteProduct = (productId: string) => {
    if (user) {
      const productToDelete = userProducts.find((p) => p.id === productId)
      const updatedUserProducts = userProducts.filter((product) => product.id !== productId)
      setUserProducts(updatedUserProducts)
      localStorage.setItem("rent-all-user-products", JSON.stringify(updatedUserProducts))

      // Actualizar usuario
      const updatedUser = {
        ...user,
        ownedProducts: user.ownedProducts.filter((id) => id !== productId),
      }
      setUser(updatedUser)
      localStorage.setItem("rent-all-session", JSON.stringify(updatedUser))

      // Actualizar en la lista de usuarios
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      localStorage.setItem("rent-all-users", JSON.stringify(updatedUsers))

      // Crear notificación
      const deleteNotification: Notification = {
        id: `delete-${Date.now()}`,
        title: "Producto eliminado",
        message: `Tu producto "${productToDelete?.name || "producto"}" ha sido eliminado exitosamente.`,
        read: false,
        timestamp: new Date(),
        type: "system",
      }

      const updatedNotifications = [deleteNotification, ...notifications]
      setNotifications(updatedNotifications)
      localStorage.setItem(`rent-all-notifications-${user.id}`, JSON.stringify(updatedNotifications))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        notifications,
        userProducts,
        login,
        register,
        logout,
        rentProduct,
        addProduct,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isAuthenticated: !!user,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
