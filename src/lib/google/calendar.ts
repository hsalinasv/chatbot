import { google } from 'googleapis';
import { getDatabase } from '@/lib/database/db';

// Configuración de Google Calendar
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export async function getGoogleCalendarClient(businessId: number) {
  try {
    // En producción, estas credenciales vendrían de variables de entorno
    const credentials = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });
    return calendar;

  } catch (error) {
    console.error('Error al configurar cliente de Google Calendar:', error);
    throw error;
  }
}

export async function createAppointmentInCalendar(
  businessId: number,
  appointmentData: {
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    durationMinutes: number;
    notes?: string;
  }
): Promise<string | null> {
  try {
    const db = await getDatabase();
    
    // Obtener configuración de Google Calendar del negocio
    const business = await db.get(
      'SELECT google_calendar_id, timezone FROM businesses WHERE id = ?',
      [businessId]
    );

    if (!business?.google_calendar_id) {
      console.log('No hay Google Calendar configurado para este negocio');
      return null;
    }

    const calendar = await getGoogleCalendarClient(businessId);
    const calendarId = business.google_calendar_id;

    // Crear fecha y hora de inicio
    const startDateTime = new Date(`${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`);
    
    // Crear fecha y hora de fin
    const endDateTime = new Date(startDateTime.getTime() + (appointmentData.durationMinutes * 60000));

    // Configurar evento
    const event = {
      summary: `${appointmentData.serviceName} - ${appointmentData.clientName}`,
      description: `
Cliente: ${appointmentData.clientName}
Teléfono: ${appointmentData.clientPhone}
${appointmentData.clientEmail ? `Email: ${appointmentData.clientEmail}` : ''}
Servicio: ${appointmentData.serviceName}
${appointmentData.notes ? `Notas: ${appointmentData.notes}` : ''}

Cita agendada a través del chatbot de WhatsApp.
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: business.timezone || 'America/Mexico_City',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: business.timezone || 'America/Mexico_City',
      },
      attendees: appointmentData.clientEmail ? [
        {
          email: appointmentData.clientEmail,
          displayName: appointmentData.clientName
        }
      ] : [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 día antes
          { method: 'popup', minutes: 60 }, // 1 hora antes
        ],
      },
    };

    // Crear evento en Google Calendar
    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return response.data.id || null;

  } catch (error) {
    console.error('Error al crear evento en Google Calendar:', error);
    throw error;
  }
}

export async function updateAppointmentInCalendar(
  businessId: number,
  eventId: string,
  status: 'confirmed' | 'cancelled'
): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    const business = await db.get(
      'SELECT google_calendar_id FROM businesses WHERE id = ?',
      [businessId]
    );

    if (!business?.google_calendar_id) {
      return false;
    }

    const calendar = await getGoogleCalendarClient(businessId);
    const calendarId = business.google_calendar_id;

    if (status === 'cancelled') {
      // Cancelar evento
      await calendar.events.delete({
        calendarId,
        eventId,
      });
    } else if (status === 'confirmed') {
      // Actualizar evento como confirmado
      const event = await calendar.events.get({
        calendarId,
        eventId,
      });

      if (event.data) {
        await calendar.events.update({
          calendarId,
          eventId,
          requestBody: {
            ...event.data,
            summary: `✅ ${event.data.summary}`,
            description: `${event.data.description}\n\n✅ CONFIRMADA`,
          },
        });
      }
    }

    return true;

  } catch (error) {
    console.error('Error al actualizar evento en Google Calendar:', error);
    return false;
  }
}

export async function checkAvailability(
  businessId: number,
  date: string,
  time: string,
  durationMinutes: number
): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    const business = await db.get(
      'SELECT google_calendar_id, timezone FROM businesses WHERE id = ?',
      [businessId]
    );

    if (!business?.google_calendar_id) {
      // Si no hay calendar configurado, verificar solo en base de datos local
      const existingAppointment = await db.get(
        'SELECT id FROM appointments WHERE business_id = ? AND appointment_date = ? AND appointment_time = ? AND status != ?',
        [businessId, date, time, 'cancelled']
      );
      
      return !existingAppointment;
    }

    const calendar = await getGoogleCalendarClient(businessId);
    const calendarId = business.google_calendar_id;

    // Crear rango de tiempo para verificar
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + (durationMinutes * 60000));

    // Buscar eventos en el rango de tiempo
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDateTime.toISOString(),
      timeMax: endDateTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    // Si hay eventos en ese horario, no está disponible
    return !response.data.items || response.data.items.length === 0;

  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    // En caso de error, asumir que no está disponible por seguridad
    return false;
  }
}