import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: sub, error } = await supabaseServer
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !sub) {
    return NextResponse.json({ plan: 'none', status: 'no_subscription' });
  }

  if (sub.plan === 'trial') {
    const trialEnds = new Date(sub.trial_ends_at);
    const now = new Date();
    
    // Si ya pasaron los 7 días y sigue como active
    if (now > trialEnds && sub.status === 'active') {
      await supabaseServer
        .from('subscriptions')
        .update({ status: 'expired' })
        .eq('id', sub.id);
        
      return NextResponse.json({ plan: 'trial', status: 'expired' });
    }

    if (sub.status === 'active') {
      const diffTime = Math.abs(trialEnds.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return NextResponse.json({ plan: 'trial', status: 'active', daysLeft: diffDays });
    }
  }

  if (sub.plan === 'pro') {
    return NextResponse.json({ plan: 'pro', status: sub.status, endsAt: sub.current_period_ends_at });
  }

  return NextResponse.json({ plan: sub.plan, status: sub.status });
}
