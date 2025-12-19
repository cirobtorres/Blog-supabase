"use client";

import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import parse, { DOMNode, domToReact } from "html-react-parser";
import { LinkIcon } from "../Icons";
import { slugify } from "../../utils/strings";
import { ArticleCodeBlock } from "../ArticleCodeBlock";
import { ArticleQuoteBlock } from "../ArticleQuoteBlock";
import { cn } from "../../utils/classnames";
import { alertVariants, focusVisibleWhiteRing } from "../../styles/classNames";
import ArticleLink from "../ArticleLink";
import ArticleAccordionBlock from "../ArticleAccordionBlock";
import ArticleP from "../ArticleP";

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

          const replace = (domNode: DOMNode) => {
            if (domNode.type === "tag" && /^h[1-6]$/.test(domNode.name)) {
              if (["h1", "h5", "h6"].includes(domNode.name)) {
                return null; // Throw away these tags
              }
              const tag = domNode.name;
              const children = domToReact(domNode.children as DOMNode[], {
                replace,
              });
              const id = slugify(
                domNode.children
                  .map((c) => (c.type === "text" ? c.data : ""))
                  .join(" ")
              );

              anchorsList.push({ id, text: children, tag });

              return React.createElement(
                tag,
                {
                  id,
                  className: cn(
                    "transition-shadow duration-300 scroll-mt-[var(--header-height)] group",
                    focusVisibleWhiteRing
                  ),
                },
                <Link
                  href={`#${id}`}
                  className={cn(
                    "rounded text-neutral-100",
                    focusVisibleWhiteRing
                  )}
                >
                  {children}
                  <LinkIcon className="ml-2 mb-1 p-1 inline-block opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                </Link>
              );
            }

            if (domNode.type === "tag" && domNode.name === "a") {
              const href = domNode.attribs.href;
              const text = domToReact(domNode.children as DOMNode[], {
                replace,
              });

              return <ArticleLink href={href} text={text as string} />;
            }

            if (domNode.type === "tag" && domNode.name === "p") {
              const text = domToReact(domNode.children as DOMNode[], {
                replace,
              });
              return <ArticleP text={text as string} />;
            }

            if (domNode.type === "tag" && domNode.name === "table") {
              // TODO
              // const tag = domNode.name;
              // const children = domToReact(domNode.children as DOMNode[], {
              //   replace,
              // });
            }
          };

          return parse(body, {
            replace,
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

        case "accordion":
          return (
            <ArticleAccordionBlock
              key={block.id}
              accordions={(block.data as BlogAccordion).accordions}
            />
          );

        case "alert":
          return (
            <div
              key={block.id}
              dangerouslySetInnerHTML={{
                __html: (block.data as BlogAlert)?.body,
              }}
              className={alertVariants({ variant: block.type })}
            />
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
      className="min-w-0 flex flex-col [&_strong]:text-neutral-300 [&_p_strong]:text-neutral-200 [&_p_a]:text-theme-color [&_p_a]:underline [&_p_a]:hover:text-neutral-100 [&_p_a]:transition-all [&_p_a]:bg-neutral-900 [&_p_a]:border [&_p_a]:border-neutral-800 [&_p_a]:px-1 [&_p_a]:py-0.5 [&_p_a]:rounded [&_p_mark]:text-neutral-100 [&_p_mark]:bg-neutral-900 [&_p_mark]:border [&_p_mark]:border-neutral-800 [&_p_mark]:px-1 [&_p_mark]:py-0.5 [&_p_mark]:rounded [&_h2]:text-[2rem] [&_h2]:font-bold [&_h2]:pb-6 [&_h3]:text-2xl [&_h4]:text-xl [&_h3]:pb-6 [&_h4]:pb-6 [&_ul]:pb-6 [&_ul_li:last-child_p]:pb-0 [&_ul]:ml-5 [&_ul_li]:list-disc [&_ol]:pb-6 [&_ol_li:last-child_p]:pb-0 [&_ol]:ml-5 [&_ol_li]:list-decimal [&_blockquote_p]:pb-0 [&_table_p]:p-1 [&_table]:border-spacing-0 [&_table]:border [&_table]:border-neutral-700 [&_table_th]:bg-neutral-800 [&_table_th]:border [&_table_th]:border-neutral-700 [&_table_td]:border [&_table_td]:border-neutral-700" // [&_p]:pb-6
    >
      {parsedBody}
    </article>
  );
};
