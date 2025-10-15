"use client";

import parse, { DOMNode, domToReact } from "html-react-parser";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ExternalLinkIcon, LinkIcon, SearchIcon } from "../Icons";
import { slugify } from "@/utils/strings";
import { ArticleCodeBlock } from "../ArticleCodeBlock";
import { ArticleQuoteBlock } from "../ArticleQuoteBlock";

export const ArticleBody = ({
  articleId,
  block,
  anchorCallback,
}: {
  articleId: string;
  block: Block[];
  anchorCallback: Dispatch<SetStateAction<AnchorTracher>>;
}) => {
  const [parsedBody, setParsedBody] = useState<React.ReactNode>(null);

  useEffect(() => {
    const anchorsList: AnchorTracher = [];

    const boddies = block.map((block) => {
      switch (block.type) {
        case "text":
          const body = (block.data as { body: string }).body;
          return parse(body, {
            replace: (domNode) => {
              if (domNode.type === "tag" && /^h[1-6]$/.test(domNode.name)) {
                if (["h1", "h5", "h6"].includes(domNode.name)) {
                  return null; // Throw away these tags
                }
                const tag = domNode.name;
                const children = domToReact(domNode.children as DOMNode[]);
                const id = slugify(
                  domNode.children
                    .map((c) => (c.type === "text" ? (c as any).data : ""))
                    .join(" ")
                );

                anchorsList.push({ id, text: children, tag });

                return React.createElement(
                  tag,
                  {
                    id,
                    className: "scroll-mt-[var(--header-height)] group",
                  },
                  <Link
                    href={`#${id}`}
                    className="rounded transition-all text-neutral-100 outline-none focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
                  >
                    {children}
                    <LinkIcon className="ml-2 mb-1 p-1 inline-block opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                  </Link>
                );
              }

              if (domNode.type === "tag" && domNode.name === "a") {
                const content = domToReact(domNode.children as DOMNode[]);
                const href = domNode.attribs.href;

                return href.includes("http") ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={
                          `px-1 pr-2 py-0.5 underline outline-none group transition-all ` +
                          `rounded-md border border-neutral-800 ` +
                          `text-theme-color hover:text-neutral-100 bg-neutral-900 ` +
                          `focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
                        }
                      >
                        {content}
                        <ExternalLinkIcon className="size-3 inline-block align-top" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{href}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href={href}
                    className={
                      `px-1 pr-2 py-0.5 underline outline-none group transition-all ` +
                      `rounded-md border border-neutral-800 ` +
                      `text-theme-color hover:text-neutral-100 bg-neutral-900 ` +
                      `focus-visible:ring-neutral-100 focus-visible:ring-[3px] `
                    }
                  >
                    {content}
                  </Link>
                );
              }
            },
          });

        case "code": {
          return (
            <ArticleCodeBlock key={block.id} data={block.data as BlogCode} />
          );
        }

        case "quote":
          return (
            <ArticleQuoteBlock key={block.id} data={block.data as BlogQuote} />
          );
        default:
          return;
      }
    });

    setParsedBody(boddies);
    anchorCallback(anchorsList);
  }, [anchorCallback]);

  return (
    <article
      id={articleId}
      className={
        `min-w-0 flex flex-col rounded-md [&_p]:pb-6 [&_p]:text-neutral-400 [&_p]:font-medium [&_strong]:text-neutral-400 ` +
        `[&_p_strong]:text-neutral-300 ` +
        `[&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:hover:text-neutral-100 [&_p_a]:transition-all ` +
        `[&_p_a]:bg-neutral-900 [&_p_a]:border [&_p_a]:border-neutral-800 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded-md ` +
        `[&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-900 [&_p_mark]:border [&_p_mark]:border-neutral-800 ` +
        `[&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded-md ` +
        `[&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 ` +
        `[&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 ` +
        `[&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc ` +
        `[&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal ` +
        `[&_blockquote_p]:pb-0 `
      }
    >
      {parsedBody}
    </article>
  );
};
