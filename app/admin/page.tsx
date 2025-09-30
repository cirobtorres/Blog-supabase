import Link from "next/link";
import { StaticHeader } from "../../components/Header";
import { getProfile } from "@/services/user";

export default async function AdminPage() {
  const profile = await getProfile();

  return (
    <>
      <StaticHeader profile={profile} />
      <main className="mt-[var(--header-height)] max-w-7xl mx-auto">
        <section className="w-72 mb-2">
          <Link href="/admin/create-article" className="block">
            <div className="w-full h-50 rounded border border-neutral-700 bg-neutral-800">
              Criar Artigo
            </div>
          </Link>
        </section>
      </main>
    </>
  );
}
