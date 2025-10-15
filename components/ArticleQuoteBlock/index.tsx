export const ArticleQuoteBlock = ({
  data: { author, quote },
}: {
  data: BlogQuote;
}) => (
  <div
    className={
      `relative w-full p-4 border-y-4 border-neutral-800 ` +
      `after:w-20 after:bg-theme-color after:h-1 after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 ` +
      `before:w-20 before:bg-theme-color before:h-1 before:absolute before:left-1/2 before:-translate-x-1/2 before:-top-1 `
    }
  >
    <blockquote
      dangerouslySetInnerHTML={{
        __html: quote,
      }}
      className={
        `relative text-neutral-400 italic mb-4 border-l-transparent ml-0 mr-0 overflow-hidden pl-10 pr-6 ` +
        `[&_p]:indent-0 [&_p]:break-all [&_p]:mb-0 font-[Georgia,"Times_New_Roman",Times,serif] ` +
        `[&_p:first-child]:before:content-["“"] [&_p:first-child]:before:text-7xl ` +
        `[&_p:first-child]:before:absolute [&_p:first-child]:before:-top-1 [&_p:first-child]:before:-left-0 ` +
        `[&_p:first-child]:after:content-["”"] [&_p:first-child]:after:text-7xl ` +
        `[&_p:first-child]:after:absolute [&_p:first-child]:after:-bottom-2 [&_p:first-child]:after:indent-2 [&_p:first-child]:after:leading-1 `
      }
    />
    <div
      dangerouslySetInnerHTML={{
        __html: author,
      }}
      className={
        `text-neutral-400 italic pl-10 ` +
        `relative before:absolute before:content-["—"] ` +
        `before:-top-0.5 before:right-[calc(100%_-_2.25rem)] `
      }
    />
  </div>
);
