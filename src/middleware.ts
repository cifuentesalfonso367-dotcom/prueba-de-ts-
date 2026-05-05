import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/jwt-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rutas públicas de autenticación ─────────────────────────────
  const isAuthRoute =
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/api/auth/refresh');

  if (isAuthRoute) return NextResponse.next();

  // ── Protección de rutas API privadas ─────────────────────────────
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Acceso Denegado: se requiere Authorization: Bearer <token>' },
        { status: 401 }
      );
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Acceso Denegado: token inválido o expirado' },
        { status: 401 }
      );
    }

    // ── RBAC: Verificación de Roles ────────────────────────────────
    // Si la ruta es /api/users, exigimos que sea ADMIN
    if (pathname.startsWith('/api/users') && payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Acceso Prohibido: se requieren permisos de Administrador' },
        { status: 403 }
      );
    }

    // Inyectamos identidad en los headers para que los endpoints la lean
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId.toString());
    requestHeaders.set('x-user-role', payload.role);
    if (payload.email) requestHeaders.set('x-user-email', payload.email);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ── Protección de páginas visuales privadas ──────────────────────
  // Si intenta ir a /dashboard sin estar autenticado → redirigir a /login
  if (pathname.startsWith('/dashboard')) {
    // Revisamos el accessToken que el cliente almacena en cookies o lo dejamos
    // pasar y el cliente se encargará del redirect (ya que el token vive en localStorage).
    // El dashboard mismo hace el redirect si no hay contexto.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
