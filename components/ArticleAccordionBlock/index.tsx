import React from "react";
import parse, { DOMNode, domToReact } from "html-react-parser";
import {
  ArticleAccordion,
  ArticleAccordionContent,
  ArticleAccordionItem,
  ArticleAccordionTrigger,
} from "../ui/accordion";
import ArticleLink from "../ArticleLink";
import ArticleP from "../ArticleP";

export default function ArticleAccordionBlock({
  accordions,
}: {
  accordions: Accordion[];
}) {
  const newAccordions = accordions.map((acc) => {
    const replace = (domNode: DOMNode) => {
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
    };

    return {
      ...acc,
      message: parse(acc.message, { replace }),
    };
  });
  return (
    <ArticleAccordion type="multiple">
      {newAccordions.map((acc) => (
        <ArticleAccordionItem
          key={acc.id}
          value={acc.id}
          className="border-neutral-700"
        >
          <ArticleAccordionTrigger className="cursor-pointer hover:text-neutral-100 text-neutral-500 [&[data-state=open]]:text-neutral-100">
            {acc.title}
          </ArticleAccordionTrigger>
          <ArticleAccordionContent
            className="pt-px" // Do not remove
          >
            {acc.message}
          </ArticleAccordionContent>
        </ArticleAccordionItem>
      ))}
    </ArticleAccordion>
  );
}
