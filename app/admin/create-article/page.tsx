import { CreateArticleForm } from "@/components/Forms";
import { StaticHeader } from "../../../components/Header";
import { createServerAppClient } from "../../../supabase/server";

export default async function CreateArticlePage() {
  const supabase = await createServerAppClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <StaticHeader user={user} />
      <CreateArticleForm />
    </>
  );
}
