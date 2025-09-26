"use client";

import { ArticleCodeBlock } from "../ArticleCodeBlock";
import { ArticleTextBlock } from "../ArticleTextBlock";
import { ArticleQuoteBlock } from "../ArticleQuoteBlock";

const isTextBlock = (block: Block) =>
  block.type === "text" &&
  block.data &&
  typeof block.data === "object" &&
  "body" in block.data;

const isQuoteBlock = (block: Block) =>
  block.type === "quote" &&
  block.data &&
  typeof block.data === "object" &&
  "author" in block.data &&
  "quote" in block.data;

const isCodeBlock = (block: Block) =>
  block.type === "code" &&
  block.data &&
  typeof block.data === "object" &&
  "filename" in block.data &&
  "code" in block.data &&
  "language" in block.data;

// TODO: LAZY ARTICLEBODY
// export const ArticleBody = ({ blocks }: { blocks: Block[] }) => {
//   const [renderedBlocks, setRenderedBlocks] = useState<React.JSX.Element[]>([]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       for (const block of blocks) {
//         if (cancelled) break;

//         await new Promise((r) => setTimeout(r, 0)); // libera thread

//         setRenderedBlocks((prev) => {
//           const element = isTextBlock(block) ? (
//             <TextBlock key={block.id} block={block as ArticleBodyText} />
//           ) : isCodeBlock(block) ? (
//             <CodeBlock key={block.id} block={block as ArticleBodyCode} />
//           ) : null;
//           return element ? [...prev, element] : prev;
//         });
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [blocks]);

//   return <>{renderedBlocks}</>;
// };

export const ArticleBody = ({
  articleId,
  blocks,
}: {
  articleId: string;
  blocks: Block[];
}) => {
  return (
    <article id={articleId} className="min-w-0">
      {blocks.map((block) => {
        switch (block.type) {
          case "text":
            if (isTextBlock(block)) {
              return (
                <ArticleTextBlock
                  key={block.id}
                  {...(block as ArticleBodyText)}
                />
              );
            }
            return null;
          case "code":
            if (isCodeBlock(block)) {
              return (
                <ArticleCodeBlock
                  key={block.id}
                  {...(block as ArticleBodyCode)}
                />
              );
            }
          case "quote":
            if (isQuoteBlock(block)) {
              return (
                <ArticleQuoteBlock
                  key={block.id}
                  {...(block as ArticleQuoteText)}
                />
              );
            }
            return null;
        }
      })}
    </article>
  );
};
