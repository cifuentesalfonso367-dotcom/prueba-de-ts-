import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET(request: Request): Promise<NextResponse<ApiResponse<unknown>>> {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, nombre: true, email: true, rol: true, estado: true },
      orderBy: { nombre: 'asc' },
    });

    return NextResponse.json(
      { success: true, message: 'Usuarios obtenidos', data: users },
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
