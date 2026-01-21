import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/db';
import { requireAuth } from '@/lib/auth';

// GET - Obtener servicios del negocio
export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    const db = await getDatabase();
    
    const services = await db.all(
      `SELECT id, name, description, duration_minutes, price, is_active, created_at, updated_at
       FROM services 
       WHERE business_id = ? AND is_active = 1
       ORDER BY name ASC`,
      [user.businessId]
    );

    return NextResponse.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});

// POST - Crear nuevo servicio
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const body = await request.json();
    const { name, description, durationMinutes, price } = body;

    // Validaciones
    if (!name || !durationMinutes) {
      return NextResponse.json(
        { error: 'Nombre y duración son requeridos' },
        { status: 400 }
      );
    }

    if (durationMinutes < 15 || durationMinutes > 480) {
      return NextResponse.json(
        { error: 'La duración debe estar entre 15 y 480 minutos' },
        { status: 400 }
      );
    }

    if (price && (price < 0 || price > 99999)) {
      return NextResponse.json(
        { error: 'El precio debe estar entre 0 y 99,999' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Verificar si ya existe un servicio con el mismo nombre
    const existingService = await db.get(
      'SELECT id FROM services WHERE business_id = ? AND name = ? AND is_active = 1',
      [user.businessId, name]
    );

    if (existingService) {
      return NextResponse.json(
        { error: 'Ya existe un servicio con este nombre' },
        { status: 409 }
      );
    }

    // Crear el servicio
    const result = await db.run(
      `INSERT INTO services (business_id, name, description, duration_minutes, price, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [user.businessId, name, description || null, durationMinutes, price || null, true]
    );

    const serviceId = result.lastID as number;

    // Obtener el servicio creado
    const newService = await db.get(
      'SELECT id, name, description, duration_minutes, price, is_active, created_at, updated_at FROM services WHERE id = ?',
      [serviceId]
    );

    return NextResponse.json({
      success: true,
      message: 'Servicio creado exitosamente',
      service: newService
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear servicio:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
});