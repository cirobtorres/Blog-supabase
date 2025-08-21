"use client";

import {
  addBreakline,
  addSvgToExternalLinks,
  transformHeadings,
} from "@/utils/articles";

export const ArticleBody = ({ body }: { body: string }) => {
  const bodyWithIds = transformHeadings(body);
  const bodyWithBreaklines = addBreakline(bodyWithIds);
  const linksWithSvgs = addSvgToExternalLinks(
    bodyWithBreaklines,
    "localhost:3000"
  );

  return (
    <div
      dangerouslySetInnerHTML={{ __html: linksWithSvgs }}
      className={
        `flex flex-col rounded-md [&_p]:pb-6 [&_p]:text-neutral-400 [&_p]:font-medium [&_strong]:text-neutral-400` +
        ` [&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:hover:text-neutral-100 [&_p_a]:transition-all` +
        ` [&_p_a]:bg-neutral-900 [&_p_a]:border [&_p_a]:border-neutral-800 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md` +
        ` [&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-900 [&_p_mark]:border [&_p_mark]:border-neutral-800` +
        ` [&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md` +
        ` [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6` +
        ` [&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6` +
        ` [&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc` +
        ` [&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal`
      }
    />
  );
};
