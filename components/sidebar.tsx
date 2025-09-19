"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useNotifications } from "@/contexts/notification-context"
import { useProfile } from "@/contexts/profile-context"
import { useWishlist } from "@/contexts/WishlistContext"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "@/components/ui/notification-badge"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Home, Package, User, Bell, LogOut, ShoppingBag, Heart, Menu } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Favoritos", href: "/dashboard/favorites", icon: Heart },
  { name: "Perfil", href: "/profile", icon: User },
  { name: "Notificaciones", href: "/notifications", icon: Bell },
]

interface SidebarProps {
  className?: string
}

function SidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const { logout, user } = useAuth()
  const { unreadCount } = useNotifications()
  const { profileNotificationsCount } = useProfile()
  const { favoriteProducts } = useWishlist()

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
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
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.university}</p>
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
              onClick={onItemClick}
              className={cn(
                "flex items-center justify-between px-3 py-3 text-sm font-medium rounded-md transition-colors group min-h-[44px]",
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
        <Button 
          onClick={() => {
            logout()
            onItemClick?.()
          }} 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900 py-3 min-h-[44px]"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}

export function Sidebar({ className }: SidebarProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("md:hidden fixed top-4 left-4 z-40", className)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <SidebarContent onItemClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className={cn("hidden md:flex w-64 h-full", className)}>
      <SidebarContent />
    </div>
  )
}

// Export del trigger para usar en layouts
export function MobileSidebarTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
        <SidebarContent onItemClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}