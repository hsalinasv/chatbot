"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Calendar, Users, BarChart3, Smartphone, Clock, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WhatsApp Bot</h1>
                <p className="text-sm text-gray-600">Sistema de Agendamiento</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            🚀 Automatiza tu negocio con WhatsApp
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Chatbot de WhatsApp para
            <span className="text-green-600 block">Agendamiento de Citas</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema completo que permite a tus clientes agendar citas directamente por WhatsApp. 
            Integración automática con Google Sheets y Google Calendar. Perfecto para peluquerías, 
            clínicas, spas y cualquier negocio que necesite gestionar citas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                Comenzar Gratis
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas para automatizar tu negocio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una solución completa que se integra perfectamente con tus herramientas existentes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Chatbot Inteligente</CardTitle>
                <CardDescription>
                  Conversación natural por WhatsApp que guía a tus clientes paso a paso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Respuestas automáticas 24/7
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Mensajes personalizables
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Múltiples idiomas
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Integración Google</CardTitle>
                <CardDescription>
                  Sincronización automática con Google Sheets y Google Calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Registro en Google Sheets
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Eventos en Google Calendar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Sincronización en tiempo real
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Panel de Control</CardTitle>
                <CardDescription>
                  Dashboard completo para gestionar tu negocio y ver estadísticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Gestión de servicios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Configuración de horarios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Reportes y estadísticas
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Multi-Negocio</CardTitle>
                <CardDescription>
                  Gestiona múltiples negocios desde una sola plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Configuración independiente
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Números WhatsApp separados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Facturación centralizada
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Horarios Inteligentes</CardTitle>
                <CardDescription>
                  Sistema inteligente de disponibilidad y gestión de horarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Verificación en tiempo real
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Bloqueo automático de horarios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Configuración flexible
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Análisis y Reportes</CardTitle>
                <CardDescription>
                  Estadísticas detalladas para optimizar tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Métricas de conversión
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Servicios más populares
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Ingresos por período
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Businesses Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perfecto para tu tipo de negocio
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Diseñado específicamente para negocios que dependen del agendamiento de citas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Peluquerías", icon: "💇‍♀️", description: "Cortes, tintes, tratamientos" },
              { name: "Clínicas", icon: "🏥", description: "Consultas médicas, especialistas" },
              { name: "Spas", icon: "🧘‍♀️", description: "Masajes, tratamientos de belleza" },
              { name: "Talleres", icon: "🔧", description: "Mecánica, reparaciones" },
              { name: "Consultorios", icon: "👨‍⚕️", description: "Psicólogos, dentistas" },
              { name: "Estética", icon: "💅", description: "Manicure, pedicure, faciales" },
              { name: "Fitness", icon: "💪", description: "Entrenadores personales" },
              { name: "Veterinarias", icon: "🐕", description: "Consultas veterinarias" }
            ].map((business, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-3">{business.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{business.name}</h3>
                  <p className="text-sm text-gray-600">{business.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para automatizar tu negocio?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a cientos de negocios que ya están usando nuestro sistema para 
            gestionar sus citas de manera automática y eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
                <Zap className="w-5 h-5 mr-2" />
                Comenzar Ahora
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-3">
                Contactar Ventas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">WhatsApp Bot</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistema completo de agendamiento de citas por WhatsApp para negocios modernos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white">Características</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Precios</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integraciones</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/docs" className="hover:text-white">Documentación</Link></li>
                <li><Link href="/help" className="hover:text-white">Centro de Ayuda</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contacto</Link></li>
                <li><Link href="/status" className="hover:text-white">Estado del Sistema</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">Acerca de</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Carreras</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 WhatsApp Appointment Bot. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}