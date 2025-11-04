"use client";

import { useState } from "react";
import { AnchorTracker } from "../StickyNavBar";
import { ArticleBody } from "../ArticleBody";
import { BackToTopButton } from "../Buttons/client";
import Link from "next/link";
import { ArticlePencilIcon } from "../Icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const Article = ({
  articleId,
  body,
  profile,
}: {
  articleId: string;
  body: string;
  profile: Profile | null;
}) => {
  const block = JSON.parse(body);
  const [anchors, setAnchors] = useState<AnchorTracher>([]);

  const anchorProps = { anchors };
  const bodyProps = { block, articleId, anchorCallback: setAnchors };

  return (
    <section className="w-full max-w-[1600px] mx-auto py-10">
      <div className="grid grid-rows-1 md:grid-cols-[350px_1fr] lg:grid-cols-[350px_1fr_80px] gap-4 mx-4">
        <AnchorTracker {...anchorProps} />
        <ArticleBody {...bodyProps} />
        <article className="hidden lg:block">
          <div
            id="btt-btn-container"
            data-testid="btt-btn-container"
            className="self-start sticky mx-auto my-40 flex flex-col items-center top-1/2 -translate-y-1/2"
          >
            <BackToTopButton articleId={articleId} />
            {profile?.admin && (
              <Tooltip>
                <Link href={`/admin/create-article/${articleId}`}>
                  <TooltipTrigger className="cursor-pointer rounded-full p-3 border border-neutral-700 bg-neutral-900">
                    <ArticlePencilIcon />
                  </TooltipTrigger>
                </Link>
                <TooltipContent sideOffset={10}>Editar artigo</TooltipContent>
              </Tooltip>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
