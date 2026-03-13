import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

// Copia o refactor en funciones modulares ideal. 
// Para efectos declarativos del SOP está empaquetizado
async function getValidAccessToken(userId: string) {
  const { data: account, error } = await supabaseServer
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !account) return null;
  const isExpired = new Date(account.expires_at) < new Date();
  
  if (isExpired && account.refresh_token) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        refresh_token: account.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const tokenData = await response.json();
    if (response.ok && tokenData.access_token) {
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
      await supabaseServer.from('google_accounts').update({
          access_token: tokenData.access_token,
          expires_at: expiresAt,
        }).eq('user_id', userId);
      return tokenData.access_token;
    }
    return null;
  }
  return account.access_token;
}


export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const url = new URL(request.url);
  const rawLocationId = url.searchParams.get("locationId"); // Es la referencia de UUID propia, o google_location_id (dependiendo de params).

  if (!rawLocationId) {
    return NextResponse.json({ error: "Falta parámetro locationId" }, { status: 400 });
  }

  // 1. Conseguir token
  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) return NextResponse.json({ error: "Token inválido revalidalo reconectando la cuenta" }, { status: 403 });

  // 2. Traer el mapeo de uuid a google_location_id desde nuestra DB
  const { data: locationRow, error: locError } = await supabaseServer
    .from('locations')
    .select('*')
    .eq('google_location_id', rawLocationId) 
    .single();

  if (locError || !locationRow) {
      return NextResponse.json({ error: "Ubicación invalida" }, { status: 404 });
  }

  const accountIdLocId = locationRow.google_location_id; // "accounts/ID123/locations/LOC456"

  try {
     // 3. Petición a api V4 para reseñas
     const reviewsRes = await fetch(`https://mybusiness.googleapis.com/v4/${accountIdLocId}/reviews`, {
        headers: { Authorization: `Bearer ${accessToken}` },
     });
     
     const reviewsData = await reviewsRes.json();
     if (!reviewsRes.ok) {
         return NextResponse.json({ error: reviewsData.error?.message }, { status: 400 });
     }

     const allReviews = [];

     // 4. Sincronizar hacia supabase local
     if (reviewsData.reviews) {
         for (const rev of reviewsData.reviews) {
            allReviews.push(rev);

            const hasReply = rev.reviewReply && rev.reviewReply.comment;
             
            await supabaseServer
               .from('reviews')
               .upsert({
                 location_id: locationRow.id,
                 user_id: userId,
                 google_review_id: rev.reviewId,
                 reviewer_name: rev.reviewer?.displayName || 'Anónimo',
                 rating: rev.starRating === 'FIVE' ? 5 : (rev.starRating === 'FOUR' ? 4 : (rev.starRating === 'THREE' ? 3 : (rev.starRating === 'TWO' ? 2 : 1))),
                 comment: rev.comment || '',
                 replied: hasReply ? true : false,
                 reply_text: hasReply ? rev.reviewReply.comment : null,
                 review_date: rev.createTime,
               }, { onConflict: 'google_review_id' });
         }
     }

     return NextResponse.json({ reviews: allReviews });

  } catch (error) {
     console.error("Fallo obteniendo reseñas:", error);
     return NextResponse.json({ error: "Error en red" }, { status: 500 });
  }
}
