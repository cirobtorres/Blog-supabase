"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { slugify } from "@/utils/strings";

export const AnchorTracker = ({ articleId }: { articleId: string }) => {
  const [anchorList, setAnchorList] = useState<{ [key: string]: string }[]>([]);
  const anchorListRef = useRef<HTMLDivElement>(null);

  const generatePaddingForSessions = (text: { [x: string]: string }) => {
    const heading = Object.values(text)[0];
    return heading.match(/<h[1][^>]*>(.*?)<\/h[1]>/gi)
      ? "pl-0"
      : heading.match(/<h[2][^>]*>(.*?)<\/h[2]>/gi)
      ? "pl-3"
      : heading.match(/<h[3][^>]*>(.*?)<\/h[3]>/gi)
      ? "pl-6"
      : heading.match(/<h[4][^>]*>(.*?)<\/h[4]>/gi)
      ? "pl-9"
      : heading.match(/<h[5][^>]*>(.*?)<\/h[5]>/gi)
      ? "pl-12"
      : "pl-[3.75rem]";
  };

  useEffect(() => {
    const linkAnchorsListener = () => {
      // Select article content
      const contentElement = document.getElementById(articleId);
      const header = document.getElementById("floating-header");
      const headerHeight = header?.offsetHeight ?? 0;

      if (!contentElement) return;

      // Retrieve all sections
      const allSections: NodeListOf<HTMLHeadingElement> =
        contentElement.querySelectorAll("h1, h2, h3, h4, h5, h6");

      // Get rid of sections with children, like shadcn/ui accordion buttons nested within h3 tags. These are not supposed to be anchors
      const sections = Array.from(allSections).filter(
        (section) => !section.querySelector("*")
      );

      let currentSectionIndex = 0;

      if (sections && sections.length > 0) {
        sections.forEach((section, index) => {
          const sectionRect = section.getBoundingClientRect();
          const sectionTop = sectionRect.top + window.scrollY - headerHeight;
          if (window.scrollY >= sectionTop) {
            currentSectionIndex = index;
          }
        });
        const links = anchorListRef.current?.querySelectorAll("li");

        links?.forEach((link, index) => {
          if (index === currentSectionIndex) {
            link.setAttribute("aria-current", "page");
          } else {
            link.setAttribute("aria-current", "false");
          }
        });
      }
    };

    window.addEventListener("scroll", linkAnchorsListener);
    return () => {
      window.removeEventListener("scroll", linkAnchorsListener);
    };
  }, [articleId]);

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
          "w-full" +
          " self-start max-w-72 sticky top-20 mb-4 col-start-1 max-[800px]:col-start-auto" +
          " max-[800px]:self-auto max-[800px]:max-w-full max-[800px]:static max-[800px]:pt-0"
        }
      >
        <p className="px-2 mb-1 rounded focus-visible:outline-2 focus-visible:outline-white">
          Conteúdo
        </p>
        <div
          ref={anchorListRef}
          className="max-h-[50vh] relative py-1 before:absolute before:top-0 before:left-0 before:bottom-0 before:my-1 before:w-0.5 before:bg-neutral-800"
        >
          {anchorList.map((text, index) => {
            const ariaLabel = Object.values(text)[0].replace(
              /<\/?h[1-6][^>]*>/gi,
              ""
            ); // Replaces <h2>Example Title</h2> to Example Title
            return (
              <li
                key={index}
                aria-current={index === 0 ? "page" : "false"} // When page loads, the first link is supposed to be the colored one
                aria-label={`Ir até a sessão: ${ariaLabel}`}
                className="relative list-none pl-2 pr-1 after:absolute after:top-0 after:left-0 after:w-0.5 after:h-full after:bg-transparent"
              >
                <Link
                  href={`#${Object.keys(text)}`}
                  className={`flex text-sm transition-colors duration-500 break-words rounded hover:text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:text-white focus-visible:bg-neutral-800/50 ${generatePaddingForSessions(
                    text
                  )}`}
                >
                  {ariaLabel}
                </Link>
              </li>
            );
          })}
        </div>
      </nav>
    )
  );
};

const extractAnchors = (htmlString: string): { [key: string]: string }[] => {
  const anchorList: { [key: string]: string }[] = [];
  const regex = /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi;
  let match;

  while ((match = regex.exec(htmlString)) !== null) {
    const [, tag, attributes, content] = match;
    // Skip if content has HTML tags like <b> <strong> <i> <strike> <u>
    // Ex: <h1>Example <b>1</b></h1>
    if (/<[^>]+>/.test(content)) continue;

    // Get id or generate one
    const idMatch = attributes.match(/id="([^"]*)"/);
    const id = idMatch ? idMatch[1] : slugify(content);

    anchorList.push({ [id]: `<${tag}>${content}</${tag}>` });
  }

  return anchorList;
};
