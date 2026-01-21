-- WhatsApp Appointment Bot Database Schema
-- SQLite Database for development, PostgreSQL for production

-- Tabla de negocios registrados
CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    description TEXT,
    whatsapp_number VARCHAR(20),
    google_sheets_id VARCHAR(255),
    google_calendar_id VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de servicios ofrecidos por cada negocio
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Tabla de horarios de atención por negocio
CREATE TABLE IF NOT EXISTS business_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, ..., 6=Sábado
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Tabla de citas agendadas (cache local antes de enviar a Google Sheets)
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, confirmed, cancelled, completed
    notes TEXT,
    google_calendar_event_id VARCHAR(255),
    google_sheets_row_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Tabla de sesiones de WhatsApp activas
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_data TEXT, -- JSON con datos de la sesión de Baileys
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Tabla de estados de conversación por usuario
CREATE TABLE IF NOT EXISTS conversation_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    current_state VARCHAR(50) NOT NULL, -- welcome, selecting_service, selecting_date, etc.
    state_data TEXT, -- JSON con datos del estado actual
    last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    UNIQUE(business_id, client_phone)
);

-- Tabla de configuración de mensajes personalizados
CREATE TABLE IF NOT EXISTS bot_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    message_key VARCHAR(100) NOT NULL, -- welcome, service_list, appointment_confirmed, etc.
    message_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    UNIQUE(business_id, message_key)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_businesses_email ON businesses(email);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_business_hours_business_id ON business_hours(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_business_id ON whatsapp_sessions(business_id);
CREATE INDEX IF NOT EXISTS idx_conversation_states_business_phone ON conversation_states(business_id, client_phone);

-- Datos iniciales de ejemplo
INSERT OR IGNORE INTO businesses (id, name, email, password_hash, phone, description, whatsapp_number) VALUES 
(1, 'Salón Bella Vista', 'admin@salonbellavista.com', '$2a$10$example_hash', '+52123456789', 'Salón de belleza especializado en cortes y tratamientos', '+52123456789');

INSERT OR IGNORE INTO services (business_id, name, description, duration_minutes, price) VALUES 
(1, 'Corte de Cabello', 'Corte de cabello profesional para dama y caballero', 45, 250.00),
(1, 'Tinte Completo', 'Aplicación de tinte en todo el cabello', 120, 450.00),
(1, 'Manicure', 'Manicure completo con esmaltado', 60, 180.00),
(1, 'Pedicure', 'Pedicure completo con esmaltado', 75, 220.00);

INSERT OR IGNORE INTO business_hours (business_id, day_of_week, start_time, end_time) VALUES 
(1, 1, '09:00', '18:00'), -- Lunes
(1, 2, '09:00', '18:00'), -- Martes
(1, 3, '09:00', '18:00'), -- Miércoles
(1, 4, '09:00', '18:00'), -- Jueves
(1, 5, '09:00', '19:00'), -- Viernes
(1, 6, '09:00', '17:00'); -- Sábado

INSERT OR IGNORE INTO bot_messages (business_id, message_key, message_text) VALUES 
(1, 'welcome', '¡Hola! 👋 Bienvenido a *Salón Bella Vista*\n\n¿En qué podemos ayudarte hoy?\n\n1️⃣ Ver servicios disponibles\n2️⃣ Agendar una cita\n3️⃣ Consultar horarios\n\nEscribe el número de la opción que deseas.'),
(1, 'services_list', '*Nuestros Servicios:*\n\n1️⃣ Corte de Cabello - $250 (45 min)\n2️⃣ Tinte Completo - $450 (2 hrs)\n3️⃣ Manicure - $180 (1 hr)\n4️⃣ Pedicure - $220 (1 hr 15 min)\n\nEscribe el número del servicio que te interesa.'),
(1, 'appointment_confirmed', '✅ *¡Cita confirmada!*\n\n📅 Fecha: {date}\n🕐 Hora: {time}\n💇‍♀️ Servicio: {service}\n💰 Precio: ${price}\n\n📍 Te esperamos en nuestro salón.\n\n¿Necesitas ayuda con algo más?');