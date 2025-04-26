import { supabase } from "@/supabase/createClient";
import Link from "next/link";

export default async function HomePage() {
  const { data: articles, error } = await supabase()
    .from("articles")
    .select("*")
    .overrideTypes<Article[]>();

  if (error)
    return (
      <main className="flex justify-center items-center min-h-screen">
        <h1>Erro</h1>
      </main>
    );

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
