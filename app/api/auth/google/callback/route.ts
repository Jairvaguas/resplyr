import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard?error=google_auth_rejected", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?error=no_code", request.url));
  }

  let userId;
  try {
    if (state) {
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
      userId = decodedState.userId;
    }
  } catch (e) {
    console.error("Error al decodificar el parámetro state:", e);
  }

  if (!userId) {
     return NextResponse.redirect(new URL("/dashboard?error=invalid_state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

  try {
    // Intercambiar token de autorización por access token.
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Fallo OAuth token fetch", tokenData);
      return NextResponse.redirect(new URL("/dashboard?error=token_exchange_failed", request.url));
    }

    const { access_token, refresh_token, expires_in, scope } = tokenData;

    // Calculo manual en fecha real.
    const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

    // Comprobamos si el usuario ya tenía credenciales y sólo queremos actualizar access token para no sobreescribir con Null el refresh.
    const { data: existingAccount } = await supabaseServer
      .from('google_accounts')
      .select('refresh_token')
      .eq('user_id', userId)
      .single();

    const finalRefreshToken = refresh_token || (existingAccount ? existingAccount.refresh_token : null);

    const { error: upsertError } = await supabaseServer
      .from('google_accounts')
      .upsert({
        user_id: userId,
        access_token,
        refresh_token: finalRefreshToken,
        expires_at: expiresAt,
        scope,
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error("Error al guardar token en Supabase", upsertError);
      return NextResponse.redirect(new URL("/dashboard?error=db_save_failed", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard?connected=true", request.url));

  } catch (error) {
    console.error("Error procesando callback web de Google", error);
    return NextResponse.redirect(new URL("/dashboard?error=internal_server_error", request.url));
  }
}
