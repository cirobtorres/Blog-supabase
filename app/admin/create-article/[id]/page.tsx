import { EditArticleForm } from "@/components/Forms";
import { createBrowserAppClient } from "@/supabase/client";
import { redirect } from "next/navigation";

interface Params {
  id: string;
}

export default async function EditArticle({ params }: { params: Params }) {
  const { id } = await params;
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

  return <EditArticleForm {...article} />;
}
