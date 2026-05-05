import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { User } from '@prisma/client';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const { id } = await params;
    const { estado } = await request.json();
    const adminId = parseInt(request.headers.get('x-user-id') || '0', 10);
    const role = request.headers.get('x-user-role');

    if (role !== 'ADMIN') return NextResponse.json({ success: false, message: 'No eres Admin' }, { status: 403 });

    const updated = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { estado }
    });

    await prisma.auditLog.create({
      data: {
        action: estado === 'ACTIVE' ? 'UNBLOCK' : 'BLOCK',
        entity: 'User',
        entityId: updated.id,
        userId: adminId,
        details: { email: updated.email }
      }
    });

    return NextResponse.json({ success: true, message: 'Cambio aplicado', data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: 'Fallo', error: err.message }, { status: 500 });
  }
}
