import { ReturnToHome } from "@/components/ReturnToHome";
import { supabase } from "@/supabase/client";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const { data: article, error: articleError } = await supabase()
    .from("articles")
    .select("*, authors (display_name)")
    .eq("id", id)
    .single<Article>();

  if (!article || article.private || articleError)
    return (
      <main className="max-w-7xl min-h-screen mx-auto flex justify-center items-center bg-slate-900">
        <section className="mx-10 bg-slate-800">
          <h1>Não encontrado.</h1>
        </section>
      </main>
    );

  return (
    <main className="max-w-7xl min-h-screen mx-auto flex justify-center bg-slate-900">
      <section className="py-10 mx-10 bg-slate-800">
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
      </section>
    </main>
  );
}
