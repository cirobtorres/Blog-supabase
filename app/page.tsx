import { supabase } from "@/supabase/client";
import Link from "next/link";

export default async function HomePage() {
  let articles: Article[] = [];

  try {
    const { data: fetchedArticles, error } = await supabase()
      .from("articles")
      .select("*")
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

  return (
    <main className="max-w-7xl mx-auto min-h-screen bg-slate-900">
      <section className="grid grid-rows-[32px_100px_1fr] py-10 mx-10 bg-slate-800">
        <div className="flex justify-between mx-4 bg-slate-950">
          <div className="flex items-center gap-2">
            <Link href="/sign-in" className="w-fit py-1 px-2 bg-slate-700">
              Sign In
            </Link>
            <Link href="/sign-up" className="w-fit py-1 px-2 bg-slate-700">
              Sign Up
            </Link>
          </div>
          <Link
            href="/articles/create-article"
            className="w-fit py-1 px-2 bg-slate-700"
          >
            Create Article
          </Link>
        </div>
        <div className="flex items-center mx-4 bg-slate-800">
          <h1>Feed</h1>
        </div>
        {articles.length > 0 ? (
          <ul className="flex flex-col mx-4 [&_li]:not-last:mb-10 bg-slate-700">
            {articles.map(
              (article) =>
                !article.private && (
                  <li
                    key={article.id}
                    id={article.id}
                    className="w-fit hover:underline"
                  >
                    <Link href={`articles/${article.id}`}>
                      <h2>{article.title}</h2>
                    </Link>
                  </li>
                )
            )}
          </ul>
        ) : (
          <div className="mx-4 bg-slate-700">
            <h2>No article yet =|</h2>
          </div>
        )}
      </section>
    </main>
  );
}
