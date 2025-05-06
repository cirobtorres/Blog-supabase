"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { slugify } from "@/utils/strings";

export const AnchorTracker = ({ articleId }: { articleId: string }) => {
  const [anchorList, setAnchorList] = useState<{ [key: string]: string }[]>([]);
  const anchorListRef = useRef<HTMLDivElement>(null);

  const generatePaddingForSessions = (text: { [x: string]: string }) => {
    // Flag g (global): all occurrencies; // Flag i: case-insensitive
    return Object.values(text)[0].match(/<h[1][^>]*>(.*?)<\/h[1]>/gi)
      ? "pl-0"
      : Object.values(text)[0].match(/<h[2][^>]*>(.*?)<\/h[2]>/gi)
      ? "pl-3"
      : Object.values(text)[0].match(/<h[3][^>]*>(.*?)<\/h[3]>/gi)
      ? "pl-6"
      : Object.values(text)[0].match(/<h[4][^>]*>(.*?)<\/h[4]>/gi)
      ? "pl-9"
      : Object.values(text)[0].match(/<h[5][^>]*>(.*?)<\/h[5]>/gi)
      ? "pl-12"
      : "pl-[3.75rem]";
  };

  useEffect(() => {
    const linkAnchorsListener = () => {
      // Select article content
      const contentElement = document.getElementById(articleId);
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
          const sectionTop = sectionRect.top + window.scrollY;
          if (window.scrollY >= sectionTop - 1) {
            currentSectionIndex = index;
          }
        });
        const links = anchorListRef.current?.querySelectorAll("li a");

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
          " self-start max-w-72 sticky top-14 mb-4 col-start-1 max-[800px]:col-start-auto" +
          " max-[800px]:self-auto max-[800px]:max-w-full max-[800px]:static max-[800px]:pt-0"
        }
      >
        <p className="px-2 mb-1 rounded focus-visible:outline-2 focus-visible:outline-white">
          Conteúdo
        </p>
        <div
          ref={anchorListRef}
          className="py-1 max-h-[50vh] relative before:absolute before:top-0 before:left-0 before:bottom-0 before:my-2 before:w-0.5 before:bg-neutral-800"
        >
          {anchorList.map((text, index) => (
            <li key={index} className="list-none relative pl-2 pr-1 mb-1">
              <Link
                href={`#${Object.keys(text)}`}
                aria-label={`Ir para ${Object.values(text)[0]}`}
                aria-current={index === 0 ? "page" : "false"} // When pages load, the first anchor is supposed to be the colored one
                className={
                  `flex text-sm text-neutral-400 transition-colors duration-500 break-words hover:text-white` +
                  ` ${generatePaddingForSessions(text)}` +
                  ` after:absolute after:left-0 aria-current:after:bg-teal-500` +
                  ` after:w-0.5 after:h-full after:bg-transparent` +
                  ` rounded focus-visible:outline-2 focus-visible:outline-white` +
                  ` focus-visible:text-white focus-visible:bg-neutral-800/50`
                }
              >
                {
                  Object.values(text)[0].replace(/<\/?h[1-6][^>]*>/gi, "")
                  // Replaces <h2>Example Title</h2> to Example Title
                }
              </Link>
            </li>
          ))}
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

export const addIdsToHeadings = (htmlString: string) => {
  return htmlString.replace(/<(h[1-6])>(.*?)<\/\1>/g, (match, tag, content) => {
    const id = slugify(content);
    return `<${tag} id="${id}" tabIndex="0">${content}</${tag}>`;
  });
};
