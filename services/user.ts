import { createServerAppClient } from "@/supabase/server";

export const getProfile = async () => {
  const supabase = await createServerAppClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return profile;
};
