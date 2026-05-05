import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse } from '@/types';
import { Document } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

type DocumentWithUser = Document & { usuario?: { nombre: string; email: string } };

export async function GET(request: Request): Promise<NextResponse<ApiResponse<DocumentWithUser[]>>> {
  try {
    const role = request.headers.get('x-user-role');
    const userId = parseInt(request.headers.get('x-user-id') || '0', 10);

    const docs = await prisma.document.findMany({
      where: role === 'ADMIN' ? {} : { usuarioId: userId },
      include: { usuario: { select: { nombre: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, message: 'OK', data: docs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Document>>> {
  try {
    const userId = parseInt(request.headers.get('x-user-id') || '0', 10);
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ success: false, message: 'Sin archivo' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, fileName), buffer);

    const newDoc = await prisma.document.create({
      data: {
        title: file.name,
        fileUrl: `/uploads/${fileName}`,
        usuarioId: userId
      }
    });

    return NextResponse.json({ success: true, message: 'Guardado', data: newDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Error', error: error.message }, { status: 500 });
  }
}
