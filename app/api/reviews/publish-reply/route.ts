import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

async function getValidAccessToken(userId: string) {
  const { data: account } = await supabaseServer
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!account) return null;
  const isExpired = new Date(account.expires_at) < new Date();
  
  if (isExpired && account.refresh_token) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        refresh_token: account.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await res.json();
    if (res.ok && tokenData.access_token) {
      await supabaseServer.from('google_accounts').update({
        access_token: tokenData.access_token,
        expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      }).eq('user_id', userId);
      return tokenData.access_token;
    }
    return null;
  }
  return account.access_token;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { reviewId, replyText } = await req.json();

  const { data: review } = await supabaseServer
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();

  if (!review) return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });

  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) return NextResponse.json({ error: "Sin acceso a Google" }, { status: 403 });

  const res = await fetch(`https://mybusiness.googleapis.com/v4/${review.google_review_id}/reply`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ comment: replyText })
  });

  if (res.ok) {
    await supabaseServer
      .from('reviews')
      .update({
        replied: true,
        reply_text: replyText
      })
      .eq('id', reviewId);
    return NextResponse.json({ success: true });
  } else {
    const errData = await res.json();
    return NextResponse.json({ error: "Error de Google API", details: errData }, { status: 400 });
  }
}
