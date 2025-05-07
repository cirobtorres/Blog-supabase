import * as cheerio from "cheerio";
import { slugify } from "./strings";

// Client only

export const transformHeadings = (body: string) => {
  const $ = cheerio.load(body);
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const tag = $(el);
    const tagName = tag[0].tagName;
    const text = tag.text();
    const id = slugify(text);
    const heading = `<${tagName} id="${id}" class="scroll-mt-[var(--header-height)] peer">${text}</${tagName}>`;
    const anchor = `<a href="#${id}">${heading}</a>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-link-icon lucide-link transition-opacity opacity-0 peer-hover:opacity-100">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>`;
    const wrapper = `<div class="flex items-center gap-4 pt-8 mb-4">${anchor}${svg}</div>`;
    tag.replaceWith(wrapper);
  });

  return $.html();
};
