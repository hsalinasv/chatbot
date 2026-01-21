import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createWhatsAppSession, getSessionStatus } from '@/lib/whatsapp/baileys';

// POST - Conectar WhatsApp
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { businessId } = user;

    // Verificar si ya hay una sesión activa
    const currentStatus = getSessionStatus(businessId);
    if (currentStatus.connected) {
      return NextResponse.json({
        success: true,
        message: 'WhatsApp ya está conectado',
        status: currentStatus
      });
    }

    // Crear nueva sesión
    const sessionCreated = await createWhatsAppSession(businessId);

    if (sessionCreated) {
      return NextResponse.json({
        success: true,
        message: 'Iniciando conexión de WhatsApp. Escanea el código QR que aparece en la consola.',
        status: { connected: false, connecting: true }
      });
    } else {
      return NextResponse.json(
        { error: 'Error al iniciar la conexión de WhatsApp' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al conectar WhatsApp:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

// GET - Obtener estado de conexión
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const { businessId } = user;
    const status = getSessionStatus(businessId);

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Error al obtener estado de WhatsApp:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});