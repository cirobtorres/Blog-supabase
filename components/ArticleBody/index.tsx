"use client";

import { transformHeadings } from "@/utils/articles";

export const ArticleBody = ({ body }: { body: string }) => {
  // const bodyWithIds = addIdsToHeadings(body);
  const bodyWithIds = transformHeadings(body);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: bodyWithIds }}
      className="article-typography"
    />
  );
};
