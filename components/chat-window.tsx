"use client"

import { useState, useEffect, useRef } from 'react'
import { useChat } from '@/contexts/chat-context'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, MessageCircle, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  rentalId: string
  productTitle: string
  otherUser: {
    _id: string
    name: string
    avatar?: string
  }
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ rentalId, productTitle, otherUser, isOpen, onClose }: ChatWindowProps) {
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
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const rentalMessages = messages[rentalId] || []

  // Cargar mensajes y unirse al chat cuando se abre
  useEffect(() => {
    if (isOpen && rentalId) {
      setIsLoading(true)
      getMessages(rentalId)
        .then(() => {
          joinRental(rentalId)
          markAsRead(rentalId)
        })
        .catch(error => {
          console.error('Error cargando chat:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    return () => {
      if (rentalId) {
        leaveRental(rentalId)
      }
    }
  }, [isOpen, rentalId]) // Removemos las funciones de las dependencias

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (rentalMessages.length > 0 && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [rentalMessages.length])

  // Marcar como leído cuando llegan nuevos mensajes
  useEffect(() => {
    if (isOpen && rentalMessages.length > 0) {
      const timer = setTimeout(() => {
        markAsRead(rentalId)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [rentalMessages.length, isOpen, rentalId, markAsRead])

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

  const formatDate = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    } catch {
      return ''
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg h-[600px] flex flex-col">
        {/* Header */}
        <CardHeader className="bg-blue-500 text-white rounded-t-lg flex-shrink-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={otherUser.avatar} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold">{otherUser.name}</CardTitle>
                <div className="text-sm text-blue-100 flex items-center gap-2">
                  <span>{productTitle}</span>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-white text-xs",
                      isConnected ? "bg-green-500" : "bg-gray-500"
                    )}
                  >
                    {isConnected ? "En línea" : "Desconectado"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-blue-600 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: 'calc(600px - 160px)' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : rentalMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <div className="text-sm">No hay mensajes aún</div>
                <div className="text-xs">Inicia la conversación</div>
              </div>
            ) : (
              <>
                {rentalMessages.map((message, index) => {
                  const isOwnMessage = message.sender._id === user?.id
                  const showDate = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(rentalMessages[index - 1]?.timestamp)

                  return (
                    <div key={`${message._id}-${index}`}>
                      {showDate && (
                        <div className="text-center my-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                      )}
                      
                      <div className={cn(
                        "flex items-end space-x-2",
                        isOwnMessage ? "justify-end" : "justify-start"
                      )}>
                        {!isOwnMessage && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback>
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={cn(
                          "max-w-[70%] rounded-lg px-3 py-2 text-sm",
                          isOwnMessage 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 text-gray-900"
                        )}>
                          <div className="break-words">{message.message}</div>
                          <div className={cn(
                            "text-xs mt-1",
                            isOwnMessage ? "text-blue-100" : "text-gray-500"
                          )}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>

                        {isOwnMessage && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-white flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1"
                disabled={isSending || !isConnected}
                maxLength={1000}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newMessage.trim() || isSending || !isConnected}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
