import Image from "next/image";
import { ArticleBreadcrumb } from "../Breadcrumb";
import { convertToLargeDate } from "../../utils/dates";
import { ReturnToHome } from "../Buttons";
import ArticleTitleCommentInfo from "./ArticleTitleCommentInfo";
import ArticleTitleLikeInfo from "./ArticleTitleLikeInfo";

export const ArticleTitle = ({
  article,
  profile,
  hasUserLiked,
}: {
  article: ArticleJoinAuthor;
  profile: Profile | null;
  hasUserLiked: boolean;
}) => {
  return (
    <section className="w-full border-b border-neutral-800 bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="py-10 mx-4">
          <ReturnToHome />
          <ArticleBreadcrumb />
          <div className="mb-4">
            <h1 className="text-4xl font-bold">{article.title}</h1>
          </div>
          <div className="mb-4">
            <p className="text-2xl text-neutral-500">{article.sub_title}</p>
          </div>
          <div className="flex flex-wrap gap-6 items-center mb-4">
            <ArticleTitleAuthorInfo {...article.authors} />
            <ArticleTitleDateTimeInfo created_at={article.created_at} />
            <ArticleTitleCommentInfo countComments={article.comment_count} />
            <ArticleTitleLikeInfo
              article_id={article.id}
              profile_id={profile?.id}
              hasUserLiked={hasUserLiked}
              likesCount={article.likes_count}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ArticleTitleAuthorInfo = ({ avatar_url, username }: Author) => (
  <div className="flex items-center gap-2 px-2 py-0.5">
    <Image
      src={avatar_url ? avatar_url : "/images/not-authenticated.png"}
      alt={`Avatar de ${username ?? "Excluído"}`}
      width={32}
      height={32}
      className="rounded-full"
    />
    <p>{username ?? "Excluído"}</p>
  </div>
);

const ArticleTitleDateTimeInfo = ({ created_at }: { created_at: Date }) => (
  <p className="flex items-center gap-2 px-2 py-0.5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-clock-icon lucide-clock"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <time dateTime={convertToLargeDate(created_at)}>
      {convertToLargeDate(created_at)}
    </time>
  </p>
);
