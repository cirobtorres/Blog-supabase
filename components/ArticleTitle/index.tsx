import Image from "next/image";
import { ArticleBreadcrumb } from "../Breadcrumb";
import { ReturnToHome } from "../Buttons";
import { convertToLargeDate } from "../../utils/dates";
import ArticleTitleCommentInfo from "./ArticleTitleCommentInfo";

export const ArticleTitle = ({
  id,
  title,
  sub_title,
  slug,
  authors,
  created_at,
}: ArticleJoinAuthor) => {
  return (
    <section className="w-full border-b border-neutral-800 bg-neutral-900">
      <div className="max-w-7xl mx-auto">
        <div className="py-10 mx-4">
          <ReturnToHome />
          <ArticleBreadcrumb />
          <div className="mb-4">
            <h1 className="text-4xl font-bold">{title}</h1>
          </div>
          <div className="mb-4">
            <p className="text-2xl text-neutral-500">{sub_title}</p>
          </div>
          <div className="flex flex-wrap gap-6 items-center mb-4">
            <ArticleTitleAuthorInfo {...authors} />
            <ArticleTitleDateTimeInfo created_at={created_at} />
            <ArticleTitleCommentInfo article_id={id} />
            <ArticleTitleLikeInfo likes={0} />
          </div>
        </div>
      </div>
    </section>
  );
};

const ArticleTitleAuthorInfo = ({
  id,
  profile_id,
  avatar_url,
  username,
  updated_at,
  created_at,
}: Author) => (
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

const ArticleTitleLikeInfo = ({ likes }: { likes: number }) => (
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
      className="lucide lucide-heart-icon lucide-heart"
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
    </svg>{" "}
    {likes}
  </p>
);
