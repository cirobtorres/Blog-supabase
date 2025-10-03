import { Toaster } from "@/components/ui/sonner";
import { ProfileProvider } from "@/providers/ProfileProvider";
import { getProfile } from "@/services/user";

export default async function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedProfile: Profile | null = await getProfile();

  return (
    <>
      <ProfileProvider loggedProfile={loggedProfile}>
        {children}
      </ProfileProvider>
      <Toaster position="top-center" />
    </>
  );
}
