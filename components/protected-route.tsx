"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  console.log('🛡️ [ProtectedRoute] isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)
  console.log('👤 [ProtectedRoute] user:', user)

  useEffect(() => {
    console.log('🔄 [ProtectedRoute] useEffect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading)
    if (!isLoading && !isAuthenticated) {
      console.log('❌ [ProtectedRoute] Usuario no autenticado, redirigiendo a /auth')
      router.push("/auth")
    } else if (!isLoading && isAuthenticated) {
      console.log('✅ [ProtectedRoute] Usuario autenticado, permitiendo acceso')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    console.log('⏳ [ProtectedRoute] Cargando autenticación...')
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Cargando...</div>
    </div>
  }

  if (!isAuthenticated) {
    console.log('⏳ [ProtectedRoute] Renderizando null porque no está autenticado')
    return null
  }

  console.log('✅ [ProtectedRoute] Renderizando children')
  return <>{children}</>
}
