import { ReturnToHome } from "@/components/Buttons";
import { Header } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { createServerAppClient } from "../../../supabase/server";
import { BackToTopButton } from "../../../components/Buttons/client";
import { faker } from "@faker-js/faker";

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
        <section className="w-full bg-neutral-900 border-y border-neutral-800 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <ReturnToHome />
            <div className="mb-4">
              <h1 className="text-4xl font-bold">{article.title}</h1>
            </div>
            <div className="mb-4">
              <p className="text-2xl text-neutral-500">{article.sub_title}</p>
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
        <section className="w-full h-96 shrink-0 border-b border-neutral-800 bg-[image:repeating-linear-gradient(315deg,_#262626_0,_#262626_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed" />
        <section className="max-w-7xl mx-auto">
          <div className="grid grid-cols-[200px_auto_80px] gap-4 mx-4">
            <article className="text-sm py-10">
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
            <article id={article.id} className="py-10">
              <div
                dangerouslySetInnerHTML={{ __html: article.body }}
                className="article-content"
              />
            </article>
            <article className="py-10">
              <BackToTopButton articleId={article.id} />
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
