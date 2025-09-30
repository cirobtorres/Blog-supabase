"use client";

import Link from "next/link";
import { countCommentsByArticleId } from "@/services/comment";
import { useEffect, useState } from "react";

const ArticleTitleCommentInfo = ({ article_id }: { article_id: string }) => {
  const [totalCommentLength, setTotalCommentLength] = useState<number | null>(
    null
  );

  useEffect(() => {
    (async () =>
      setTotalCommentLength(await countCommentsByArticleId(article_id)))();
  }, [article_id]);

  return (
    <Link
      href="#Comments-section"
      className={
        `flex items-center gap-2 px-2 py-0.5 rounded outline-none hover:text-neutral-100 ` +
        `transition-all focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
      }
    >
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
        className="lucide lucide-message-circle-icon lucide-message-circle"
      >
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      </svg>{" "}
      {totalCommentLength}
    </Link>
  );
};

export default ArticleTitleCommentInfo;
