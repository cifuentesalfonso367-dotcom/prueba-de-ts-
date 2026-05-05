import Link from "next/link";
import { Shield, ArrowRight, Lock, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-auth min-h-screen flex flex-col items-center justify-center p-6 text-center">
      {/* Glow orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)" }} />

      <div className="fade-up relative z-10 max-w-xl w-full">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
          <Shield size={38} color="white" />
        </div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-3 leading-tight">
          <span className="gradient-text">C.A.N.D.Y</span>
        </h1>
        <p className="text-lg mb-2 font-medium" style={{ color: "var(--text-secondary)" }}>
          Sistema de Administración Seguro
        </p>
        <p className="mb-10 text-sm" style={{ color: "var(--text-muted)" }}>
          Autenticación JWT · Hasheo bcrypt · Protección de rutas · Panel en tiempo real
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {["JWT Access Token", "Refresh Token", "bcrypt hashing", "Edge Middleware", "Roles & permisos"].map((f) => (
            <span key={f} className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", color: "var(--text-secondary)" }}>
              {f}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" id="cta-login"
            className="btn-primary flex items-center justify-center gap-2 no-underline"
            style={{ width: "auto", padding: "13px 32px" }}>
            <Lock size={17} />
            Iniciar sesión
            <ArrowRight size={16} />
          </Link>
          <Link href="/register" id="cta-register"
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              background: "var(--bg-card)",
              textDecoration: "none",
              transition: "background 0.2s, color 0.2s"
            }}>
            <Users size={17} />
            Crear cuenta
          </Link>
        </div>
      </div>

      {/* Bottom footnote */}
      <p className="absolute bottom-6 text-xs" style={{ color: "var(--text-muted)" }}>
        C.A.N.D.Y v0.1 · Next.js 16 · Prisma · PostgreSQL
      </p>
    </div>
  );
}
