import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/jwt';
import { ApiResponse } from '@/types';

export async function POST(): Promise<NextResponse<ApiResponse<{ accessToken: string; user: { id: string; name: string; role: string } }>>> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No hay token de refresh' },
        { status: 401 }
      );
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Token de refresh inválido o expirado' },
        { status: 401 }
      );
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: 'Token de refresh inválido' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user || user.estado !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Cuenta inactiva o usuario no encontrado' },
        { status: 401 }
      );
    }

    const newPayload = { userId: user.id.toString(), email: user.email, role: user.rol };
    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    cookieStore.set({
      name: 'refreshToken',
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, 
      path: '/',
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Token refrescado exitosamente', 
        data: { accessToken: newAccessToken, user: { id: user.id.toString(), name: user.nombre, role: user.rol } } 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor', error: errorMessage },
      { status: 500 }
    );
  }
}