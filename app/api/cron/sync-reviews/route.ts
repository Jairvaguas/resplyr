import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { syncUserReviews } from '@/lib/sync-reviews';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener todos los usuarios que tienen registro en google_accounts
  const { data: accounts, error } = await supabaseServer
    .from('google_accounts')
    .select('user_id');

  if (error || !accounts) {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }

  // Usuarios distintos por si acaso
  const userIds = Array.from(new Set(accounts.map((a: any) => a.user_id)));

  let totalSyncedLocations = 0;
  let totalNewReviews = 0;
  let allErrors: string[] = [];

  for (const userId of userIds) {
    if (!userId) continue;
    const result = await syncUserReviews(String(userId));
    totalSyncedLocations += result.locationsSynced;
    totalNewReviews += result.newReviewsCount;
    if (result.errors && result.errors.length > 0) {
      allErrors.push(`[UserId: ${userId}] ${result.errors.join(' | ')}`);
    }
  }

  return NextResponse.json({
    synced: totalSyncedLocations,
    newReviews: totalNewReviews,
    errors: allErrors,
  });
}
