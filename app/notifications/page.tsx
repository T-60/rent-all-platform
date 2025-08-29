"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Sidebar } from "@/components/sidebar"
import { useNotifications } from "@/contexts/notification-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, Clock, Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    refreshNotifications 
  } = useNotifications()

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
      toast.success("Notificación marcada como leída")
    } catch (error) {
      toast.error("No se pudo marcar la notificación como leída")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast.success("Todas las notificaciones marcadas como leídas")
    } catch (error) {
      toast.error("No se pudieron marcar todas las notificaciones como leídas")
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id)
      toast.success("Notificación eliminada exitosamente")
    } catch (error) {
      toast.error("No se pudo eliminar la notificación")
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshNotifications()
      toast.success("Notificaciones actualizadas correctamente")
    } catch (error) {
      toast.error("No se pudieron actualizar las notificaciones")
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return '👋'
      case 'product_created':
        return '📦'
      case 'rental_created':
      case 'rental_request':
        return '📝'
      case 'rental_confirmed':
        return '✅'
      case 'rental_cancelled':
        return '❌'
      case 'product_rented':
        return '🎉'
      case 'system':
        return '📢'
      default:
        return '🔔'
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
              <div className="flex gap-2">
                <Button 
                  onClick={handleRefresh} 
                  variant="outline" 
                  size="sm"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                {unreadCount > 0 && (
                  <Button onClick={handleMarkAllAsRead} variant="outline">
                    <Check className="h-4 w-4 mr-2" />
                    Marcar todas como leídas
                  </Button>
                )}
              </div>
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
                    key={notification._id}
                    className={`transition-all ${notification.read ? "bg-white" : "bg-blue-50 border-blue-200"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                            <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">
                                Nuevo
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{formatTime(notification.createdAt)}</span>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification._id)}>
                                  <Check className="h-4 w-4 mr-1" />
                                  Marcar como leída
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteNotification(notification._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
