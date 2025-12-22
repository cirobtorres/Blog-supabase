import { createBrowserAppClient } from "../supabase/client";
import { createServerAppClient } from "../supabase/server";
import { StaticHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { ArticleFeedGrid } from "../components/ArticleFeedGrid";
import { ArticleCover } from "../components/ArticleCover";

export default async function HomePage() {
  let articles: ArticleJoinAuthor[] = [];

  try {
    const { data: fetchedArticles, error } = await createBrowserAppClient()
      .from("articles")
      .select("*, authors (*)")
      .order("created_at", { ascending: false })
      .overrideTypes<ArticleJoinAuthor[], { merge: false }>();

    if (error) throw new Error("Error loading articles");

    articles = fetchedArticles;
  } catch (error) {
    console.error(error);

    return (
      <main className="flex justify-center items-center min-h-screen">
        <h1>Wops, an error has occurred.</h1>
      </main>
    );
  }

  const supabase = await createServerAppClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: author } = await supabase
    .from("authors")
    .select("*")
    .eq("profile_id", profile?.id)
    .single<Author | null>();

  return (
    <>
      <StaticHeader profile={profile} />
      <main className="">
        <ArticleCover />
        <section
          className="w-full grid grid-rows-[auto_1fr] items-start py-10" // max-w-7xl mx-auto
        >
          <div className="flex items-center mx-8 pb-10">
            <h1 className="text-3xl font-bold">Últimos Artigos</h1>
          </div>
          <ArticleFeedGrid articles={articles} author={author} />
        </section>
      </main>
      <Footer />
    </>
  );
}
