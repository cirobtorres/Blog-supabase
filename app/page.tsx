import { createBrowserAppClient } from "@/supabase/client";
import { createServerAppClient } from "@/supabase/server";
import { StaticHeader } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleFeedGrid } from "@/components/ArticleFeedGrid";
import { ArticleCover } from "@/components/ArticleCover";

export default async function HomePage() {
  let articles: Article[] = [];

  try {
    const { data: fetchedArticles, error } = await createBrowserAppClient()
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .overrideTypes<Article[], { merge: false }>();

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

  const { data: author } = await supabase
    .from("authors")
    .select("id, user_id")
    .eq("user_id", user?.id)
    .single();
  const isTheAuthor: string | null = author?.id;

  return (
    <>
      <StaticHeader user={user} />
      <main className="">
        <ArticleCover />
        <section className="max-w-7xl mx-auto min-h-screen grid grid-rows-[auto_1fr] items-start py-10">
          <div className="flex items-center mx-4 pb-10">
            <h1 className="text-3xl font-bold">Últimos Artigos</h1>
          </div>
          <ArticleFeedGrid articles={articles} isTheAuthor={isTheAuthor} />
        </section>
      </main>
      <Footer />
    </>
  );
}
