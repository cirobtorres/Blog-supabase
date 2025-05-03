import Link from "next/link";
import { EditOrDeleteArticleButtons } from "../Buttons/client";

export const ArticleFeedGrid = ({
  articles,
  isTheAuthor,
}: {
  articles: Article[];
  isTheAuthor: string;
}) =>
  articles.length > 0 ? (
    <ul className="flex flex-col mx-4 [&_li]:not-last:mb-10">
      {articles.map(
        (article) =>
          !article.is_private && (
            <li
              key={article.id}
              id={article.id}
              className={"grid items-center".concat(
                article.author_id === isTheAuthor
                  ? " grid-rows-[30px_auto_auto_40px_30px]"
                  : " grid-rows-[30px_auto_auto_40px]"
              )}
            >
              <small className="text-neutral-500">
                <time dateTime={String(article.created_at)}>
                  {String(article.created_at)}
                </time>
              </small>
              <h2 className="text-2xl font-bold">
                <Link
                  href={`articles/${article.id}`}
                  className="transition-colors hover:text-white"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="text-neutral-500">{article.sub_title}</p>
              <Link
                href={`articles/${article.id}`}
                className="max-w-48 text-center py-1 px-2 rounded border border-neutral-800 bg-neutral-900 transition-colors hover:text-white"
              >
                Leia mais
              </Link>
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
