import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_auth_session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: statsData, error: statsError } = await supabaseServer
      .from('admin_dashboard_stats')
      .select('*')
      .order('registration_date', { ascending: false });

    if (statsError) throw statsError;

    const clerk = await clerkClient();
    const usersResponse = await clerk.users.getUserList({ limit: 500 });
    const users = usersResponse.data;
    
    const clerkMap = new Map();
    users.forEach(u => {
       clerkMap.set(u.id, u.emailAddresses[0]?.emailAddress || 'N/A');
    });

    const enrichedStats = (statsData || []).map(row => ({
       ...row,
       email: clerkMap.get(row.user_id) || 'Unknown'
    }));

    const totalUsers = enrichedStats.length;
    const activeTrials = enrichedStats.filter(s => s.status === 'trial').length;
    const activeSubscribers = enrichedStats.filter(s => s.status === 'active').length;
    const inactiveUsers = enrichedStats.filter(s => s.status === 'expired' || s.status === 'cancelled').length;
    
    let mrr = 0;
    enrichedStats.forEach(s => {
       if (s.status === 'active') {
          if (s.plan === 'basic') mrr += 19;
          else if (s.plan === 'pro') mrr += 39;
          else if (s.plan === 'business') mrr += 79;
       }
    });

    const { data: chartData } = await supabaseServer
      .from('subscriptions')
      .select('created_at')
      .order('created_at', { ascending: true });

    const monthlyGroups = new Map();
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      // Create first day of the month for consistent grouping
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const name = d.toLocaleString('es', { month: 'short' });
      monthlyGroups.set(name, 0);
    }

    if (chartData) {
       chartData.forEach(row => {
          const d = new Date(row.created_at);
          // 6 months roughly
          if ((currentDate.getTime() - d.getTime()) <= (6 * 31 * 24 * 60 * 60 * 1000)) {
             const name = new Date(d.getFullYear(), d.getMonth(), 1).toLocaleString('es', { month: 'short' });
             if(monthlyGroups.has(name)) {
                monthlyGroups.set(name, monthlyGroups.get(name) + 1);
             }
          }
       });
    }

    const growthChart = Array.from(monthlyGroups.entries()).map(([name, Registros]) => ({ name, Registros }));

    const metrics = {
       totalUsers,
       activeTrials,
       activeSubscribers,
       inactiveUsers,
       mrr,
       totalLocationsConnected: enrichedStats.reduce((sum, s) => sum + (Number(s.loc_count) || 0), 0)
    };

    return NextResponse.json({
       metrics,
       table: enrichedStats,
       growthChart
    });
    
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
