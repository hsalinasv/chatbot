"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  activeServices: number;
  whatsappConnected: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    activeServices: 0,
    whatsappConnected: false
  });
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Mi Negocio',
    email: '',
    phone: '',
    whatsappNumber: ''
  });

  useEffect(() => {
    // Simular carga de datos del dashboard
    setStats({
      totalAppointments: 156,
      todayAppointments: 8,
      activeServices: 4,
      whatsappConnected: false
    });

    setBusinessInfo({
      name: 'Salón Bella Vista',
      email: 'admin@salonbellavista.com',
      phone: '+52 123 456 7890',
      whatsappNumber: '+52 123 456 7890'
    });
  }, []);

  const recentAppointments = [
    {
      id: 1,
      clientName: 'María González',
      service: 'Corte de Cabello',
      date: '2024-01-15',
      time: '10:00',
      status: 'confirmed'
    },
    {
      id: 2,
      clientName: 'Carlos Ruiz',
      service: 'Tinte Completo',
      date: '2024-01-15',
      time: '14:30',
      status: 'scheduled'
    },
    {
      id: 3,
      clientName: 'Ana López',
      service: 'Manicure',
      date: '2024-01-16',
      time: '09:00',
      status: 'scheduled'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Agendada</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{businessInfo.name}</h1>
                <p className="text-sm text-gray-600">Panel de Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Citas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                3 confirmadas, 5 pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeServices}</div>
              <p className="text-xs text-muted-foreground">
                Todos los servicios disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {stats.whatsappConnected ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Conectado</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-red-600">Desconectado</span>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.whatsappConnected ? 'Bot funcionando' : 'Configurar conexión'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Citas Recientes</CardTitle>
                  <CardDescription>
                    Últimas citas agendadas a través del chatbot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.clientName}</p>
                          <p className="text-sm text-gray-600">{appointment.service}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.date} a las {appointment.time}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver todas las citas
                  </Button>
                </CardContent>
              </Card>

              {/* Business Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Negocio</CardTitle>
                  <CardDescription>
                    Datos de contacto y configuración
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{businessInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm text-gray-600">{businessInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">WhatsApp</p>
                      <p className="text-sm text-gray-600">{businessInfo.whatsappNumber}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Información
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>
                  Configuraciones y herramientas más utilizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <MessageCircle className="w-6 h-6" />
                    <span>Conectar WhatsApp</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Calendar className="w-6 h-6" />
                    <span>Configurar Google Calendar</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>Ver Reportes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Citas</CardTitle>
                <CardDescription>
                  Administra todas las citas agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
                  <p className="text-gray-600">
                    La gestión completa de citas estará disponible en la siguiente actualización.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
                <CardDescription>
                  Configura los servicios que ofrece tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
                  <p className="text-gray-600">
                    La configuración de servicios estará disponible en la siguiente actualización.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="whatsapp">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de WhatsApp</CardTitle>
                <CardDescription>
                  Conecta y configura tu chatbot de WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
                  <p className="text-gray-600">
                    La integración con WhatsApp estará disponible en la siguiente actualización.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}