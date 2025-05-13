import Image from "next/image";
import { ArticleBreadcrumb } from "../Breadcrumb";
import { ReturnToHome } from "../Buttons";
import { convertToLargeDate } from "../../utils/dates";

interface ArticleWithAuthor extends Article {
  authors: Author;
}

export const ArticleTitle = ({
  title,
  sub_title,
  authors,
  created_at,
}: ArticleWithAuthor) => (
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
          <div className="flex gap-2 items-center">
            <Image
              src={
                authors?.avatar_url
                  ? authors.avatar_url
                  : "/images/not-authenticated.png"
              }
              alt={`Avatar de ${authors?.username ?? "Excluído"}`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <p>{authors?.username ?? "Excluído"}</p>
          </div>
          <p className="flex items-center gap-2">
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
        </div>
      </div>
    </div>
  </section>
);
