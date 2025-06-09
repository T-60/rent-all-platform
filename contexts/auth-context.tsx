"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiService, type User as ApiUser, type AuthResponse } from "@/lib/api"

// Define local types for backwards compatibility
interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: Date
  type: "rental" | "system"
}

interface RentalDetails {
  id: string
  productId: string
  productName: string
  hours: number
  totalPrice: number
  pickupDate: string
  pickupTime: string
  pickupAddress: string
  returnAddress: string
  rentalDate: Date
  status: "active" | "completed" | "cancelled"
}

const getInitialNotifications = (): Notification[] => [
  {
    id: "welcome",
    title: "¡Bienvenido a RentAll!",
    message: "Empieza explorando productos disponibles o publica los tuyos.",
    read: false,
    timestamp: new Date(),
    type: "system",
  },
]

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
  avatar?: string
  university?: string
  rentedProducts: string[]
  ownedProducts: string[]
  rentalHistory: RentalDetails[]
}

interface AuthContextType {
  user: User | null
  notifications: Notification[]
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, university: string, password: string) => Promise<boolean>
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
  markNotificationAsRead: (notificationId: string) => void
  markAllNotificationsAsRead: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  console.log('🏗️ [AuthProvider] Inicializando - user:', user, 'isLoading:', isLoading)

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 [AuthProvider] Inicializando autenticación...')
      // Verificar si existe un token guardado
      const token = localStorage.getItem("token");
      const savedSession = localStorage.getItem("rent-all-session");

      console.log('🔍 [AuthProvider] Token en localStorage:', token ? 'EXISTS' : 'NULL')
      console.log('🔍 [AuthProvider] Sesión en localStorage:', savedSession ? 'EXISTS' : 'NULL')

      if (token && savedSession) {
        try {
          console.log('✅ [AuthProvider] Token y sesión encontrados, verificando...')
          // Verificar si el token es válido obteniendo el perfil
          const response = await apiService.getProfile();
          if (response.user) {
            console.log('✅ [AuthProvider] Token válido, restaurando sesión...')
            // Adaptar el usuario de la API al formato local
            const sessionUser = JSON.parse(savedSession);
            setUser(sessionUser);
            console.log('👤 [AuthProvider] Usuario restaurado:', sessionUser)
            
            // Cargar notificaciones del usuario
            const userNotificationsKey = `rent-all-notifications-${sessionUser.id}`;
            const savedUserNotifications = localStorage.getItem(userNotificationsKey);
            
            if (savedUserNotifications) {
              const userNotifications = JSON.parse(savedUserNotifications).map((n: any) => ({
                ...n,
                timestamp: new Date(n.timestamp),
              }));
              setNotifications(userNotifications);
            }
          }
        } catch (error) {
          console.error("Error verificando token:", error);
          // Token inválido, limpiar localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("rent-all-session");
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 [AuthContext] Iniciando login para:', email);
      const response: AuthResponse = await apiService.login({ email, password });
      console.log('📡 [AuthContext] Respuesta del login:', response);
      
      if (response.token && response.user) {
        console.log('✅ [AuthContext] Token y usuario recibidos correctamente');
        // Guardar token en localStorage
        localStorage.setItem("token", response.token);
        console.log('💾 [AuthContext] Token guardado en localStorage');
        
        // Adaptar el usuario de la API al formato local
        const adaptedUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          avatar: response.user.avatar,
          university: response.user.university || '',
          rentedProducts: [],
          ownedProducts: [],
          rentalHistory: [],
        };
        
        console.log('👤 [AuthContext] Usuario adaptado:', adaptedUser);
        setUser(adaptedUser);
        localStorage.setItem("rent-all-session", JSON.stringify(adaptedUser));
        console.log('💾 [AuthContext] Sesión guardada en localStorage');

        // Forzar una actualización del estado
        setTimeout(() => {
          console.log('🔄 [AuthContext] Estado forzadamente actualizado');
        }, 50);

        // Cargar notificaciones del usuario o crear las iniciales
        const userNotificationsKey = `rent-all-notifications-${adaptedUser.id}`;
        const savedUserNotifications = localStorage.getItem(userNotificationsKey);

        if (savedUserNotifications) {
          const userNotifications = JSON.parse(savedUserNotifications).map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifications(userNotifications);
        } else {
          // Primera vez que inicia sesión, crear notificación de bienvenida
          const initialNotifications = getInitialNotifications();
          setNotifications(initialNotifications);
          localStorage.setItem(userNotificationsKey, JSON.stringify(initialNotifications));
        }

        console.log('✅ [AuthContext] Login completado exitosamente');
        return true;
      }
      console.log('❌ [AuthContext] No se recibió token o usuario');
      return false;
    } catch (error) {
      console.error("❌ [AuthContext] Error en login:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, university: string, password: string): Promise<boolean> => {
    try {
      console.log('📝 [AuthContext] Iniciando registro para:', email);
      const response: AuthResponse = await apiService.register({
        name,
        email,
        password,
        university,
      });
      console.log('📡 [AuthContext] Respuesta del registro:', response);
      
      if (response.token && response.user) {
        console.log('✅ [AuthContext] Token y usuario recibidos correctamente en registro');
        // Guardar token en localStorage
        localStorage.setItem("token", response.token);
        console.log('💾 [AuthContext] Token guardado en localStorage');
        
        // Adaptar el usuario de la API al formato local
        const adaptedUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          avatar: response.user.avatar,
          university: response.user.university || university,
          rentedProducts: [],
          ownedProducts: [],
          rentalHistory: [],
        };

        console.log('👤 [AuthContext] Usuario adaptado en registro:', adaptedUser);
        setUser(adaptedUser);
        localStorage.setItem("rent-all-session", JSON.stringify(adaptedUser));
        console.log('💾 [AuthContext] Sesión guardada en localStorage');

        // Forzar una actualización del estado
        setTimeout(() => {
          console.log('🔄 [AuthContext] Estado forzadamente actualizado en registro');
        }, 50);

        // Crear notificaciones iniciales para el nuevo usuario
        const initialNotifications = getInitialNotifications();
        setNotifications(initialNotifications);
        localStorage.setItem(`rent-all-notifications-${adaptedUser.id}`, JSON.stringify(initialNotifications));

        console.log('✅ [AuthContext] Registro completado exitosamente');
        return true;
      }
      console.log('❌ [AuthContext] No se recibió token o usuario en registro');
      return false;
    } catch (error) {
      console.error("❌ [AuthContext] Error en registro:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null)
    setNotifications([])
    localStorage.removeItem("token")
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

  return (
    <AuthContext.Provider
      value={{
        user,
        notifications,
        login,
        register,
        logout,
        rentProduct,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isAuthenticated: !!user,
        isLoading,
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
