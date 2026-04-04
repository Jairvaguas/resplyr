'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface EmptyStateProps {
  hasGoogleConnected: boolean;
  onConnect: () => void;
  onSync: () => void;
  isSyncing?: boolean;
}

export default function EmptyState({ hasGoogleConnected, onConnect, onSync, isSyncing }: EmptyStateProps) {
  if (!hasGoogleConnected) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 w-full min-h-[60vh] rounded-2xl">
        {/* Barra de Progreso (OnboardingSteps) */}
        <div className="flex items-center mb-12">
          {/* Step 0 - Checked */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
               <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div className="w-12 border-t-2 border-slate-300 border-dashed mx-2"></div>
          </div>
          
          {/* Step 1 - Active */}
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
               1
             </div>
             <span className="font-semibold text-slate-900 text-sm whitespace-nowrap ml-3">1. Conecta tu perfil</span>
             <div className="w-12 border-t-2 border-slate-300 border-dashed ml-3 mr-2"></div>
          </div>
          
          {/* Step 2 - Inactive */}
          <div className="flex items-center">
             <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center text-slate-400 font-bold shrink-0 bg-transparent">
               2
             </div>
          </div>
        </div>

        {/* Título Principal */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Conecta tu Google Business Profile
        </h2>

        {/* Botón de Google */}
        <button 
          onClick={onConnect} 
          className="bg-white border border-slate-300 rounded-lg px-6 py-3 flex items-center gap-3 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm transition-all focus:ring-4 focus:ring-slate-100 outline-none"
        >
          {/* Icono oficial Google Multicolor */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-sm font-medium text-slate-700">Continue with Google</span>
        </button>

        {/* Footer */}
        <p className="text-sm text-slate-500 mt-4">Paso 1/3</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
      <div className="w-16 h-16 mb-6 bg-green-50 text-green-500 flex items-center justify-center rounded-2xl border border-green-100">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">¡Todo al día!</h3>
      <p className="text-slate-500 mb-8 max-w-sm">
        No tienes reseñas pendientes de respuesta. Todas tus interacciones recientes ya fueron enviadas o no tienes nuevas valoraciones.
      </p>
      <Button 
        onClick={onSync} 
        disabled={isSyncing}
        variant="outline" 
        className="h-11 px-6 rounded-full font-medium text-slate-700 border-slate-300"
      >
        {isSyncing ? "Sincronizando..." : "Sincronizar reseñas"}
      </Button>
    </div>
  );
}
