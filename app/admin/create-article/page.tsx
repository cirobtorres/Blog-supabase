import { CreateArticleForm } from "../../../components/Forms/CreateArticleForn";
import { ArticleBreadcrumb } from "@/components/Breadcrumb";
import { createServerAppClient } from "@/supabase/server";

export default async function CreateArticlePage() {
  const supabase = await createServerAppClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      <ArticleBreadcrumb className="mx-4" />
      <div className="w-full flex justify-center items-center">
        <CreateArticleForm profileId={profile.id} />
      </div>
    </>
  );
}
