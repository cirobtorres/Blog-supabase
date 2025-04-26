import { supabase } from "@/supabase/createClient";
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
        <h1>Wops, ocorreu um erro inesperado.</h1>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto grid grid-rows-[100px_1fr] justify-center items-center mt-20">
      <div className="h-full flex items-center">
        <h1>Feed</h1>
      </div>
      {articles.length > 0 ? (
        <ul className="flex flex-col [&_li]:not-last:mb-10">
          {articles.map((article) => (
            <li key={article.id} id={article.id}>
              <Link href="/">
                <h2>{article.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2>Nenhum artigo</h2>
        </div>
      )}
    </main>
  );
}
