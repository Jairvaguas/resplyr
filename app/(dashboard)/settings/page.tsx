'use client';

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useUser, useClerk } from "@clerk/nextjs";
import { Moon, Sun, Bell, Mail, LogOut, User as UserIcon, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Settings state
  const [alertNegative, setAlertNegative] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  // Billing state
  const [subStatus, setSubStatus] = useState<any>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSettings();
    fetchBillingStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setAlertNegative(data.alert_negative_reviews ?? true);
        setWeeklySummary(data.weekly_summary ?? false);
        if (data.dark_mode) setTheme("dark");
        else setTheme("light");
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBillingStatus = async () => {
    try {
      const res = await fetch("/api/billing/status");
      if (res.ok) {
        setSubStatus(await res.json());
      } else {
        // Fallback UI simulado si el endpoint no devuelve estado válido (mock)
        setSubStatus({ status: 'trial', plan: 'Básico', days_remaining: 5, current_period_ends_at: '2026-03-31' });
      }
    } catch (e) {
      console.error(e);
      setSubStatus({ status: 'trial', plan: 'Básico', days_remaining: 5, current_period_ends_at: '2026-03-31' });
    } finally {
      setSubLoading(false);
    }
  };

  const saveSettings = async (updates: any) => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alert_negative_reviews: alertNegative,
          weekly_summary: weeklySummary,
          dark_mode: theme === "dark",
          ...updates
        }),
      });
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    saveSettings({ dark_mode: checked });
  };

  const toggleAlert = (checked: boolean) => {
    setAlertNegative(checked);
    saveSettings({ alert_negative_reviews: checked });
  };

  const toggleWeekly = (checked: boolean) => {
    setWeeklySummary(checked);
    saveSettings({ weekly_summary: checked });
  };

  const handleCancelClick = () => setShowCancelModal(true);
  
  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch("/api/billing/cancel-subscription", { method: "POST" });
      if (res.ok) {
         setSubStatus({ ...subStatus, status: 'cancelled' });
         setShowCancelModal(false);
      } else {
         alert("Ocurrió un error al cancelar. Intenta de nuevo.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de conexión al cancelar.");
    } finally {
      setCancelling(false);
    }
  };

  if (!isLoaded || !mounted) return <div className="p-8 animate-pulse text-slate-500">Cargando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-slate-900 dark:text-slate-100 dark:bg-slate-900 min-h-screen transition-colors relative">
      <h1 className="text-2xl font-bold mb-8">Configuración</h1>
      
      {/* 1. Apariencia */}
      <section className="mb-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Apariencia
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-900 dark:text-slate-100">Modo oscuro</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Cambia la interfaz a colores oscuros para reducir el brillo.</p>
          </div>
          <Switch 
            checked={theme === "dark"} 
            onCheckedChange={toggleTheme}
            disabled={loading || saving}
          />
        </div>
      </section>

      {/* 2. Notificaciones */}
      <section className="mb-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificaciones
        </h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Alerta de reseñas negativas</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recibir alerta por email al llegar reseña negativa (1-3 estrellas)</p>
            </div>
            <Switch 
              checked={alertNegative} 
              onCheckedChange={toggleAlert}
              disabled={loading || saving}
            />
          </div>
          
          <div className="h-px w-full bg-slate-100 dark:bg-slate-700" />
            
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Resumen Semanal</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recibir resumen semanal de reseñas por email</p>
            </div>
            <Switch 
              checked={weeklySummary} 
              onCheckedChange={toggleWeekly}
              disabled={loading || saving}
            />
          </div>
        </div>
      </section>

      {/* 3. Suscripción */}
      <section className="mb-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Suscripción
        </h2>
        {subLoading ? (
           <div className="animate-pulse flex h-16 w-full bg-slate-100 dark:bg-slate-700 rounded-lg"></div>
        ) : subStatus?.status === 'trial' ? (
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-none">Trial activo</Badge>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">{subStatus.days_remaining} días restantes de prueba.</p>
             </div>
             <Button onClick={() => window.location.href='/api/billing/create-subscription'} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
               Actualizar a Plan Pro
             </Button>
           </div>
        ) : subStatus?.status === 'active' ? (
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-slate-900 dark:text-slate-100">Plan {subStatus.plan || 'Pro'}</span>
                 <Badge className="bg-green-100 text-green-700 hover:bg-green-200 shadow-none">Activa</Badge>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">Próxima renovación: {subStatus.current_period_ends_at || 'fin de período'}.</p>
             </div>
             <Button variant="outline" onClick={handleCancelClick} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-medium">
               Cancelar suscripción
             </Button>
           </div>
        ) : subStatus?.status === 'cancelled' ? (
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <span className="font-bold text-slate-500 line-through">Plan {subStatus.plan || 'Pro'}</span>
                 <Badge variant="outline" className="text-slate-500 border-slate-200 bg-slate-50 shadow-none">Cancelado</Badge>
               </div>
               <p className="text-sm text-slate-500 dark:text-slate-400">Tu acceso se mantiene hasta el {subStatus.current_period_ends_at || 'fin de tu ciclo'}.</p>
             </div>
             <Button onClick={() => window.location.href='/api/billing/create-subscription'} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium">
               Reactivar suscripción
             </Button>
           </div>
        ) : (
          <div className="text-sm text-slate-500">No hay información de suscripción disponible.</div>
        )}
      </section>

      {/* 4. Perfil */}
      <section className="mb-10 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Perfil
        </h2>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="w-16 h-16 rounded-full border shadow-sm" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                {user?.fullName || "Usuario Resplyr"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user?.primaryEmailAddress?.emailAddress || "Sin email"}
              </p>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => signOut({ redirectUrl: '/sign-in' })}
            className="w-full md:w-auto flex items-center justify-center gap-2 text-white font-medium"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </section>

      {/* Modal Confirmación de Cancelación */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">¿Seguro que deseas cancelar?</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Mantendrás acceso hasta el <span className="font-semibold">{subStatus?.current_period_ends_at || 'fin de tu período actual'}</span>.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="font-medium dark:border-slate-600 dark:text-slate-300 dark:bg-slate-800"
              >
                Volver
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="font-bold shadow-sm text-white"
              >
                {cancelling ? 'Cancelando...' : 'Confirmar cancelación'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
