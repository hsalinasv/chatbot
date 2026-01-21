import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/db';
import { verifyPassword, validateEmail, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Buscar el negocio por email
    const business = await db.get(
      'SELECT id, name, email, password_hash, is_active FROM businesses WHERE email = ?',
      [email]
    );

    if (!business) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    if (!business.is_active) {
      return NextResponse.json(
        { error: 'Cuenta desactivada. Contacta al soporte.' },
        { status: 403 }
      );
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, business.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token JWT
    const token = generateToken({
      businessId: business.id,
      email: business.email,
      name: business.name
    });

    // Crear respuesta con cookie
    const response = NextResponse.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      business: {
        id: business.id,
        name: business.name,
        email: business.email
      }
    });

    // Establecer cookie con el token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    });

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}