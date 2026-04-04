import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import ClientDashboard from "./ClientDashboard";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  console.log("=== SERVER SIDE LOGS ===");
  console.log("Current Clerk UserID:", userId);

  let isConnected = false;
  let localLocations: any[] = [];
  let userReviews: any[] = [];
  
  if (userId) {
    const { data: accounts } = await supabaseServer
       .from("google_accounts")
       .select("*")
       .eq("user_id", userId);
    
    const { data: locs } = await supabaseServer
       .from("locations")
       .select("*")
       .eq("user_id", userId);

    const { data: revs } = await supabaseServer
       .from("reviews")
       .select("*")
       .eq("user_id", userId)
       .order("review_date", { ascending: false });

    console.log("Result google_accounts:", accounts);
    console.log("Result locations:", locs);

    if ((accounts && accounts.length > 0) || (locs && locs.length > 0)) {
        isConnected = true;
    }
    
    if (locs) {
        localLocations = locs;
    }

    if (revs) {
        userReviews = revs;
    }
  }

  return (
    <ClientDashboard 
        isConnected={isConnected} 
        locations={localLocations} 
        reviews={userReviews}
        userName={user?.firstName || user?.username || "Usuario"}
        userAvatar={user?.imageUrl || ""}
    />
  );
}
