import { 
  makeWASocket, 
  DisconnectReason, 
  useMultiFileAuthState,
  WAMessage,
  proto
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import fs from 'fs';
import { getDatabase } from '@/lib/database/db';

interface WhatsAppSession {
  businessId: number;
  socket: any;
  isConnected: boolean;
  phoneNumber?: string;
}

const activeSessions = new Map<number, WhatsAppSession>();

export async function createWhatsAppSession(businessId: number): Promise<boolean> {
  try {
    // Crear directorio de sesiones si no existe
    const sessionsDir = path.join(process.cwd(), 'config', 'whatsapp-sessions');
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }

    const sessionDir = path.join(sessionsDir, `business_${businessId}`);
    
    // Configurar autenticación multi-archivo
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

    // Crear socket de WhatsApp
    const socket = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      logger: {
        level: 'silent',
        child: () => ({ level: 'silent' } as any),
        trace: () => {},
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {}
      } as any
    });

    // Manejar eventos de conexión
    socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(`QR Code para negocio ${businessId}:`, qr);
        // Aquí podrías enviar el QR a través de WebSocket al frontend
      }

      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        console.log('Conexión cerrada debido a:', lastDisconnect?.error);
        
        if (shouldReconnect) {
          console.log('Reconectando...');
          setTimeout(() => createWhatsAppSession(businessId), 3000);
        } else {
          console.log('Sesión cerrada permanentemente');
          activeSessions.delete(businessId);
        }
      } else if (connection === 'open') {
        console.log(`WhatsApp conectado para negocio ${businessId}`);
        
        const session = activeSessions.get(businessId);
        if (session) {
          session.isConnected = true;
          session.phoneNumber = socket.user?.id?.split(':')[0];
        }

        // Actualizar estado en base de datos
        const db = await getDatabase();
        await db.run(
          `INSERT OR REPLACE INTO whatsapp_sessions 
           (business_id, session_id, phone_number, is_active, last_activity, session_data)
           VALUES (?, ?, ?, ?, datetime('now'), ?)`,
          [
            businessId,
            `session_${businessId}_${Date.now()}`,
            socket.user?.id?.split(':')[0] || '',
            true,
            JSON.stringify({ connected: true })
          ]
        );
      }
    });

    // Manejar credenciales
    socket.ev.on('creds.update', saveCreds);

    // Manejar mensajes entrantes
    socket.ev.on('messages.upsert', async (messageUpdate) => {
      const messages = messageUpdate.messages;
      
      for (const message of messages) {
        if (!message.key.fromMe && message.message) {
          await handleIncomingMessage(businessId, socket, message);
        }
      }
    });

    // Guardar sesión activa
    activeSessions.set(businessId, {
      businessId,
      socket,
      isConnected: false
    });

    return true;

  } catch (error) {
    console.error(`Error al crear sesión de WhatsApp para negocio ${businessId}:`, error);
    return false;
  }
}

export async function sendMessage(businessId: number, phoneNumber: string, message: string): Promise<boolean> {
  try {
    const session = activeSessions.get(businessId);
    
    if (!session || !session.isConnected) {
      console.error(`No hay sesión activa para el negocio ${businessId}`);
      return false;
    }

    // Formatear número de teléfono
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const jid = `${formattedNumber}@s.whatsapp.net`;

    await session.socket.sendMessage(jid, { text: message });
    
    console.log(`Mensaje enviado a ${phoneNumber} desde negocio ${businessId}`);
    return true;

  } catch (error) {
    console.error(`Error al enviar mensaje desde negocio ${businessId}:`, error);
    return false;
  }
}

export function getSessionStatus(businessId: number): { connected: boolean; phoneNumber?: string } {
  const session = activeSessions.get(businessId);
  
  return {
    connected: session?.isConnected || false,
    phoneNumber: session?.phoneNumber
  };
}

export async function disconnectSession(businessId: number): Promise<boolean> {
  try {
    const session = activeSessions.get(businessId);
    
    if (session) {
      await session.socket.logout();
      activeSessions.delete(businessId);
      
      // Actualizar estado en base de datos
      const db = await getDatabase();
      await db.run(
        'UPDATE whatsapp_sessions SET is_active = 0 WHERE business_id = ?',
        [businessId]
      );
      
      console.log(`Sesión desconectada para negocio ${businessId}`);
      return true;
    }
    
    return false;

  } catch (error) {
    console.error(`Error al desconectar sesión del negocio ${businessId}:`, error);
    return false;
  }
}

async function handleIncomingMessage(businessId: number, socket: any, message: WAMessage) {
  try {
    const phoneNumber = message.key.remoteJid?.split('@')[0];
    const messageText = message.message?.conversation || 
                       message.message?.extendedTextMessage?.text || '';

    if (!phoneNumber || !messageText) {
      return;
    }

    console.log(`Mensaje recibido de ${phoneNumber} para negocio ${businessId}: ${messageText}`);

    // Aquí implementarías la lógica del chatbot
    const response = await processMessage(businessId, phoneNumber, messageText);
    
    if (response) {
      await sendMessage(businessId, phoneNumber, response);
    }

  } catch (error) {
    console.error('Error al procesar mensaje entrante:', error);
  }
}

async function processMessage(businessId: number, phoneNumber: string, message: string): Promise<string | null> {
  try {
    const db = await getDatabase();
    
    // Obtener o crear estado de conversación
    let conversationState = await db.get(
      'SELECT * FROM conversation_states WHERE business_id = ? AND client_phone = ?',
      [businessId, phoneNumber]
    );

    if (!conversationState) {
      // Crear nuevo estado de conversación
      await db.run(
        `INSERT INTO conversation_states (business_id, client_phone, current_state, state_data, last_interaction)
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [businessId, phoneNumber, 'welcome', JSON.stringify({})]
      );
      
      // Obtener mensaje de bienvenida
      const welcomeMessage = await db.get(
        'SELECT message_text FROM bot_messages WHERE business_id = ? AND message_key = ?',
        [businessId, 'welcome']
      );
      
      return welcomeMessage?.message_text || '¡Hola! Bienvenido a nuestro servicio de agendamiento.';
    }

    // Procesar mensaje según el estado actual
    switch (conversationState.current_state) {
      case 'welcome':
        if (message === '1' || message.toLowerCase().includes('servicio')) {
          // Mostrar lista de servicios
          const services = await db.all(
            'SELECT name, price, duration_minutes FROM services WHERE business_id = ? AND is_active = 1',
            [businessId]
          );
          
          let servicesList = '*Nuestros Servicios:*\n\n';
          services.forEach((service: any, index: number) => {
            servicesList += `${index + 1}️⃣ ${service.name}`;
            if (service.price) servicesList += ` - $${service.price}`;
            servicesList += ` (${service.duration_minutes} min)\n`;
          });
          servicesList += '\nEscribe el número del servicio que te interesa.';
          
          // Actualizar estado
          await db.run(
            'UPDATE conversation_states SET current_state = ?, state_data = ?, last_interaction = datetime(\'now\') WHERE business_id = ? AND client_phone = ?',
            ['selecting_service', JSON.stringify({ services }), businessId, phoneNumber]
          );
          
          return servicesList;
        }
        break;
        
      case 'selecting_service':
        // Lógica para selección de servicio
        const serviceIndex = parseInt(message) - 1;
        const stateData = JSON.parse(conversationState.state_data || '{}');
        
        if (serviceIndex >= 0 && stateData.services && serviceIndex < stateData.services.length) {
          const selectedService = stateData.services[serviceIndex];
          
          // Actualizar estado con servicio seleccionado
          await db.run(
            'UPDATE conversation_states SET current_state = ?, state_data = ?, last_interaction = datetime(\'now\') WHERE business_id = ? AND client_phone = ?',
            ['collecting_info', JSON.stringify({ selectedService }), businessId, phoneNumber]
          );
          
          return `Perfecto! Has seleccionado: *${selectedService.name}*\n\nPara agendar tu cita, necesito algunos datos:\n\n1️⃣ Tu nombre completo\n\nPor favor escribe tu nombre:`;
        } else {
          return 'Por favor selecciona un número válido de la lista de servicios.';
        }
        break;
        
      default:
        return 'Lo siento, no entiendo tu mensaje. Escribe "menu" para ver las opciones disponibles.';
    }

    return null;

  } catch (error) {
    console.error('Error al procesar mensaje:', error);
    return 'Lo siento, ocurrió un error. Por favor intenta nuevamente.';
  }
}