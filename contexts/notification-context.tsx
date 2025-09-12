"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { apiService, type Notification, type NotificationsResponse } from '@/lib/api'
import { useAuth } from './auth-context'
import { io, Socket } from 'socket.io-client'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearReadNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  // Función para cargar notificaciones desde el backend
  const refreshNotifications = async () => {
    if (!isAuthenticated || !user) return

    try {
      setIsLoading(true)
      console.log('🔔 Cargando notificaciones desde el backend...')
      
      const response: NotificationsResponse = await apiService.getNotifications(1, 50)
      
      setNotifications(response.notifications)
      setUnreadCount(response.unreadCount)
      
      console.log(`✅ Notificaciones cargadas: ${response.notifications.length} total, ${response.unreadCount} no leídas`)
    } catch (error) {
      console.error('❌ Error cargando notificaciones:', error)
      // Mantener las notificaciones existentes en caso de error
    } finally {
      setIsLoading(false)
    }
  }

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId)
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )
      
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      console.log(`✅ Notificación ${notificationId} marcada como leída`)
    } catch (error) {
      console.error('❌ Error marcando notificación como leída:', error)
      throw error
    }
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      const response = await apiService.markAllNotificationsAsRead()
      
      // Actualizar estado local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )
      
      setUnreadCount(0)
      
      console.log(`✅ ${response.modifiedCount} notificaciones marcadas como leídas`)
    } catch (error) {
      console.error('❌ Error marcando todas las notificaciones como leídas:', error)
      throw error
    }
  }

  // Eliminar notificación específica
  const deleteNotification = async (notificationId: string) => {
    try {
      await apiService.deleteNotification(notificationId)
      
      // Actualizar estado local
      const notificationToDelete = notifications.find(n => n._id === notificationId)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      
      if (notificationToDelete && !notificationToDelete.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      console.log(`✅ Notificación ${notificationId} eliminada`)
    } catch (error) {
      console.error('❌ Error eliminando notificación:', error)
      throw error
    }
  }

  // Eliminar todas las notificaciones leídas
  const clearReadNotifications = async () => {
    try {
      const response = await apiService.clearReadNotifications()
      
      // Actualizar estado local - mantener solo las no leídas
      setNotifications(prev => prev.filter(n => !n.read))
      
      console.log(`✅ ${response.deletedCount} notificaciones leídas eliminadas`)
    } catch (error) {
      console.error('❌ Error eliminando notificaciones leídas:', error)
      throw error
    }
  }

  // Configurar conexión de Socket.io
  useEffect(() => {
    if (!isAuthenticated || !user || !token) {
      // Desconectar socket si no hay usuario autenticado
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      return
    }

    // Configurar URL del socket según el entorno
    const getSocketUrl = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'http://localhost:3001'  // Desarrollo: backend directo
        } else {
          // Producción: usar el mismo host y puerto que el frontend (a través del proxy nginx)
          return `http://${hostname}:8080`  // Socket.io a través de nginx proxy
        }
      }
      return 'http://localhost:3001'  // Por defecto desarrollo
    }

    // Crear conexión de socket
    const newSocket = io(getSocketUrl(), {
      auth: {
        token: token
      }
    })

    setSocket(newSocket)

    // Escuchar nuevas notificaciones en tiempo real
    newSocket.on('new_notification', (data: { notification: Notification; unreadCount: number }) => {
      console.log('🔔 Nueva notificación recibida en tiempo real:', data)
      
      // Agregar la nueva notificación al inicio de la lista
      setNotifications(prev => [data.notification, ...prev])
      
      // Actualizar contador con el valor exacto del servidor
      setUnreadCount(data.unreadCount)
    })

    // Manejar errores de conexión
    newSocket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.io:', error)
    })

    newSocket.on('connect', () => {
      console.log('✅ Conectado a Socket.io para notificaciones en tiempo real')
      // Unirse automáticamente a la sala personal del usuario
      newSocket.emit('join_user', user.id)
    })

    // Cleanup function
    return () => {
      newSocket.disconnect()
    }
  }, [isAuthenticated, user, token])

  // Cargar notificaciones cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshNotifications()
    } else {
      // Limpiar notificaciones cuando no hay usuario
      setNotifications([])
      setUnreadCount(0)
    }
  }, [isAuthenticated, user])

  // Actualizar conteo de no leídas cada cierto tiempo (menos frecuente con Socket.io)
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const interval = setInterval(async () => {
      try {
        const response = await apiService.getUnreadNotificationsCount()
        setUnreadCount(response.unreadCount)
      } catch (error) {
        console.error('❌ Error actualizando conteo de notificaciones:', error)
      }
    }, 120000) // Cada 2 minutos (reducido de 30 segundos)

    return () => clearInterval(interval)
  }, [isAuthenticated, user])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearReadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
