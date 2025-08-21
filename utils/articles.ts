import * as cheerio from "cheerio";
import { slugify } from "./strings";

// Client only

export const transformHeadings = (body: string) => {
  const $ = cheerio.load(body);
  $("h2, h3, h4").each((_, el) => {
    const tag = $(el);
    const tagName = tag[0].tagName;
    const text = tag.text();
    const id = slugify(text);
    const svg = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-link-icon lucide-link inline-block ml-2 mb-1 shrink-0 transition-opacity opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>`;
    const heading = `<a href="#${id}" tabindex="-1" class="rounded outline-none pr-2 text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px] group">${text}${svg}</a>`;
    const wrapper = `<${tagName} id="${id}" class="inline-block transition-all scroll-mt-[var(--header-height)]">${heading}</${tagName}>`;
    tag.replaceWith(wrapper);
  });
  return $.html();
};

export const addSvgToExternalLinks = (
  body: string,
  currentHost: string
): string => {
  const $ = cheerio.load(body);

  const svg = `<svg
    data-testid="geist-icon"
    height="16"
    stroke-linejoin="round"
    style="color:currentColor"
    viewBox="0 0 16 16"
    width="16"
    class="inline-block align-top"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.75011 4H6.00011V5.5H6.75011H9.43945L5.46978 9.46967L4.93945 10L6.00011 11.0607L6.53044 10.5303L10.499 6.56182V9.25V10H11.999V9.25V5C11.999 4.44772 11.5512 4 10.999 4H6.75011Z"
      fill="currentColor">
    </path>
  </svg>`;

  // const svg = `<svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   width="18"
  //   height="18"
  //   viewBox="0 0 28 28"
  //   fill="none"
  //   stroke="currentColor"
  //   stroke-width="2"
  //   stroke-linecap="round"
  //   stroke-linejoin="round"
  //   class="lucide lucide-external-link-icon lucide-external-link inline-block ml-1"
  // >
  //   <path d="M15 3h6v6"/>
  //   <path d="M10 14 21 3"/>
  //   <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  // </svg>`;

  $("p a").each((_, el) => {
    const a = $(el);
    const href = a.attr("href") || "";
    const isInHeading = a.parents("h1, h2, h3, h4, h5, h6").length > 0;

    let isExternal = false;
    try {
      const url = new URL(href, `http://${currentHost}`);
      isExternal = url.hostname !== currentHost;
    } catch (e) {
      // URL inválida ou relativa malformada — ignora
    }

    if (!isInHeading && isExternal) {
      a.append(svg);
    }
  });

  return $.html();
};

export const addBreakline = (body: string) =>
  body.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "<br />");
