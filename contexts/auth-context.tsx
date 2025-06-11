"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '@/lib/api'
import type { User, AuthResponse } from '@/lib/api'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  university: string
  phoneNumber?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Función para verificar si hay un usuario autenticado al cargar la app
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const profileResponse = await apiService.getProfile()
      setUser(profileResponse.user)
    } catch (error) {
      console.error('Error checking authentication:', error)
      // Si hay error, limpiar el token
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  // Función de login
  const handleLogin = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    console.log('🔧 === INICIO LOGIN ===');
    console.log('🔧 Credenciales:', { email: credentials.email });
    
    try {
      const response = await apiService.login(credentials);
      console.log('🔧 Respuesta completa de login:', response);
      
      if (response && response.token && response.user) {
        console.log('✅ Datos válidos recibidos');
        localStorage.setItem('token', response.token);
        setUser(response.user);
        console.log('✅ Usuario configurado en contexto:', response.user);
        console.log('✅ Token guardado:', response.token.substring(0, 20) + '...');
        return { success: true };
      } else {
        console.error('❌ Respuesta inválida:', response);
        return { 
          success: false, 
          error: 'Respuesta inválida del servidor: ' + JSON.stringify(response)
        };
      }
    } catch (error: any) {
      console.error('❌ Error completo en login:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      let errorMessage = 'Error desconocido al iniciar sesión';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      console.log('🔧 === FIN LOGIN ===');
    }
  }

  // Función de registro
  const handleRegister = async (userData: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    console.log('🔧 === INICIO REGISTRO ===');
    console.log('🔧 Datos de registro:', { ...userData, password: '[OCULTA]' });
    
    try {
      const response = await apiService.register(userData);
      console.log('🔧 Respuesta completa de registro:', response);
      
      if (response && response.token && response.user) {
        console.log('✅ Datos válidos recibidos');
        localStorage.setItem('token', response.token);
        setUser(response.user);
        console.log('✅ Usuario configurado en contexto:', response.user);
        console.log('✅ Token guardado:', response.token.substring(0, 20) + '...');
        return { success: true };
      } else {
        console.error('❌ Respuesta inválida:', response);
        return { 
          success: false, 
          error: 'Respuesta inválida del servidor: ' + JSON.stringify(response)
        };
      }
    } catch (error: any) {
      console.error('❌ Error completo en registro:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      let errorMessage = 'Error desconocido al registrarse';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      console.log('🔧 === FIN REGISTRO ===');
    }
  }

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}