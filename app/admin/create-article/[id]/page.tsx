import { EditArticleForm } from "@/components/Forms/EditArticleForm";
import { StaticHeader } from "@/components/Header";
import { createServerAppClient } from "@/supabase/server";
import { notFound } from "next/navigation";

export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerAppClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single<Article>();

  if (error) {
    console.error(error);
    notFound(); // Article to edit might not exist
  }

  return (
    <>
      <StaticHeader profile={profile} />
      <EditArticleForm profileId={profile.id} article={{ ...article }} />
    </>
  );
}
