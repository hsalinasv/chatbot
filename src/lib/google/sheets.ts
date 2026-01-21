import { google } from 'googleapis';
import { getDatabase } from '@/lib/database/db';

// Configuración de Google Sheets
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getGoogleSheetsClient(businessId: number) {
  try {
    // En producción, estas credenciales vendrían de variables de entorno
    // o de la configuración del negocio en la base de datos
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

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;

  } catch (error) {
    console.error('Error al configurar cliente de Google Sheets:', error);
    throw error;
  }
}

export async function createAppointmentInSheets(
  businessId: number,
  appointmentData: {
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    serviceName: string;
    appointmentDate: string;
    appointmentTime: string;
    price?: number;
    notes?: string;
  }
): Promise<number | null> {
  try {
    const db = await getDatabase();
    
    // Obtener configuración de Google Sheets del negocio
    const business = await db.get(
      'SELECT google_sheets_id FROM businesses WHERE id = ?',
      [businessId]
    );

    if (!business?.google_sheets_id) {
      console.log('No hay Google Sheets configurado para este negocio');
      return null;
    }

    const sheets = await getGoogleSheetsClient(businessId);
    const spreadsheetId = business.google_sheets_id;

    // Preparar datos para insertar
    const values = [
      [
        new Date().toISOString(), // Fecha de creación
        appointmentData.clientName,
        appointmentData.clientPhone,
        appointmentData.clientEmail || '',
        appointmentData.serviceName,
        appointmentData.appointmentDate,
        appointmentData.appointmentTime,
        appointmentData.price || '',
        appointmentData.notes || '',
        'Agendada' // Estado
      ]
    ];

    // Insertar en la hoja de cálculo
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Citas!A:J', // Asume que hay una hoja llamada "Citas"
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values
      }
    });

    // Obtener el número de fila insertada
    const updatedRange = response.data.updates?.updatedRange;
    if (updatedRange) {
      const rowMatch = updatedRange.match(/(\d+)$/);
      if (rowMatch) {
        return parseInt(rowMatch[1]);
      }
    }

    return null;

  } catch (error) {
    console.error('Error al crear cita en Google Sheets:', error);
    throw error;
  }
}

export async function updateAppointmentInSheets(
  businessId: number,
  rowId: number,
  status: string
): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    const business = await db.get(
      'SELECT google_sheets_id FROM businesses WHERE id = ?',
      [businessId]
    );

    if (!business?.google_sheets_id) {
      return false;
    }

    const sheets = await getGoogleSheetsClient(businessId);
    const spreadsheetId = business.google_sheets_id;

    // Actualizar el estado en la columna J (índice 10)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Citas!J${rowId}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]]
      }
    });

    return true;

  } catch (error) {
    console.error('Error al actualizar cita en Google Sheets:', error);
    return false;
  }
}

export async function createSheetsTemplate(businessId: number, spreadsheetId: string): Promise<boolean> {
  try {
    const sheets = await getGoogleSheetsClient(businessId);

    // Crear encabezados para la hoja de citas
    const headers = [
      'Fecha Creación',
      'Cliente',
      'Teléfono',
      'Email',
      'Servicio',
      'Fecha Cita',
      'Hora',
      'Precio',
      'Notas',
      'Estado'
    ];

    // Insertar encabezados
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Citas!A1:J1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers]
      }
    });

    // Formatear encabezados (negrita)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 10
              },
              cell: {
                userEnteredFormat: {
                  textFormat: {
                    bold: true
                  },
                  backgroundColor: {
                    red: 0.9,
                    green: 0.9,
                    blue: 0.9
                  }
                }
              },
              fields: 'userEnteredFormat(textFormat,backgroundColor)'
            }
          }
        ]
      }
    });

    return true;

  } catch (error) {
    console.error('Error al crear plantilla de Google Sheets:', error);
    return false;
  }
}