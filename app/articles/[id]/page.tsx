import { ReturnToHome } from "@/components/Buttons";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { createServerAppClient } from "../../../supabase/server";
import { BackToTopButton } from "../../../components/Buttons/client";
import { faker } from "@faker-js/faker";
import { ArticleCover } from "@/components/ArticleCover";

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
      <main className="flex flex-col items-center mt-20">
        <section className="w-full bg-neutral-900 border-y border-neutral-800">
          <div className="max-w-7xl mx-auto">
            <div className="py-10 mx-4">
              <ReturnToHome />
              <div className="mb-4">
                <h1 className="text-4xl font-bold">{article.title}</h1>
              </div>
              <div className="mb-4">
                <p className="text-2xl text-neutral-500">{article.sub_title}</p>
              </div>
              <div className="flex gap-2 items-center mb-4">
                <p>Autor: {article.authors?.display_name ?? "Removido"}</p>
                <p className="flex gap-2">
                  Criado: {String(article.created_at)}
                </p>
                {article.updated_at && (
                  <p>Atualizado: {String(article.updated_at)}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <ArticleCover />
        <section className="w-full max-w-7xl mx-auto py-10">
          <div className="grid grid-rows-1 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr_80px] gap-4 mx-4">
            <article className="text-sm">
              <nav>
                <ul>
                  <li>{faker.lorem.sentence()}</li>
                  <li>{faker.lorem.sentence()}</li>
                  <li>{faker.lorem.sentence()}</li>
                  <li>{faker.lorem.sentence()}</li>
                  <li>{faker.lorem.sentence()}</li>
                  <li>{faker.lorem.sentence()}</li>
                </ul>
              </nav>
            </article>
            <article id={article.id}>
              <div
                dangerouslySetInnerHTML={{ __html: article.body }}
                className="article-content"
              />
            </article>
            <article className="hidden lg:block">
              <BackToTopButton articleId={article.id} />
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
