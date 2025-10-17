import { Footer } from "@/components/Footer";
import { StaticHeader } from "@/components/Header";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerAppClient } from "@/supabase/server";

export const metadata: Metadata = {
  title: "User",
  description: "Painel de usuário",
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

  if (!profile) notFound();

  return (
    <>
      <StaticHeader profile={profile} />
      <main className="relative w-full h-full grid grid-cols-[49px_1fr] flex-1">
        <section className="w-full h-full pt-6 pb-10 max-w-full mx-auto px-8">
          <div className="mx-4">{children}</div>
        </section>
      </main>
      <Footer />
    </>
  );
}
