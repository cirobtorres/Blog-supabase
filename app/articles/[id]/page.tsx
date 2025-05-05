import { ReturnToHome } from "@/components/Buttons";
import { FixedHeader } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { createServerAppClient } from "../../../supabase/server";
import { BackToTopButton } from "../../../components/Buttons/client";
import { faker } from "@faker-js/faker";
import { ArticleCover } from "@/components/ArticleCover";
import { convertToLargeDate } from "@/utils/dates";
import Image from "next/image";

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
      <FixedHeader user={user} />
      <main className="flex flex-col items-center mt-[var(--header-height)]">
        <section className="w-full bg-neutral-900 border-b border-neutral-800">
          <div className="max-w-7xl mx-auto">
            <div className="py-10 mx-4">
              <ReturnToHome />
              <div className="mb-4">
                <h1 className="text-4xl font-bold">{article.title}</h1>
              </div>
              <div className="mb-4">
                <p className="text-2xl text-neutral-500">{article.sub_title}</p>
              </div>
              <div className="flex flex-wrap gap-6 items-center mb-4">
                <div className="flex gap-2 items-center">
                  <Image
                    src="/images/not-authenticated.png"
                    alt={`Avatar de ${
                      article.authors?.display_name ?? "Excluído"
                    }`}
                    width={32}
                    height={32}
                  />
                  <p>{article.authors?.display_name ?? "Excluído"}</p>
                </div>
                <p className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clock-icon lucide-clock"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <time dateTime={convertToLargeDate(article.created_at)}>
                    {convertToLargeDate(article.created_at)}
                  </time>
                </p>
                {/* {article.updated_at && (
                    <p>
                      Atualizado:{" "}
                      <time
                        dateTime={convertToLargeDate(article.updated_at)}
                      >
                        {convertToLargeDate(article.updated_at)}
                      </time>
                    </p>
                  )} */}
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
