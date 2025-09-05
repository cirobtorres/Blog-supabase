"use client";

import * as cheerio from "cheerio";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export const AnchorTracker = ({ articleId }: { articleId: string }) => {
  const [anchorList, setAnchorList] = useState<{ [key: string]: string }[]>([]);
  const anchorListRef = useRef<HTMLUListElement>(null);

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

  useEffect(() => {
    if (anchorList.length === 0) return;

    const linkAnchorsListener = () => {
      const header = document.getElementById("floating-header");
      const headerHeight = header?.offsetHeight ?? 0;

      let currentSectionIndex = 0;

      anchorList.forEach((item, index) => {
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
  }, [anchorList]);

  useEffect(() => {
    const contentElement = document.getElementById(articleId);
    if (contentElement) {
      const anchors = extractAnchors(contentElement.innerHTML);
      setAnchorList(anchors);
    }
  }, [articleId]);

  return (
    anchorList &&
    anchorList.length > 0 && (
      <nav
        className={
          "w-full border border-neutral-800 rounded-lg p-4 backdrop-blur-sm bg-neutral-950/50" +
          " self-start sticky top-20 col-start-1 max-[800px]:col-start-auto" +
          " max-[800px]:self-auto max-[800px]:static"
        }
      >
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="pr-2 hover:bg-neutral-900 cursor-pointer">
              <p className="text-lg px-2 rounded focus-visible:outline-2 focus-visible:outline-neutral-100">
                Conteúdo
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 relative">
                <ul
                  ref={anchorListRef}
                  className="scrollbar max-h-[450px] overflow-y-auto py-1 before:absolute before:top-0 before:left-0 before:bottom-0 before:my-1 before:w-0.5 before:bg-neutral-800 pr-1"
                >
                  {anchorList.map((item, index) => {
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
                          className={
                            `flex text-sm transition-all break-words rounded outline-none hover:text-neutral-100` +
                            ` focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] focus-visible:bg-neutral-800/50 ` +
                            generatePaddings(tag)
                          }
                        >
                          {text}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </nav>
    )
  );
};

const extractAnchors = (
  htmlString: string
): { id: string; text: string; tag: string }[] => {
  const anchorList: { id: string; text: string; tag: string }[] = [];
  const $ = cheerio.load(htmlString);

  $("h2, h3, h4").each((_, el) => {
    const heading = $(el);
    const id = heading.attr("id");
    if (!id) return;

    const anchor = heading.find("a");
    const text = anchor.clone().children().remove().end().text().trim();
    const tag = heading[0].tagName.toLowerCase();

    anchorList.push({ id, text, tag });
  });

  return anchorList;
};
