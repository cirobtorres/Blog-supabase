"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArticleAccordion,
  ArticleAccordionContent,
  ArticleAccordionItem,
  ArticleAccordionTrigger,
} from "../ui/accordion";
import { cn } from "../../utils/classnames";

export const AnchorTracker = ({ anchors }: { anchors: AnchorTracher }) => {
  const anchorListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (anchors.length === 0) return;

    const linkAnchorsListener = () => {
      const header = document.getElementById("floating-header");
      const headerHeight = header?.offsetHeight ?? 0;

      let currentSectionIndex = 0;

      anchors.forEach((item, index) => {
        const section = document.getElementById(item.id);
        if (!section) return;

        const sectionTop =
          section.getBoundingClientRect().top + window.scrollY - headerHeight;

        if (window.scrollY >= sectionTop) {
          currentSectionIndex = index;
        }
      });

      const links = anchorListRef.current?.querySelectorAll("li");
      links?.forEach((link, index) => {
        link.setAttribute(
          "aria-current",
          index === currentSectionIndex ? "true" : "false"
        );
      });
    };

    window.addEventListener("scroll", linkAnchorsListener);
    return () => {
      window.removeEventListener("scroll", linkAnchorsListener);
    };
  }, [anchors]);

  return (
    <article className="text-sm">
      {anchors && anchors.length > 0 && (
        <nav
          className={
            "w-full border border-neutral-700 rounded-lg p-4 backdrop-blur-sm bg-neutral-900 " +
            "self-start sticky top-20 col-start-1 max-md:col-start-auto " +
            "max-md:self-auto max-md:static"
          }
        >
          <ArticleAccordion type="single" defaultValue="item-1" collapsible>
            <ArticleAccordionItem value="item-1">
              <ArticleAccordionTrigger className="pr-2 hover:bg-neutral-800 cursor-pointer">
                <p className="text-lg px-2 rounded focus-visible:outline-2 focus-visible:outline-neutral-100">
                  Conteúdo
                </p>
              </ArticleAccordionTrigger>
              <ArticleAccordionContent>
                <div className="mt-2 relative">
                  <ul
                    ref={anchorListRef}
                    className="scrollbar max-h-[450px] overflow-y-auto py-1 before:absolute before:top-0 before:left-0 before:bottom-0 before:my-1 before:w-0.5 before:bg-neutral-800 pr-1"
                  >
                    {anchors.map((item, index) => {
                      const { id, text, tag } = item;
                      return (
                        <li
                          key={index}
                          aria-current={index === 0 ? "true" : "false"} // When page loads, the first link is supposed to be the colored one
                          aria-label={`Ir até a sessão: ${text}`}
                          className="relative list-none pl-2 pr-1 py-1 after:absolute after:top-0 after:left-0 after:w-0.5 after:h-full after:bg-transparent"
                        >
                          <Link
                            href={`#${id}`}
                            className={cn(
                              "flex text-xs transition-all wrap-break-word rounded outline-none hover:text-neutral-100 focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50",
                              generatePaddings(tag)
                            )}
                          >
                            {text}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </ArticleAccordionContent>
            </ArticleAccordionItem>
          </ArticleAccordion>
        </nav>
      )}
    </article>
  );
};

const generatePaddings = (tag: string) => {
  switch (tag) {
    case "h2":
      return "pl-0";
    case "h3":
      return "pl-3";
    case "h4":
      return "pl-6";
    default:
      return "pl-0";
  }
};
