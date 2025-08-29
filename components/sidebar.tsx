"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { useWishlist } from "@/contexts/WishlistContext"
import { Button } from "@/components/ui/button"
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
          const favoritesCount = favoriteProducts?.length || 0

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
                isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className={cn("mr-3 h-5 w-5", isFavorites && favoritesCount > 0 ? "text-red-500" : "")} />
              {item.name}
              {isNotifications && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              {isFavorites && favoritesCount > 0 && (
                <span className="ml-auto bg-red-100 text-red-700 text-xs rounded-full px-2 py-1 font-medium">
                  {favoritesCount}
                </span>
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
