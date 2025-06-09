"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('🔐 [AuthPage] Iniciando proceso de login...')

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log('📧 [AuthPage] Email:', email)
    const success = await login(email, password)
    console.log('📊 [AuthPage] Resultado del login:', success)

    if (success) {
      console.log('✅ [AuthPage] Login exitoso, mostrando toast...')
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente.",
      })
      console.log('🚀 [AuthPage] Redirigiendo al dashboard...')
      // Agregar un pequeño delay para permitir que el estado se actualice
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } else {
      console.log('❌ [AuthPage] Login falló, mostrando error...')
      toast({
        title: "Error",
        description: "Email o contraseña incorrectos.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('📝 [AuthPage] Iniciando proceso de registro...')

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const university = formData.get("university") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    console.log('📧 [AuthPage] Datos de registro - Email:', email, 'Name:', name)

    if (password !== confirmPassword) {
      console.log('❌ [AuthPage] Las contraseñas no coinciden')
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const success = await register(name, email, university, password)
    console.log('📊 [AuthPage] Resultado del registro:', success)

    if (success) {
      console.log('✅ [AuthPage] Registro exitoso, mostrando toast...')
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente.",
      })
      console.log('🚀 [AuthPage] Redirigiendo al dashboard...')
      // Agregar un pequeño delay para permitir que el estado se actualice
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } else {
      console.log('❌ [AuthPage] Registro falló, mostrando error...')
      toast({
        title: "Error",
        description: "Error al crear la cuenta. Intenta nuevamente.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">RENT+ALL</span>
          </Link>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Ingresa a tu cuenta para comenzar a alquilar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="tu@universidad.edu" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Iniciando..." : "Iniciar Sesión"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>Únete a la comunidad de estudiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" name="name" type="text" placeholder="Juan Pérez" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Universitario</Label>
                    <Input id="email" name="email" type="email" placeholder="juan@universidad.edu" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university">Universidad</Label>
                    <Input id="university" name="university" type="text" placeholder="Universidad Nacional" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Crear Cuenta"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
