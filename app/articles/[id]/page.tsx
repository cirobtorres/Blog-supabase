import { DeleteArticleButton } from "@/components/Buttons/client";
import { ReturnToHome } from "@/components/ReturnToHome";
import { createBrowserAppClient } from "@/supabase/client";

interface ArticleWithAuthor extends Article {
  authors?: {
    display_name: string | null;
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const supabase = createBrowserAppClient();

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("*, authors (display_name)")
    .eq("id", id)
    .single<ArticleWithAuthor>();

  if (!article || article.private || articleError)
    return (
      <main className="max-w-7xl min-h-screen mx-auto flex justify-center items-center">
        <section className="mx-10 bg-slate-800">
          <h1>Não encontrado.</h1>
        </section>
      </main>
    );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: author } = await supabase
    .from("authors")
    .select("id, user_id")
    .eq("user_id", user?.id)
    .single();
  const isTheAuthor = author?.id;

  return (
    <main className="max-w-7xl min-h-screen mx-auto flex justify-center">
      <section className="w-full py-10 mx-10">
        <ReturnToHome />
        <div className="mb-4">
          <h1>{article.title}</h1>
        </div>
        <div className="flex gap-2 items-center mb-4">
          <p>Autor: {article.authors?.display_name ?? "Removido"}</p>
          <p className="flex gap-2">Criado: {String(article.created_at)}</p>
          {article.updated_at && (
            <p>Atualizado: {String(article.updated_at)}</p>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: article.body }}
          className="flex flex-col gap-4"
        />
        {isTheAuthor && <DeleteArticleButton {...article} />}
      </section>
    </main>
  );
}
