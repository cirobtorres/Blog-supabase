"use client";

import { addBreakline, transformHeadings } from "@/utils/articles";

export const ArticleBody = ({ body }: { body: string }) => {
  const bodyWithIds = transformHeadings(body);
  const bodyWithBreaklines = addBreakline(bodyWithIds);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: bodyWithBreaklines }}
      className="article-typography"
    />
  );
};
