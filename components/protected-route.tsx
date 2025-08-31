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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('[ProtectedRoute] Redirecting to /auth')
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Cargando...</div>
    </div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
