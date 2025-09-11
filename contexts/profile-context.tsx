"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './auth-context'
import { useNotifications } from './notification-context'
import { apiService, type Rental } from '@/lib/api'

interface ProfileContextType {
  profileNotificationsCount: number
  pendingRequestsCount: number
  pendingPaymentsCount: number
  unreadChatsCount: number
  refreshProfileCounts: () => Promise<void>
  updateProfileCount: (type: 'requests' | 'payments' | 'chats', count: number) => void
  clearAllProfileNotifications: () => void // Nueva función para limpiar todas
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0)
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0)
  const [unreadChatsCount, setUnreadChatsCount] = useState(0)

  // Calcular el total de notificaciones del perfil
  const profileNotificationsCount = pendingRequestsCount + pendingPaymentsCount + unreadChatsCount

  // Función para limpiar todas las notificaciones del perfil
  const clearAllProfileNotifications = () => {
    setPendingRequestsCount(0)
    setPendingPaymentsCount(0)
    setUnreadChatsCount(0)
    console.log('🧹 Todas las notificaciones del perfil limpiadas')
  }

  // Función para actualizar contadores específicos
  const updateProfileCount = (type: 'requests' | 'payments' | 'chats', count: number) => {
    switch (type) {
      case 'requests':
        setPendingRequestsCount(count)
        break
      case 'payments':
        setPendingPaymentsCount(count)
        break
      case 'chats':
        setUnreadChatsCount(count)
        break
    }
  }

  // Función para refrescar todos los contadores
  const refreshProfileCounts = async () => {
    if (!isAuthenticated || !user) return

    try {
      // Obtener solicitudes pendientes como propietario
      const ownerRentalsResponse = await apiService.getOwnerRentals()
      const pendingRequests = ownerRentalsResponse.rentals.filter((r: any) => r.status === 'pending').length
      setPendingRequestsCount(pendingRequests)

      // Obtener alquileres con pagos pendientes como arrendatario
      const userRentals: Rental[] = await apiService.getUserRentals(user.id)
      const pendingPayments = userRentals.filter(r => 
        r.status === 'confirmed' && r.paymentStatus === 'pending'
      ).length
      setPendingPaymentsCount(pendingPayments)

      // Obtener chats sin leer (notificaciones de mensajes privados)
      const notificationsResponse = await apiService.getNotifications(1, 100)
      const chatNotifications = notificationsResponse.notifications.filter(n => 
        !n.read && n.type === 'private_message'
      )
      
      // Contar conversaciones únicas (no mensajes individuales)
      const uniqueChats = new Set(chatNotifications.map(n => n.metadata?.chatId || n.relatedUser))
      setUnreadChatsCount(uniqueChats.size)

      console.log(`📊 Contadores del perfil actualizados: ${pendingRequests} solicitudes, ${pendingPayments} pagos pendientes, ${uniqueChats.size} chats sin leer`)
    } catch (error) {
      console.error('❌ Error actualizando contadores del perfil:', error)
    }
  }

  // Cargar contadores cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshProfileCounts()
    } else {
      // Limpiar contadores cuando no hay usuario
      setPendingRequestsCount(0)
      setPendingPaymentsCount(0)
      setUnreadChatsCount(0)
    }
  }, [isAuthenticated, user])

  // Actualizar contadores cada cierto tiempo
  useEffect(() => {
    if (!isAuthenticated || !user) return

    const interval = setInterval(refreshProfileCounts, 60000) // Cada minuto
    return () => clearInterval(interval)
  }, [isAuthenticated, user])

  return (
    <ProfileContext.Provider
      value={{
        profileNotificationsCount,
        pendingRequestsCount,
        pendingPaymentsCount,
        unreadChatsCount,
        refreshProfileCounts,
        updateProfileCount,
        clearAllProfileNotifications,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
