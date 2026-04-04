import { supabaseServer } from '@/lib/supabase-server';

export async function startTrial(userId: string) {
  // 1. Check if sub already exists
  const { data: existing } = await supabaseServer
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (existing) {
    console.log(`Trial already initialized for user ${userId}`);
    return; // Idempotent
  }

  // 2. Insert trial
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7); // +7 days

  const { error } = await supabaseServer
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan: 'trial',
      status: 'active',
      trial_ends_at: trialEndsAt.toISOString(),
    });

  if (error) {
    console.error("Error starting trial:", error);
  } else {
    console.log(`Trial started successfully for user ${userId}`);
  }
}
