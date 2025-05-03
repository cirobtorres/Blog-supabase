import { ReturnToHome } from "@/components/Buttons";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { createServerAppClient } from "../../../supabase/server";

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

  const supabase = await createServerAppClient();

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("*, authors (display_name)")
    .eq("id", id)
    .single<ArticleWithAuthor>();

  if (!article || article.is_private || articleError)
    return (
      <main className="max-w-7xl min-h-screen mx-auto flex justify-center items-center">
        <section className="mx-10 bg-neutral-800">
          <h1>Não encontrado.</h1>
        </section>
      </main>
    );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header user={user} />
      <main className="min-h-screen flex flex-col items-center mt-20">
        <section className="w-full bg-neutral-900 border-y border-neutral-800 py-10">
          <div className="max-w-7xl mx-auto">
            <ReturnToHome />
            <div className="mb-4">
              <h1 className="text-4xl font-bold">{article.title}</h1>
            </div>
            <div className="mb-4">
              <p className="text-2xl">{article.sub_title}</p>
            </div>
            <div className="flex gap-2 items-center mb-4">
              <p>Autor: {article.authors?.display_name ?? "Removido"}</p>
              <p className="flex gap-2">Criado: {String(article.created_at)}</p>
              {article.updated_at && (
                <p>Atualizado: {String(article.updated_at)}</p>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-10 mx-10">
          <div
            dangerouslySetInnerHTML={{ __html: article.body }}
            className="max-w-7xl mx-auto article-content"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
