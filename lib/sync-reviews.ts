import { supabaseServer } from '@/lib/supabase-server';
import { clerkClient } from '@clerk/nextjs/server';
import { sendReviewAlert } from '@/lib/email/send-review-alert';

export async function getValidAccessToken(userId: string) {
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

export async function syncUserReviews(userId: string) {
  const errors: string[] = [];
  let newReviewsCount = 0;
  let locationsSynced = 0;

  // Verificar que su suscripción esté activa
  const { data: sub } = await supabaseServer.from('subscriptions').select('status').eq('user_id', userId).single();
  if (sub?.status !== 'active' && sub?.status !== 'trial') {
    return { newReviewsCount: 0, locationsSynced: 0, errors: ["Suscripción inactiva"] };
  }

  const accessToken = await getValidAccessToken(userId);
  if (!accessToken) return { newReviewsCount: 0, locationsSynced: 0, errors: ["No cuenta con token de Google"] };

  const { data: locations, error: locError } = await supabaseServer.from('locations').select('*').eq('user_id', userId);
  if (locError || !locations) return { newReviewsCount: 0, locationsSynced: 0, errors: ["No hay locations"] };

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const CRON_SECRET = process.env.CRON_SECRET || '';

  let userEmail = '';
  try {
    const clerk = await clerkClient();
    const u = await clerk.users.getUser(userId);
    userEmail = u.emailAddresses[0]?.emailAddress || '';
  } catch(e) {
    console.warn("Could not fetch clerk user email", e);
  }

  for (const loc of locations) {
    try {
      const res = await fetch(`https://mybusiness.googleapis.com/v4/${loc.google_location_id}/reviews`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.reviews) continue;
      locationsSynced++;

      for (const review of data.reviews) {
        const reviewName = review.name;
        const reviewerName = review.reviewer?.displayName || 'Anónimo';
        const rating = review.starRating;
        const comment = review.comment || '';
        const createTime = review.createTime;
        const reviewReply = review.reviewReply;

        let ratingNum = 0;
        if(rating === 'ONE') ratingNum = 1;
        else if(rating === 'TWO') ratingNum = 2;
        else if(rating === 'THREE') ratingNum = 3;
        else if(rating === 'FOUR') ratingNum = 4;
        else if(rating === 'FIVE') ratingNum = 5;

        const { data: existing } = await supabaseServer
          .from('reviews')
          .select('id, google_review_id, ai_reply_draft')
          .eq('google_review_id', reviewName)
          .single();
        
        let currentReviewId = null;
        let needsReply = false;

        if (!existing) {
          const { data: newRev, error: errInsert } = await supabaseServer.from('reviews').insert({
            user_id: userId,
            location_id: loc.id,
            google_review_id: reviewName,
            reviewer_name: reviewerName,
            rating: ratingNum,
            comment: comment,
            review_date: createTime,
            replied: reviewReply ? true : false,
            reply_text: reviewReply ? reviewReply.comment : null
          }).select().single();

          if (!errInsert && newRev) {
            newReviewsCount++;
            currentReviewId = newRev.id;
            if (!newRev.replied) needsReply = true;
          }
        } else {
          currentReviewId = existing.id;
          if (!existing.ai_reply_draft && !reviewReply) {
            needsReply = true;
          }
        }

        if (needsReply && currentReviewId) {
          // Generar borrador
          const replyRes = await fetch(`${APP_URL}/api/reviews/generate-reply`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-cron-secret': CRON_SECRET
            },
            body: JSON.stringify({ reviewId: currentReviewId, userId })
          });

          if (replyRes.ok) {
            const replyData = await replyRes.json();
            // Alerta si es 1-3 estrellas
            if (replyData.draft && ratingNum <= 3 && userEmail) {
              try {
                await sendReviewAlert({
                  userEmail,
                  reviewerName,
                  rating: ratingNum,
                  comment,
                  aiDraft: replyData.draft,
                  reviewId: currentReviewId
                });
              } catch (emailErr) {
                errors.push(`Error enviando email reseña ${currentReviewId}`);
              }
            }
          } else {
            errors.push(`Error en generate-reply para reseña ${currentReviewId}`);
          }
        }
      }
    } catch (locReqError: any) {
      errors.push(`Location update error: ${locReqError?.message || 'unknown'}`);
    }
  }

  return { newReviewsCount, locationsSynced, errors };
}
