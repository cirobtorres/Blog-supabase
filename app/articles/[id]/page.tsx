import { FixedHeader } from "../../../components/Header";
import { Footer } from "../../../components/Footer";
import { createServerAppClient } from "../../../supabase/server";
import { BackToTopButton } from "../../../components/Buttons/client";
import { AnchorTracker } from "@/components/StickyNavBar";
import { ArticleBody } from "@/components/ArticleBody";
import { RelatedArticles } from "@/components/RelatedArticles";
import { getProfile } from "@/services/user";
import { ArticleTitle } from "../../../components/ArticleTitle";
import { ArticleCover } from "@/components/ArticleCover";
import { CommentProvider } from "@/providers/CommentProvider";
import Comments from "@/components/Comment";

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
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

  const profile: Profile | null = await getProfile();

  return (
    <>
      <FixedHeader profile={profile} />
      <main className="flex flex-col items-center mt-[var(--header-height)]">
        <ArticleTitle {...article} />
        <ArticleCover />
        <section className="w-full max-w-7xl mx-auto py-10">
          <div className="grid grid-rows-1 md:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_80px] gap-4 mx-4">
            <article className="text-sm">
              <AnchorTracker articleId={article.id} />
            </article>
            <article id={article.id}>
              <ArticleBody body={article.body} />
            </article>
            <article className="hidden lg:block">
              <BackToTopButton articleId={article.id} />
            </article>
          </div>
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
