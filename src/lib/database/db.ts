import { getTestDatabase } from './test-db';

// Base de datos funcional para testing
let testDb: any = null;

export async function getDatabase() {
  if (testDb) {
    return testDb;
  }

  // Usar base de datos de testing funcional
  testDb = getTestDatabase();
  return testDb;
}

export async function closeDatabase() {
  if (testDb) {
    testDb = null;
  }
}

// Tipos TypeScript para las tablas
export interface Business {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  address?: string;
  description?: string;
  whatsapp_number?: string;
  google_sheets_id?: string;
  google_calendar_id?: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  business_id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessHour {
  id: number;
  business_id: number;
  day_of_week: number; // 0=Domingo, 1=Lunes, ..., 6=Sábado
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: number;
  business_id: number;
  service_id: number;
  client_name: string;
  client_phone: string;
  client_email?: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  google_calendar_event_id?: string;
  google_sheets_row_id?: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationState {
  id: number;
  business_id: number;
  client_phone: string;
  current_state: string;
  state_data?: string; // JSON
  last_interaction: string;
}

export interface BotMessage {
  id: number;
  business_id: number;
  message_key: string;
  message_text: string;
  created_at: string;
  updated_at: string;
}