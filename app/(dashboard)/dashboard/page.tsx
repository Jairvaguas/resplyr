"use client"
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardClient() {
  const { user, isLoaded } = useUser();
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Intentar cargar ubicaciones solo cuando la página carga para comprobar estatus OAuth
  useEffect(() => {
    async function checkStatusAndFetch() {
      setLoading(true);
      try {
        const response = await fetch("/api/google/locations");
        if (response.ok) {
           const data = await response.json();
           setLocations(data.locations || []);
           setIsConnected(true);
        } else if (response.status === 403 || response.status === 401) {
           setIsConnected(false);
        } else {
           setIsConnected(false); // otros errores asumen desconectado
        }
      } catch (err) {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    }
    
    if (isLoaded && user) {
        checkStatusAndFetch();
    }
  }, [isLoaded, user]);

  const connectGoogle = () => {
    window.location.href = "/api/auth/google";
  }

  if (!isLoaded || loading) return <div className="p-8">Cargando dashboard...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Bienvenido a Replyr</h1>
      <p className="text-muted-foreground mb-8">
        Email: {user?.primaryEmailAddress?.emailAddress || "Desconocido"}
      </p>

      {isConnected === false ? (
        <div className="bg-slate-50 border p-6 rounded-lg text-center space-y-4 dark:bg-slate-900 border-border">
            <h2 className="text-xl font-semibold">1. Conecta tu perfil</h2>
            <p className="text-muted-foreground text-sm">
               Para leer las reseñas de tu negocio y auto-responderlas vía IA, necesitamos acceso a tu Google Business.
            </p>
            <Button onClick={connectGoogle} size="lg" className="mt-4">
               Conectar Google Business Profile
            </Button>
        </div>
      ) : (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Tus negocios</h2>
                <div className="text-sm px-3 py-1 bg-green-500/10 text-green-600 rounded-full font-medium">Conectado</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {locations.length === 0 ? (
                    <div className="col-span-2 text-center p-8 border rounded-lg border-dashed">
                       No se hallaron negocios. ¿Revocaste el permiso o careces de ubicaciones creadas?
                    </div>
                ) : (
                    locations.map((loc) => (
                        <div key={loc.name} className="p-6 border rounded-lg shadow-sm space-y-2">
                           <h3 className="font-semibold text-lg">{loc.locationName || "Ubicación genérica"}</h3>
                           <p className="text-xs text-muted-foreground pb-2">{loc.address?.addressLines?.join(", ")}</p>
                           <Button variant="outline" size="sm">Ver Reseñas</Button>
                        </div>
                    ))
                )}
            </div>
        </div>
      )}
    </div>
  );
}
