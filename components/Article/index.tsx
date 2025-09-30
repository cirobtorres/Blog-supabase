"use client";

import { useState } from "react";
import { AnchorTracker } from "../StickyNavBar";
import { ArticleBody } from "../ArticleBody";
import { BackToTopButton } from "../Buttons/client";

export const Article = ({
  articleId,
  body,
}: {
  articleId: string;
  body: string;
}) => {
  const block = JSON.parse(body);
  const [anchors, setAnchors] = useState<AnchorTracher>([]);

  const anchorProps = { anchors };
  const bodyProps = { block, articleId, anchorCallback: setAnchors };

  return (
    <div className="grid grid-rows-1 md:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_80px] gap-4 mx-4">
      <AnchorTracker {...anchorProps} />
      <ArticleBody {...bodyProps} />
      <BackToTopButton articleId={articleId} />
    </div>
  );
};
