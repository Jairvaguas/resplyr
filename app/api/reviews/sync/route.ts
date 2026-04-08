import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncUserReviews } from '@/lib/sync-reviews';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const result = await syncUserReviews(userId);

  if (result.errors && result.errors.length > 0 && result.locationsSynced === 0) {
    return NextResponse.json({ error: result.errors[0] }, { status: 400 });
  }

  return NextResponse.json({ success: true, newReviewsCount: result.newReviewsCount });
}
