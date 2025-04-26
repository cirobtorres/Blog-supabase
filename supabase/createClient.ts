import { createClient } from "@supabase/supabase-js";

export function supabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "NOT_FOUND";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC_KEY || "NOT_FOUND";

  return createClient(supabaseUrl, supabaseKey);
}
