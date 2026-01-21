import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/db';
import { hashPassword, validateEmail, validatePassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, whatsappNumber } = body;

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Verificar si el email ya existe
    const existingBusiness = await db.get(
      'SELECT id FROM businesses WHERE email = ?',
      [email]
    );

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Ya existe un negocio registrado con este email' },
        { status: 409 }
      );
    }

    // Hash de la contraseña
    const passwordHash = await hashPassword(password);

    // Crear el negocio
    const result = await db.run(
      `INSERT INTO businesses (name, email, password_hash, phone, whatsapp_number, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [name, email, passwordHash, phone || null, whatsappNumber || null, true]
    );

    const businessId = result.lastID as number;

    // Crear servicios por defecto
    const defaultServices = [
      { name: 'Consulta General', duration: 60, price: 500 },
      { name: 'Servicio Básico', duration: 30, price: 250 },
      { name: 'Servicio Premium', duration: 90, price: 750 }
    ];

    for (const service of defaultServices) {
      await db.run(
        `INSERT INTO services (business_id, name, duration_minutes, price, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [businessId, service.name, service.duration, service.price, true]
      );
    }

    // Crear horarios por defecto (Lunes a Viernes 9:00-18:00)
    const defaultHours = [
      { day: 1, start: '09:00', end: '18:00' }, // Lunes
      { day: 2, start: '09:00', end: '18:00' }, // Martes
      { day: 3, start: '09:00', end: '18:00' }, // Miércoles
      { day: 4, start: '09:00', end: '18:00' }, // Jueves
      { day: 5, start: '09:00', end: '18:00' }, // Viernes
    ];

    for (const hour of defaultHours) {
      await db.run(
        `INSERT INTO business_hours (business_id, day_of_week, start_time, end_time, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [businessId, hour.day, hour.start, hour.end, true]
      );
    }

    // Crear mensajes por defecto del bot
    const defaultMessages = [
      {
        key: 'welcome',
        text: `¡Hola! 👋 Bienvenido a *${name}*\n\n¿En qué podemos ayudarte hoy?\n\n1️⃣ Ver servicios disponibles\n2️⃣ Agendar una cita\n3️⃣ Consultar horarios\n\nEscribe el número de la opción que deseas.`
      },
      {
        key: 'services_list',
        text: '*Nuestros Servicios:*\n\nEscribe el número del servicio que te interesa para ver horarios disponibles.'
      },
      {
        key: 'appointment_confirmed',
        text: '✅ *¡Cita confirmada!*\n\n📅 Fecha: {date}\n🕐 Hora: {time}\n💼 Servicio: {service}\n💰 Precio: ${price}\n\n📍 Te esperamos en nuestro establecimiento.\n\n¿Necesitas ayuda con algo más?'
      }
    ];

    for (const message of defaultMessages) {
      await db.run(
        `INSERT INTO bot_messages (business_id, message_key, message_text, created_at, updated_at)
         VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
        [businessId, message.key, message.text]
      );
    }

    // Generar token JWT
    const token = generateToken({
      businessId,
      email,
      name
    });

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      message: 'Negocio registrado exitosamente',
      business: {
        id: businessId,
        name,
        email,
        phone,
        whatsappNumber
      }
    }, { status: 201 });

    // Establecer cookie con el token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}