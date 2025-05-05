import Link from "next/link";
import { EditOrDeleteArticleButtons } from "../Buttons/client";
import { convertToLargeDate } from "@/utils/dates";

export const ArticleFeedGrid = ({
  articles,
  isTheAuthor,
}: {
  articles: Article[];
  isTheAuthor: string;
}) =>
  articles.length > 0 ? (
    <ul className="grid gap-2 mx-4 xl:grid-cols-[repeat(3,1fr)] md:grid-cols-[repeat(2,1fr)] ">
      {articles.map(
        (article) =>
          !article.is_private && (
            <li
              key={article.id}
              id={article.id}
              className={"".concat(
                isTheAuthor ? " grid gap-1 grid-rows-[1fr_30px]" : " pb-[30px]"
              )}
            >
              <div className="h-full grid grid-rows-[auto_34px] border border-neutral-800 p-2 rounded">
                <div className="flex flex-col">
                  <small className="text-neutral-500">
                    <time dateTime={convertToLargeDate(article.created_at)}>
                      {convertToLargeDate(article.created_at)}
                    </time>
                  </small>
                  <div className="pb-2">
                    <h2 className="text-xl font-bold">
                      <Link
                        href={`articles/${article.id}`}
                        className="transition-colors duration-300 hover:text-white"
                      >
                        {article.title}
                      </Link>
                    </h2>
                  </div>
                  <div className="pb-2">
                    <p className="text-neutral-500">{article.sub_title}</p>
                  </div>
                </div>
                <Link
                  href={`articles/${article.id}`}
                  className="text-center py-1 px-2 rounded border border-neutral-800 transition-colors duration-300 bg-neutral-900 hover:text-white hover:bg-neutral-800" // max-w-48
                >
                  Leia mais
                </Link>
              </div>
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
