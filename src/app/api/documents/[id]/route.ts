import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { Document } from '@prisma/client';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<ApiResponse<Document>>> {
  try {
    const { id } = await params;
    const { estado } = await request.json();
    const role = request.headers.get('x-user-role');

    if (role !== 'ADMIN') return NextResponse.json({ success: false, message: 'No eres Admin' }, { status: 403 });

    const updated = await prisma.document.update({
      where: { id: parseInt(id, 10) },
      data: { estado },
    });

    return NextResponse.json({ success: true, message: 'Actualizado', data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Error', error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<ApiResponse<Document>>> {
  try {
    const { id } = await params;
    const userId = parseInt(request.headers.get('x-user-id') || '0', 10);
    const role = request.headers.get('x-user-role');

    const doc = await prisma.document.findUnique({ where: { id: parseInt(id, 10) } });
    if (!doc) return NextResponse.json({ success: false, message: 'No existe' }, { status: 404 });

    if (doc.usuarioId !== userId && role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'No permitido' }, { status: 403 });
    }

    const deleted = await prisma.document.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true, message: 'Borrado', data: deleted });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Error', error: err.message }, { status: 500 });
  }
}
