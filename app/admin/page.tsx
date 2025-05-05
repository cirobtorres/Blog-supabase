import Link from "next/link";
import { StaticHeader } from "../../components/Header";
import { createServerAppClient } from "../../supabase/server";

export default async function AdminPage() {
  const supabase = await createServerAppClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <StaticHeader user={user} />
      <main className="mt-[var(--header-height)] max-w-7xl mx-auto">
        <Link href="/admin/create-article">Criar Artigo</Link>
      </main>
    </>
  );
}
