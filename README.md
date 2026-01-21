# WhatsApp Appointment Bot 🤖📅

Sistema completo de chatbot para WhatsApp que permite agendar citas con integración automática a Google Sheets y Google Calendar. Ideal para peluquerías, clínicas, spas y cualquier negocio que necesite gestionar citas de manera automatizada.

## 🚀 Características Principales

### 💬 Chatbot Inteligente
- **Conversación Natural**: Flujo conversacional intuitivo por WhatsApp
- **Respuestas Automáticas 24/7**: Atiende a tus clientes en cualquier momento
- **Mensajes Personalizables**: Adapta los mensajes a tu marca y estilo
- **Estados de Conversación**: Manejo inteligente del contexto de cada cliente

### 📊 Integraciones Automáticas
- **Google Sheets**: Registro automático de todas las citas
- **Google Calendar**: Creación automática de eventos con recordatorios
- **Verificación de Disponibilidad**: Consulta en tiempo real de horarios libres
- **Sincronización Bidireccional**: Cambios reflejados en todas las plataformas

### 🎛️ Panel de Control Completo
- **Dashboard Intuitivo**: Visualiza estadísticas y métricas importantes
- **Gestión de Servicios**: Configura servicios, precios y duraciones
- **Horarios Flexibles**: Define horarios de atención por día de la semana
- **Historial de Citas**: Acceso completo al historial de agendamientos

### 🏢 Multi-Negocio
- **Arquitectura Multi-Tenant**: Un sistema para múltiples negocios
- **Configuración Independiente**: Cada negocio con su propia configuración
- **Números WhatsApp Separados**: Cada negocio puede usar su propio número
- **Facturación Centralizada**: Gestión simplificada para proveedores de servicio

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js + TypeScript**: Base sólida y tipado estático
- **Next.js 15**: Framework full-stack con App Router
- **Baileys**: Biblioteca para integración con WhatsApp Web
- **SQLite/PostgreSQL**: Base de datos flexible según el entorno
- **Google APIs**: Integración nativa con Google Workspace

### Frontend
- **React 19**: Interfaz de usuario moderna y reactiva
- **Tailwind CSS**: Diseño responsive y personalizable
- **shadcn/ui**: Componentes UI profesionales y accesibles
- **Recharts**: Visualización de datos y estadísticas

### Seguridad y Autenticación
- **JWT**: Autenticación segura con tokens
- **bcryptjs**: Hash seguro de contraseñas
- **Helmet**: Protección de headers HTTP
- **CORS**: Control de acceso entre dominios

## 📋 Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta de Google Cloud Platform (para APIs)
- Número de WhatsApp Business (recomendado)

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# JWT
JWT_SECRET="tu-clave-secreta-muy-segura-aqui"

# Google APIs (obtener de Google Cloud Console)
GOOGLE_PROJECT_ID="tu-proyecto-id"
GOOGLE_PRIVATE_KEY_ID="tu-private-key-id"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL="tu-service-account@tu-proyecto.iam.gserviceaccount.com"
GOOGLE_CLIENT_ID="tu-client-id"
GOOGLE_CLIENT_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/tu-service-account%40tu-proyecto.iam.gserviceaccount.com"

# Configuración de entorno
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Ejecutar en Desarrollo
```bash
pnpm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Configuración de WhatsApp

### 1. Registro de Negocio
1. Accede a la aplicación y regístrate como nuevo negocio
2. Completa la información de tu empresa
3. Accede al dashboard

### 2. Conectar WhatsApp
1. En el dashboard, ve a la sección "WhatsApp"
2. Haz clic en "Conectar WhatsApp"
3. Escanea el código QR con WhatsApp Web
4. ¡Tu bot estará listo para recibir mensajes!

## 💬 Flujo del Chatbot

### 1. Saludo Inicial
```
¡Hola! 👋 Bienvenido a *Tu Negocio*

¿En qué podemos ayudarte hoy?

1️⃣ Ver servicios disponibles
2️⃣ Agendar una cita
3️⃣ Consultar horarios

Escribe el número de la opción que deseas.
```

### 2. Selección de Servicio
```
*Nuestros Servicios:*

1️⃣ Corte de Cabello - $250 (45 min)
2️⃣ Tinte Completo - $450 (2 hrs)
3️⃣ Manicure - $180 (1 hr)

Escribe el número del servicio que te interesa.
```

### 3. Confirmación
```
✅ *¡Cita confirmada!*

📅 Fecha: 15 de Enero, 2024
🕐 Hora: 10:00 AM
💇‍♀️ Servicio: Corte de Cabello
💰 Precio: $250

📍 Te esperamos en nuestro establecimiento.

¿Necesitas ayuda con algo más?
```

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp      │    │   Next.js App   │    │   Google APIs   │
│   (Baileys)     │◄──►│   (Backend)     │◄──►│   (Sheets/Cal)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │   (Local Data)  │
                       └─────────────────┘
```

## 💰 Modelo de Negocio

### Planes de Suscripción

#### Plan Básico - $29/mes
- 1 negocio
- 500 citas/mes
- Integración Google Sheets
- Soporte por email

#### Plan Profesional - $59/mes
- 3 negocios
- 2,000 citas/mes
- Google Sheets + Calendar
- Mensajes personalizados
- Soporte prioritario

#### Plan Empresarial - $99/mes
- Negocios ilimitados
- Citas ilimitadas
- Todas las integraciones
- API personalizada
- Soporte telefónico

### Mercado Objetivo
- **Peluquerías y Salones de Belleza**
- **Clínicas Médicas y Dentales**
- **Spas y Centros de Bienestar**
- **Talleres Mecánicos**
- **Consultorios Profesionales**
- **Centros de Estética**
- **Veterinarias**
- **Cualquier negocio con citas**

## 🚀 Deployment

### Build para Producción
```bash
pnpm run build
pnpm start
```

### Deploy en Vercel
```bash
npm i -g vercel
vercel --prod
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**¿Listo para automatizar tu negocio?** 🚀
