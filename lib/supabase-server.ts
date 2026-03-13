import { createClient } from "@supabase/supabase-js";

// Utility Server Component to bypass RLS when interacting manually inside protected contexts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-secret-key";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("SUPABASE_SERVICE_ROLE_KEY no está definido. Los accesos server-side que rebasen RLS fallarán.");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
