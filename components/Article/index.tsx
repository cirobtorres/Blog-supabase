"use client";

import { loopThroughBlocks } from "@/utils/articles";
import { useEffect, useState } from "react";
import { AnchorTracker } from "../StickyNavBar";
import { ArticleBody } from "../ArticleBody";
import { BackToTopButton } from "../Buttons/client";

export const Article = ({
  articleId,
  blocks,
}: {
  articleId: string;
  blocks: string;
}) => {
  const [html, setHtml] = useState<Block[]>([]);

  useEffect(() => {
    loopThroughBlocks(blocks, setHtml);
  }, [blocks]);

  if (!html.length) return null;

  return (
    <div className="grid grid-rows-1 md:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_80px] gap-4 mx-4">
      <AnchorTracker articleId={articleId} blocks={html} />
      <ArticleBody articleId={articleId} blocks={html} />
      <BackToTopButton articleId={articleId} />
    </div>
  );
};
