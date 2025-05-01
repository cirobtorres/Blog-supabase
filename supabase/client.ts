import { createClient } from "@supabase/supabase-js";

export function createBrowserAppClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key is missing.");
  }

  return createClient(supabaseUrl, supabaseKey);
}
