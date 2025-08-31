'use client'

import { useState, useRef } from 'react'
import { FloatingChatWindow } from './floating-chat-window'

interface ChatSession {
  id: string
  rentalId: string
  productTitle: string
  otherUser: {
    _id: string
    name: string
    avatar?: string
  }
  isMinimized: boolean
}

export function FloatingChatManager() {
  const [openChats, setOpenChats] = useState<ChatSession[]>([])
  const openChatRef = useRef<((chatData: Omit<ChatSession, 'id' | 'isMinimized'>) => void) | null>(null)

  const openChat = (chatData: Omit<ChatSession, 'id' | 'isMinimized'>) => {
    const chatId = `chat-${chatData.rentalId}`
    
    setOpenChats(prev => {
      // Si el chat ya existe, no lo duplicamos
      const existingIndex = prev.findIndex(chat => chat.id === chatId)
      if (existingIndex >= 0) {
        // Si existe, lo traemos al frente y lo des-minimizamos
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], isMinimized: false }
        return updated
      }
      
      // Si no existe, lo agregamos
      return [...prev, {
        id: chatId,
        ...chatData,
        isMinimized: false
      }]
    })
  }

  const closeChat = (chatId: string) => {
    setOpenChats(prev => prev.filter(chat => chat.id !== chatId))
  }

  const toggleMinimize = (chatId: string) => {
    setOpenChats(prev => 
      prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, isMinimized: !chat.isMinimized }
          : chat
      )
    )
  }

  // Configurar la referencia
  openChatRef.current = openChat

  // Exponemos la función openChat globalmente
  if (typeof window !== 'undefined') {
    (window as any).openFloatingChat = openChat
  }

  return (
    <>
      {openChats.map((chat, index) => (
        <FloatingChatWindow
          key={chat.id}
          rentalId={chat.rentalId}
          productTitle={chat.productTitle}
          otherUser={chat.otherUser}
          isOpen={true}
          isMinimized={chat.isMinimized}
          onClose={() => closeChat(chat.id)}
          onToggleMinimize={() => toggleMinimize(chat.id)}
          position={index}
        />
      ))}
    </>
  )
}

// Hook para usar el chat manager desde cualquier componente
export function useFloatingChat() {
  const openChat = (chatData: {
    rentalId: string
    productTitle: string
    otherUser: {
      _id: string
      name: string
      avatar?: string
    }
  }) => {
    if (typeof window !== 'undefined' && (window as any).openFloatingChat) {
      (window as any).openFloatingChat(chatData)
    }
  }

  return { openChat }
}
