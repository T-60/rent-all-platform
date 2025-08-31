import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductsProvider } from "@/contexts/products-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { ChatProvider } from "@/contexts/chat-context"
import { FloatingChatManager } from "@/components/floating-chat-manager"
import { Toaster } from "sonner"
import { NoSSR } from "@/components/no-ssr"

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
          <NoSSR>
            <WishlistProvider>
              <ProductsProvider>
                <NotificationProvider>
                  <ChatProvider>
                    {children}
                    <NoSSR>
                      <FloatingChatManager />
                    </NoSSR>
                    <Toaster 
                      position="top-center"
                      expand={false}
                      richColors
                      closeButton
                    />
                  </ChatProvider>
                </NotificationProvider>
              </ProductsProvider>
            </WishlistProvider>
          </NoSSR>
        </AuthProvider>
      </body>
    </html>
  )
}
