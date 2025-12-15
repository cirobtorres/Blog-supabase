import { Toaster } from "../components/ui/sonner";
import { ProfileProvider } from "../providers/ProfileProvider";
import { createServerAppClient } from "../supabase/server";

export default async function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerAppClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      <ProfileProvider loggedProfile={profile}>{children}</ProfileProvider>
      <Toaster position="top-center" />
    </>
  );
}
