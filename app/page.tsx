import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Users, Shield, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">RENT+ALL</span>
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">v2.0 - Sync Test ✅</span>
            </div>
            <div className="space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Regístrate</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Alquila lo que necesitas,
            <br />
            <span className="text-blue-600">cuando lo necesitas</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            La plataforma que conecta estudiantes universitarios para compartir productos de uso ocasional. Ahorra
            dinero y ayuda al medio ambiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:space-x-4 justify-center items-center">
            <Button size="lg" asChild className="w-full sm:w-auto min-h-[44px]">
              <Link href="/auth">Comenzar Ahora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-h-[44px]">
              <Link href="/auth">Explorar Productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">¿Por qué elegir RENT+ALL?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Comunidad Estudiantil</h3>
                <p className="text-gray-600">
                  Conecta con estudiantes de tu universidad y alquila productos de confianza.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Seguro y Confiable</h3>
                <p className="text-gray-600">Todos los usuarios son verificados con su email universitario.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Flexible</h3>
                <p className="text-gray-600">Alquila por horas o días, según tus necesidades específicas.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-blue-100 mb-8">Únete a miles de estudiantes que ya están ahorrando dinero</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth">Regístrate Gratis</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-lg font-semibold">RENT+ALL</span>
          </div>
          <p className="text-gray-400">© 2024 RENT+ALL. Plataforma de alquiler entre estudiantes universitarios.</p>
        </div>
      </footer>
    </div>
  )
}
