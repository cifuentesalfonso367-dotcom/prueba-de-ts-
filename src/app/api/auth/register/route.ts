import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const { email, password, nombre, rol } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El correo ya está registrado' },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nombre: nombre || email.split('@')[0],
        rol: rol || 'USER',
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'REGISTER_USER',
        entity: 'User',
        entityId: newUser.id,
        userId: newUser.id, 
        details: { email: newUser.email },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Usuario registrado exitosamente' },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor', error: errorMessage },
      { status: 500 }
    );
  }
}
