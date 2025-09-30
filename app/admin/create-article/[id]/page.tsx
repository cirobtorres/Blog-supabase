import { EditArticleForm } from "@/components/Forms/EditArticleForm";
import { StaticHeader } from "@/components/Header";
import { getProfile } from "@/services/user";
import { createBrowserAppClient } from "@/supabase/client";
import { redirect } from "next/navigation";

interface Params {
  id: string;
}

export default async function EditArticle({ params }: { params: Params }) {
  const { id } = await params;
  const profile = await getProfile();
  if (!profile) redirect("/");
  const supabase = await createBrowserAppClient();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single<Article>();

  if (error) {
    console.error(error);
    redirect("/");
  }

  return (
    <>
      <StaticHeader profile={profile} />
      <EditArticleForm profileId={profile.id} article={{ ...article }} />
    </>
  );
}
