import AdminMenu from "../../components/AdminMenu";
import { Footer } from "../../components/Footer";
import { FixedHeader, StaticHeader } from "../../components/Header";
import { createServerAppClient } from "../../supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin",
  description: "Painel de administrador",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerAppClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  if (!profile.admin) notFound();

  return (
    <>
      <FixedHeader profile={profile} />
      <main className="relative w-full h-full grid grid-cols-[49px_1fr] flex-1 mt-(--header-height)">
        <AdminMenu />
        <section className="w-full h-full pt-6 pb-10 max-w-full mx-auto px-8">
          <div className="mx-4">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
