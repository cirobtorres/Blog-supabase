import Link from "next/link";
import { Header } from "../../components/Header";
import { createServerAppClient } from "../../supabase/server";

export default async function AdminPage() {
  const supabase = await createServerAppClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <Header user={user} />
      <main className="mt-20 max-w-7xl mx-auto">
        <Link href="/admin/create-article">Criar Artigo</Link>
      </main>
    </>
  );
}
