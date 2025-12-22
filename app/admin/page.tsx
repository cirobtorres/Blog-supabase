import Image from "next/image";
import Link from "next/link";
import { ArticleBreadcrumb } from "../../components/Breadcrumb";
import { PlusIcon, UserIcon } from "../../components/Icons";
import { createServerAppClient } from "../../supabase/server";

const ADMIN_MAIN_CONTAINER_CLASSES =
  "py-4 px-6 rounded border border-neutral-800 bg-neutral-900";

export default async function AdminPage() {
  const supabase = await createServerAppClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: userAdmin }: { data: Author | null } = await supabase
    .from("authors")
    .select("*")
    .eq("profile_id", profile.id)
    .single();

  if (!userAdmin) return <div>Erro</div>; // TODO: se o profile é um admin, porém não está associado a um author

  return (
    <>
      <ArticleBreadcrumb />
      <h1 className="text-4xl font-extrabold text-neutral-300">Dashboard</h1>
      <div className="grid grid-cols-1 gap-2">
        {/* <SectionProfile userAdmin={userAdmin} /> */}
        {/* <SectionStatistics /> */}
        {/* <SectionCreateArt /> */}
        {/* <SectionPublishedArts /> */}
        {/* <SectionMediaLib /> */}
      </div>
    </>
  );
}

const SectionProfile = ({ userAdmin }: { userAdmin: Author }) => (
  <section className={ADMIN_MAIN_CONTAINER_CLASSES}>
    <div className="flex gap-2">
      <UserIcon className="stroke-neutral-300" />
      <h2 className="text-xl font-extrabold text-neutral-300">Profile</h2>
    </div>
    <div className="flex flex-col justify-center items-center">
      <Image
        src={
          userAdmin.avatar_url
            ? userAdmin.avatar_url
            : `/images/not-authenticated.png`
        }
        alt={`Avatar de ${userAdmin.username}`}
        width={32}
        height={32}
        className="rounded-full"
      />
      <p>{userAdmin.username}</p>
      <p>{userAdmin.email}</p>
    </div>
  </section>
);

const SectionStatistics = () => (
  <section className={ADMIN_MAIN_CONTAINER_CLASSES}>
    <h2 className="text-xl font-extrabold text-neutral-300">Estatísticas</h2>
    <div className=""></div>
  </section>
);

const SectionCreateArt = () => (
  <section className={ADMIN_MAIN_CONTAINER_CLASSES}>
    <h2 className="text-xl font-extrabold text-neutral-300">Criar Artigo</h2>
    <div className="w-72">
      <Link href="/admin/create-article" className="block">
        <div className="w-full h-50 flex justify-center items-center rounded border border-neutral-800 bg-neutral-900">
          <PlusIcon className="size-14 stroke-neutral-700" />
        </div>
      </Link>
    </div>
  </section>
);

const SectionPublishedArts = () => (
  <section className={ADMIN_MAIN_CONTAINER_CLASSES}>
    <h2 className="text-xl font-extrabold text-neutral-300">Artigos</h2>
    <div className=""></div>
  </section>
);

const SectionMediaLib = () => (
  <section className={ADMIN_MAIN_CONTAINER_CLASSES}>
    <h2 className="text-xl font-extrabold text-neutral-300">Media</h2>
    <div className=""></div>
  </section>
);
