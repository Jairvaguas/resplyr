'use client';

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Star } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isSignUp = pathname.includes("sign-up");

  const headline = isSignUp ? "Empieza a responder reseñas con IA" : "Bienvenido de vuelta";
  const subtitle = isSignUp ? "7 días gratis · Sin tarjeta de crédito" : "Tu reputación en Google te está esperando";

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Columna Izquierda - Propuesta de Valor */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden shadow-2xl z-10">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-green-500/20 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center mb-16 inline-block">
            <Image src="/logo2.png" alt="Resplyr Logo" height={48} width={0} sizes="100vw" className="h-12 w-auto object-contain" unoptimized />
          </Link>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            {headline}
          </h1>
          <p className="text-lg text-slate-400 mb-10">
            {subtitle}
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span>Respuestas IA personalizadas en segundos</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span>Alertas instantáneas de reseñas negativas</span>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
              <span>Publica directamente en Google Maps</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mt-12 w-full max-w-xl">
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-slate-300 italic mb-4 text-sm leading-relaxed">
            "Antes tardaba horas respondiendo reseñas. Ahora recibo el borrador en el email y lo publico en segundos. Mi calificación subió de 4.1 a 4.6 estrellas en 2 meses."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              MG
            </div>
            <div>
              <p className="text-sm font-bold text-white">María G.</p>
              <p className="text-xs text-slate-400">Restaurante · Ciudad de México</p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha - Caja de Clerk */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center py-12 px-4 sm:px-12 bg-slate-50 min-h-screen relative">
         {/* Logo Mobile */}
        <div className="lg:hidden mb-10 flex flex-col items-center gap-3">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Resplyr Logo" height={48} width={0} sizes="100vw" className="h-12 w-auto object-contain" unoptimized />
          </Link>
          <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>

        <div className="w-full max-w-md flex flex-col items-center justify-center">
            {children}
        </div>
      </div>
    </div>
  );
}
