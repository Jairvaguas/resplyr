import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

// Función para refrescar el token de google automáticamente.
async function getValidAccessToken(userId: string) {
  const { data: account, error } = await supabaseServer
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !account) {
    return null;
  }

  const isExpired = new Date(account.expires_at) < new Date();
  
  if (isExpired && account.refresh_token) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId || "",
        client_secret: clientSecret || "",
        refresh_token: account.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await response.json();

    if (response.ok && tokenData.access_token) {
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
      
      // Upsert the refreshed token silently over Service Role
      await supabaseServer
        .from('google_accounts')
        .update({
          access_token: tokenData.access_token,
          expires_at: expiresAt,
        })
        .eq('user_id', userId);

      return tokenData.access_token;
    }
    return null; // El refresh falló o ha sido revocado.
  }

  return account.access_token;
}


export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const accessToken = await getValidAccessToken(userId);

  if (!accessToken) {
    return NextResponse.json({ error: "No cuenta con token de Google conectado, o ha expirado." }, { status: 403 });
  }

  try {
    // API endpoint V4 para listas de cuentas a las que el usuario tiene acceso
    const accountsRes = await fetch("https://mybusiness.googleapis.com/v4/accounts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const accountsData = await accountsRes.json();

    if (!accountsRes.ok || !accountsData.accounts) {
        return NextResponse.json({ error: accountsData.error?.message || "Sin cuentas de Google Business detectadas" }, { status: 400 });
    }

    const allLocations = [];

    for (const account of accountsData.accounts) {
      const locsRes = await fetch(`https://mybusiness.googleapis.com/v4/${account.name}/locations`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const locsData = await locsRes.json();

      if (locsData.locations) {
         // Insert each remote location into supabase to sync states 
         for (const loc of locsData.locations) {
           allLocations.push(loc);
           const { error: upsertErr } = await supabaseServer
             .from('locations')
             .upsert({
               user_id: userId,
               google_location_id: loc.name,
               name: loc.locationName || 'Ubicación sin nombre',
               address: loc.address ? loc.address.addressLines?.join(', ') : null,
             }, { onConflict: 'google_location_id' });
             
             if(upsertErr) console.error("Error sincronizando ubicación", upsertErr);
         }
      }
    }

    return NextResponse.json({ locations: allLocations });

  } catch (error) {
      console.error("Error en router de Ubicaciones Google Business:", error);
      return NextResponse.json({ error: "Fallo comunicación con Google API" }, { status: 500 });
  }
}
