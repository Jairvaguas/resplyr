import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";
  
  if (!clientId) {
    return NextResponse.json({ error: "Credenciales de Google no configuradas." }, { status: 500 });
  }

  // Generamos e inyectamos un valor "state" con el userId para validación CSRF opcional
  const state = Buffer.from(JSON.stringify({ userId, csfr: Math.random().toString(36).substring(7) })).toString('base64');
  
  const googleOauthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleOauthUrl.searchParams.append("client_id", clientId);
  googleOauthUrl.searchParams.append("redirect_uri", redirectUri);
  googleOauthUrl.searchParams.append("response_type", "code");
  googleOauthUrl.searchParams.append("scope", "https://www.googleapis.com/auth/business.manage");
  googleOauthUrl.searchParams.append("access_type", "offline");
  googleOauthUrl.searchParams.append("prompt", "consent");
  googleOauthUrl.searchParams.append("state", state);

  return NextResponse.redirect(googleOauthUrl.toString());
}
