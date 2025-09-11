"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { useProfile } from "@/contexts/profile-context"
import { useWishlist } from "@/contexts/WishlistContext"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "@/components/ui/notification-badge"
import { Home, Package, User, Bell, LogOut, ShoppingBag, Heart } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Favoritos", href: "/dashboard/favorites", icon: Heart },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Notificaciones", href: "/notifications", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { unreadCount } = useNotifications()
  const { profileNotificationsCount } = useProfile()
  const { favoriteProducts } = useWishlist()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">RENT+ALL</span>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.university}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const isNotifications = item.href === "/notifications"
          const isFavorites = item.href === "/dashboard/favorites"
          const isProfile = item.href === "/profile"
          const favoritesCount = favoriteProducts?.length || 0

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <div className="flex items-center">
                <item.icon className={cn("mr-3 h-5 w-5", isFavorites && favoritesCount > 0 ? "text-red-500" : "")} />
                {item.name}
              </div>
              
              {/* Notification Badge */}
              {isNotifications && (
                <NotificationBadge count={unreadCount} size="sm" variant="destructive" />
              )}
              
              {/* Favorites Badge */}
              {isFavorites && (
                <NotificationBadge count={favoritesCount} size="sm" variant="outline" />
              )}
              
              {/* Profile Badge - Solo para acciones que requieren atención personal */}
              {isProfile && profileNotificationsCount > 0 && (
                <NotificationBadge count={profileNotificationsCount} size="sm" variant="warning" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Button onClick={logout} variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
