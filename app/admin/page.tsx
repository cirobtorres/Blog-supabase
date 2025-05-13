import Link from "next/link";
import { StaticHeader } from "../../components/Header";
import { getProfile } from "@/services/user";

export default async function AdminPage() {
  const profile = await getProfile();
  return (
    <>
      <StaticHeader profile={profile} />
      <main className="mt-[var(--header-height)] max-w-7xl mx-auto">
        <section className="mx-4">
          <Link href="/admin/create-article">Criar Artigo</Link>
        </section>
      </main>
    </>
  );
}
