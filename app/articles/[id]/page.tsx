import { FixedHeader } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { createServerAppClient } from "../../../supabase/server";
import { Article } from "@/components/Article";
import { RelatedArticles } from "@/components/RelatedArticles";
import { ArticleTitle } from "../../../components/ArticleTitle";
import { ArticleCover } from "@/components/ArticleCover";
import { CommentProvider } from "@/providers/CommentProvider";
import Comments from "@/components/Comment";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerAppClient();

  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("*, authors (*)")
    .eq("id", id)
    .single<ArticleJoinAuthor>();

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

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <>
      <FixedHeader profile={profile} />
      <main className="flex flex-col items-center mt-[var(--header-height)]">
        <ArticleTitle {...article} />
        <ArticleCover />
        <section className="w-full max-w-7xl mx-auto py-10">
          <Article articleId={article.id} body={article.body} />
        </section>
        <RelatedArticles />
        <CommentProvider>
          <Comments />
        </CommentProvider>
      </main>
      <Footer />
    </>
  );
}
