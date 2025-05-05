"use client";

import { addIdsToHeadings } from "../StickyNavBar";

export const ArticleBody = ({ body }: { body: string }) => {
  const bodyWithIds = addIdsToHeadings(body);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: bodyWithIds }}
      className="article-typography"
    />
  );
};
