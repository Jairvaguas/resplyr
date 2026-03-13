import { createClient } from "@supabase/supabase-js";

// Usamos fallback a string vacío/locales para no romper el build si las vars no están presentes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
