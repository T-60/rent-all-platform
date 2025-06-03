"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Bell, Check, Clock } from "lucide-react"

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAuth()
  const { toast } = useToast()

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id)
    toast({
      title: "Notificación marcada como leída",
      description: "La notificación ha sido actualizada.",
    })
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    toast({
      title: "Todas las notificaciones marcadas como leídas",
      description: "Se han actualizado todas las notificaciones.",
    })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `Hace ${minutes} minutos`
    } else if (hours < 24) {
      return `Hace ${hours} horas`
    } else {
      return `Hace ${days} días`
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notificaciones</h1>
                <p className="text-gray-600">Mantente al día con las últimas actualizaciones</p>
              </div>
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} variant="outline">
                  Marcar todas como leídas
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{notifications.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{unreadCount}</div>
                  <div className="text-sm text-gray-600">Sin leer</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
                  <div className="text-sm text-gray-600">Leídas</div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes notificaciones</h3>
                    <p className="text-gray-600">Cuando tengas nuevas notificaciones, aparecerán aquí</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-all ${notification.read ? "bg-white" : "bg-blue-50 border-blue-200"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{formatTime(notification.timestamp)}</span>
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                <Check className="h-4 w-4 mr-1" />
                                Marcar como leída
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
