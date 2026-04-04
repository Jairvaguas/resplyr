import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

async function getValidAccessToken(userId: string) {
  const { data: account, error } = await supabaseServer
    .from('google_accounts')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !account) return null;

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
      await supabaseServer
        .from('google_accounts')
        .update({
          access_token: tokenData.access_token,
          expires_at: expiresAt,
        })
        .eq('user_id', userId);
      return tokenData.access_token;
    }
    return null;
  }
  return account.access_token;
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) return NextResponse.json({ error: "No cuenta con token de Google" }, { status: 403 });

  const { data: locations, error: locError } = await supabaseServer
    .from('locations')
    .select('*')
    .eq('user_id', userId);

  if (locError || !locations) return NextResponse.json({ error: "No hay locations" }, { status: 400 });

  let newReviewsCount = 0;

  for (const loc of locations) {
    const res = await fetch(`https://mybusiness.googleapis.com/v4/${loc.google_location_id}/reviews`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!res.ok) continue;
    
    const data = await res.json();
    if (!data.reviews) continue;

    for (const review of data.reviews) {
      // Upsert
      const reviewName = review.name; // accounts/.../locations/.../reviews/...
      const reviewerName = review.reviewer?.displayName || 'Anónimo';
      const rating = review.starRating; // e.g. FIVE
      const comment = review.comment || '';
      const createTime = review.createTime;
      const reviewReply = review.reviewReply; // si ya tiene reply en google

      // mapear rating numérico simplificado si es necesario
      let ratingNum = 0;
      if(rating === 'ONE') ratingNum = 1;
      if(rating === 'TWO') ratingNum = 2;
      if(rating === 'THREE') ratingNum = 3;
      if(rating === 'FOUR') ratingNum = 4;
      if(rating === 'FIVE') ratingNum = 5;

      const { data: existing } = await supabaseServer
        .from('reviews')
        .select('google_review_id, ai_reply_draft')
        .eq('google_review_id', reviewName)
        .single();
        
      if (!existing) {
        // es nueva
        await supabaseServer.from('reviews').insert({
          user_id: userId,
          location_id: loc.id, // reference to our internal location table
          google_review_id: reviewName,
          reviewer_name: reviewerName,
          rating: ratingNum,
          comment: comment,
          review_date: createTime,
          replied: reviewReply ? true : false,
          reply_text: reviewReply ? reviewReply.comment : null
        });
        newReviewsCount++;
      }
    }
  }

  return NextResponse.json({ success: true, newReviewsCount });
}
