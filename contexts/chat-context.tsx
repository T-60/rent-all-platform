"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './auth-context'

interface Message {
  _id: string
  rental: string
  sender: {
    _id: string
    name: string
    avatar?: string
  }
  receiver: {
    _id: string
    name: string
    avatar?: string
  }
  message: string
  type: 'text' | 'image'
  read: boolean
  timestamp: string
  createdAt: string
}

interface ChatContextType {
  socket: Socket | null
  messages: { [rentalId: string]: Message[] }
  unreadCount: number
  isConnected: boolean
  sendMessage: (rentalId: string, message: string) => Promise<void>
  getMessages: (rentalId: string) => Promise<void>
  markAsRead: (rentalId: string) => Promise<void>
  joinRental: (rentalId: string) => void
  leaveRental: (rentalId: string) => void
  getUnreadCount: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<{ [rentalId: string]: Message[] }>({})
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  // Configuración de la URL del API
  const getApiUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3001'  // ✅ Revertido: backend está en puerto 3001
      } else {
        return `http://${hostname}:3001`  // ✅ Revertido para producción
      }
    }
    return 'http://localhost:3001'  // ✅ Revertido por defecto
  }

  const API_URL = getApiUrl()

  // Inicializar Socket.io cuando el usuario está autenticado
  useEffect(() => {
    if (user && token) {
      console.log(`🔌 Iniciando conexión de socket para usuario: ${user.name} (${user.id})`);
      console.log(`🔌 URL del socket: ${API_URL}`);
      console.log(`🔑 Token presente: ${!!token}`);
      console.log(`🔑 Token (primeros 20 caracteres): ${token.substring(0, 20)}...`);
      
      // Verificar que también esté en localStorage
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      console.log(`🔑 Token en localStorage: ${!!storedToken}`);
      
      // Usar el token del contexto o del localStorage como fallback
      const tokenToUse = token || storedToken;
      
      if (!tokenToUse) {
        console.error('❌ No hay token disponible para el socket');
        return;
      }
      
      const newSocket = io(API_URL, {
        auth: {
          token: tokenToUse
        },
        transports: ['polling', 'websocket'],
        forceNew: true
      })

      newSocket.on('connect', () => {
        console.log(`💬 Conectado al chat: ${newSocket.id} para usuario ${user.name}`)
        setIsConnected(true)
        
        // Confirmar que el usuario está en su sala
        newSocket.emit('join_user', user.id);
      })

      newSocket.on('user_connected', (data) => {
        console.log('✅ Confirmación de conexión:', data);
      })

      newSocket.on('joined_user_room', (data) => {
        console.log('✅ Unido a sala de usuario:', data);
      })

      newSocket.on('joined_rental_room', (data) => {
        console.log('✅ Unido a sala de alquiler:', data);
      })

      newSocket.on('connect_error', (error: any) => {
        console.error('❌ Error de conexión del chat socket:', error);
        setIsConnected(false)
      })

      newSocket.on('error', (error: any) => {
        console.error('❌ Error del chat socket:', error?.message || error || 'Error desconocido');
      })

      newSocket.on('disconnect', (reason: string) => {
        console.log('💬 Desconectado del chat. Razón:', reason)
        setIsConnected(false)
      })

      newSocket.on('new_message', (data: { message: Message; rentalId: string }) => {
        console.log('📩 Nuevo mensaje recibido:', data)
        setMessages(prev => {
          const existingMessages = prev[data.rentalId] || []
          
          // Verificar si el mensaje ya existe (evitar duplicados)
          const messageExists = existingMessages.some(msg => msg._id === data.message._id)
          
          if (messageExists) {
            console.log('⚠️ Mensaje duplicado ignorado:', data.message._id)
            return prev
          }
          
          return {
            ...prev,
            [data.rentalId]: [...existingMessages, data.message]
          }
        })
        
        // Actualizar contador de no leídos si el mensaje no es del usuario actual
        if (user && data.message.sender._id !== user.id) {
          setUnreadCount(prev => prev + 1)
        }
      })

      setSocket(newSocket)

      return () => {
        console.log(`🔌 Cerrando conexión de socket para usuario: ${user?.name}`)
        newSocket.close()
      }
    } else {
      // Si no hay usuario, limpiar socket
      if (socket) {
        socket.close()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [user, token, API_URL])

  // Obtener contador de mensajes no leídos al conectar
  useEffect(() => {
    if (user && token) {
      getUnreadCount()
    }
  }, [user, token])

  const sendMessage = async (rentalId: string, message: string): Promise<void> => {
    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    try {
      const response = await fetch(`${API_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rentalId,
          message,
          type: 'text'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar mensaje')
      }

      // No agregamos el mensaje aquí - llegará via socket para todos los usuarios
      // Esto evita duplicados

    } catch (error) {
      console.error('Error enviando mensaje:', error)
      throw error
    }
  }

  const getMessages = async (rentalId: string): Promise<void> => {
    if (!token) {
      throw new Error('No hay token de autenticación')
    }

    try {
      const url = `${API_URL}/api/chat/rental/${rentalId}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener mensajes')
      }

      setMessages(prev => ({
        ...prev,
        [rentalId]: data.messages
      }))

    } catch (error) {
      console.error('Error obteniendo mensajes:', error)
      throw error
    }
  }

  const markAsRead = async (rentalId: string): Promise<void> => {
    if (!token) return

    try {
      await fetch(`${API_URL}/api/chat/mark-read/${rentalId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Actualizar contador local
      getUnreadCount()

    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error)
    }
  }

  const getUnreadCount = async (): Promise<void> => {
    if (!token) return

    try {
      const response = await fetch(`${API_URL}/api/chat/unread-count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setUnreadCount(data.unreadCount)
      }

    } catch (error) {
      console.error('Error obteniendo contador de no leídos:', error)
    }
  }

  const joinRental = (rentalId: string): void => {
    if (socket && isConnected) {
      console.log(`🏠 Uniéndose a sala de alquiler: ${rentalId}`)
      socket.emit('join_rental', rentalId)
    } else {
      console.warn(`⚠️ Intento de unirse a sala ${rentalId} sin conexión de socket`)
    }
  }

  const leaveRental = (rentalId: string): void => {
    if (socket && isConnected) {
      console.log(`🚪 Saliendo de sala de alquiler: ${rentalId}`)
      socket.emit('leave_rental', rentalId)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        socket,
        messages,
        unreadCount,
        isConnected,
        sendMessage,
        getMessages,
        markAsRead,
        joinRental,
        leaveRental,
        getUnreadCount
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
