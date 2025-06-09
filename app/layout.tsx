import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductsProvider } from "@/contexts/products-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RENT+ALL - Alquiler entre Estudiantes",
  description: "Plataforma de alquiler de productos entre estudiantes universitarios",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <ProductsProvider>
            {children}
            <Toaster />
          </ProductsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
