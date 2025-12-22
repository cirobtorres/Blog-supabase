import Link from "next/link";
import { EditOrDeleteArticleButtons } from "../Buttons/client";
import { convertToLargeDate } from "@/utils/dates";
import Image from "next/image";
import { cn } from "@/utils/classnames";
import { focusVisibleWhiteRing } from "@/styles/classNames";

export const ArticleFeedGrid = async ({
  articles,
  author,
}: {
  articles: ArticleJoinAuthor[];
  author: Author | null;
}) => {
  const isTheAuthor: string | undefined = author?.id;
  return articles.length > 0 ? (
    <ul className="grid gap-2 mx-8 xl:grid-cols-[repeat(4,1fr)] md:grid-cols-[repeat(2,1fr)] ">
      {articles.map(
        (article) =>
          !article.is_private && (
            <li
              key={article.id}
              id={article.id}
              className={"h-[400px] ".concat(
                // TODO: title/sub_title overflow
                isTheAuthor ? "grid gap-1 grid-rows-[1fr_30px]" : "pb-[30px]"
              )}
            >
              <ArticleGridElement article={article} author={author} />
              {article.author_id === isTheAuthor && (
                <EditOrDeleteArticleButtons article={article} />
              )}
            </li>
          )
      )}
    </ul>
  ) : (
    <div className="mx-4">
      <h2>No article yet =|</h2>
    </div>
  );
};

export const ArticleGridElement = ({
  article,
  author,
}: {
  article: ArticleJoinAuthor;
  author: Author | null;
}) => {
  return (
    <div className="h-full grid grid-rows-[auto_34px] border border-neutral-800 p-3 rounded-lg bg-neutral-950">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <small className="text-neutral-500">
            <time dateTime={convertToLargeDate(article.created_at)}>
              {convertToLargeDate(article.created_at)}
            </time>
          </small>
          <Image
            src={
              article?.authors?.avatar_url ?? "/images/not-authenticated.png"
            }
            alt={`Avatar de ${author?.username ?? "[Excluído]"}`}
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
        <div className="pb-2">
          <h2 className="text-lg font-bold">
            <Link
              href={`/articles/${article.id}`}
              className={cn(
                "rounded-xs transition-all duration-300 hover:text-neutral-100",
                focusVisibleWhiteRing
              )}
            >
              {article.title}
            </Link>
          </h2>
        </div>
        <div className="pb-2">
          <p className="text-sm text-neutral-500">{article.sub_title}</p>
        </div>
      </div>
      <Link
        href={`/articles/${article.id}`}
        className={cn(
          "text-center py-1 px-2 rounded-xs border border-neutral-800 hover:border-neutral-700 transition-all duration-300 bg-neutral-900 hover:text-neutral-100 hover:bg-neutral-800 focus-visible:border-neutral-700 focus-visible:bg-neutral-800",
          focusVisibleWhiteRing
        )} // max-w-48
      >
        Leia mais
      </Link>
    </div>
  );
};
