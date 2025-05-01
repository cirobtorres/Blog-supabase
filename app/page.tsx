import {
  DeleteArticleButton,
  EditArticleButton,
  LogoutButton,
} from "@/components/Buttons/client";
import { createBrowserAppClient } from "@/supabase/client";
import { createServerAppClient } from "@/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  let articles: Article[] = [];

  try {
    const { data: fetchedArticles, error } = await createBrowserAppClient()
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

  const supabase = await createServerAppClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: author } = await supabase
    .from("authors")
    .select("id, user_id")
    .eq("user_id", user?.id)
    .single();
  const isTheAuthor = author?.id;

  return (
    <main className="max-w-7xl mx-auto min-h-screen">
      <section className="grid grid-rows-[32px_100px_1fr] py-10 mx-10">
        <div className="flex justify-end mx-4">
          {user ? (
            <div className="flex items-center gap-4">
              <p>TODO: profile display_name</p>
              <LogoutButton />
              <Link
                href="/articles/create-article"
                className="w-fit p-1 bg-neutral-700"
              >
                Create Article
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="w-fit py-1">
                Sign In
              </Link>
              <Link href="/sign-up" className="w-fit py-1">
                Sign Up
              </Link>
            </div>
          )}
        </div>
        <div className="flex items-center mx-4">
          <h1>Feed</h1>
        </div>
        {articles.length > 0 ? (
          <ul className="flex flex-col mx-4 [&_li]:not-last:mb-10">
            {articles.map(
              (article) =>
                !article.private && (
                  <li
                    key={article.id}
                    id={article.id}
                    className="flex flex-col"
                  >
                    <Link
                      href={`articles/${article.id}`}
                      className="hover:underline"
                    >
                      <h2
                        className="inline"
                        dangerouslySetInnerHTML={{ __html: article.title }}
                      />
                    </Link>
                    {article.author_id === isTheAuthor && (
                      <div>
                        <EditArticleButton {...article} />
                        <DeleteArticleButton {...article} />
                      </div>
                    )}
                  </li>
                )
            )}
          </ul>
        ) : (
          <div className="mx-4">
            <h2>No article yet =|</h2>
          </div>
        )}
      </section>
    </main>
  );
}
