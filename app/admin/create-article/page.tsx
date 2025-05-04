import { CreateArticleForm } from "@/components/Forms";
import { Header } from "../../../components/Header";
import { createServerAppClient } from "../../../supabase/server";

export default async function CreateArticlePage() {
  const supabase = await createServerAppClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <Header user={user} />
      <CreateArticleForm />
    </>
  );
}
