'use client'

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@/contexts/chat-context'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Minimize2, X, User, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingChatWindowProps {
  rentalId: string
  productTitle: string
  otherUser: {
    _id: string
    name: string
    avatar?: string
  }
  isOpen: boolean
  isMinimized: boolean
  onClose: () => void
  onToggleMinimize: () => void
  position: number // Para posicionar múltiples chats
}

export function FloatingChatWindow({ 
  rentalId, 
  productTitle, 
  otherUser, 
  isOpen, 
  isMinimized,
  onClose, 
  onToggleMinimize,
  position = 0
}: FloatingChatWindowProps) {
  const { user } = useAuth()
  const { 
    messages, 
    sendMessage, 
    getMessages, 
    markAsRead, 
    joinRental, 
    leaveRental, 
    isConnected 
  } = useChat()
  
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const rentalMessages = messages[rentalId] || []

  // Cargar mensajes cuando se abre el chat
  useEffect(() => {
    if (isOpen && rentalId && !isMinimized) {
      console.log(`🔄 Cargando chat para alquiler: ${rentalId}`)
      setIsLoading(true)
      getMessages(rentalId)
        .then(() => {
          console.log(`✅ Mensajes cargados, uniéndose a sala: ${rentalId}`)
          joinRental(rentalId)
          markAsRead(rentalId)
        })
        .catch(error => {
          console.error('❌ Error cargando chat:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    return () => {
      if (rentalId) {
        console.log(`🚪 Limpieza: Saliendo de sala ${rentalId}`)
        leaveRental(rentalId)
      }
    }
  }, [isOpen, rentalId, isMinimized])

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (rentalMessages.length > 0 && messagesEndRef.current && !isMinimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [rentalMessages.length, isMinimized])

  // Marcar como leído cuando se minimiza o se abren mensajes
  useEffect(() => {
    if (rentalMessages.length > 0 && isOpen && !isMinimized && rentalId) {
      const timer = setTimeout(() => {
        markAsRead(rentalId)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [rentalMessages.length, isOpen, isMinimized, rentalId, markAsRead])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    try {
      await sendMessage(rentalId, newMessage.trim())
      setNewMessage('')
      inputRef.current?.focus()
    } catch (error) {
      console.error('Error enviando mensaje:', error)
    } finally {
      setIsSending(false)
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return ''
    }
  }

  if (!isOpen) return null

  // Calcular posición desde la derecha
  const rightPosition = 20 + (position * 370) // 350px width + 20px gap

  return (
    <div 
      className={cn(
        "fixed bottom-0 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "translate-y-0" : "translate-y-0"
      )}
      style={{ 
        right: `${rightPosition}px`,
        width: '350px'
      }}
    >
      <Card className="shadow-2xl border-t-4 border-blue-500 rounded-t-lg rounded-b-none">
        {/* Header clickeable para minimizar/maximizar */}
        <CardHeader 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 cursor-pointer rounded-t-lg"
          onClick={onToggleMinimize}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Avatar className="w-8 h-8 border-2 border-white/20">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-xs">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold truncate">{otherUser.name}</h3>
                <div className="flex items-center space-x-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-400" : "bg-gray-400"
                  )} />
                  <span className="text-xs text-blue-100 truncate max-w-[120px]">
                    {productTitle}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleMinimize()
                }}
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Contenido del chat (se oculta cuando está minimizado) */}
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col" style={{ height: '400px' }}>
            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-sm text-gray-500">Cargando mensajes...</div>
                </div>
              ) : rentalMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">
                    No hay mensajes aún.<br />
                    ¡Inicia la conversación!
                  </p>
                </div>
              ) : (
                <>
                  {rentalMessages.map((message, index) => {
                    const isOwn = message.sender._id === user?.id
                    const showTime = index === 0 || 
                      (index > 0 && new Date(message.createdAt).getTime() - new Date(rentalMessages[index-1].createdAt).getTime() > 300000) // 5 min

                    return (
                      <div key={`${message._id}-${index}`} className="space-y-1">
                        {showTime && (
                          <div className="text-center">
                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-full">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        )}
                        <div className={cn(
                          "flex",
                          isOwn ? "justify-end" : "justify-start"
                        )}>
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                              isOwn
                                ? "bg-blue-500 text-white rounded-br-md"
                                : "bg-white text-gray-900 border rounded-bl-md shadow-sm"
                            )}
                          >
                            <p className="break-words">{message.message}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input para enviar mensajes */}
            <div className="p-3 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  disabled={isSending || !isConnected}
                  className="flex-1 text-sm"
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isSending || !isConnected}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
              {!isConnected && (
                <p className="text-xs text-red-500 mt-1">
                  Conectando al chat...
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
