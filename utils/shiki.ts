import { escapeCharacters, cleanPreCodeBlocks } from "./strings";
import { createHighlighter } from "shiki";
import {
  // transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { DEFAULT_THEME, LANGS, THEMES } from "@/constants/shiki";

export const highlightCodeWithShiki = async ({
  filename,
  code,
  language,
}: {
  filename: string;
  code: string;
  language: string;
}) => {
  const highlighter = await createHighlighter({
    themes: THEMES,
    langs: LANGS,
  });
  // Decode escaped characters
  const htmlDecoded = escapeCharacters(code);

  // Remove <pre><code> tags from tiptap so they do not get rendered duplicated with shiki
  const cleaned = cleanPreCodeBlocks(htmlDecoded);

  const html = highlighter.codeToHtml(cleaned, {
    lang: language || "ts",
    theme: DEFAULT_THEME,
    transformers: [
      // transformerNotationDiff({
      //   matchAlgorithm: "v3",
      //   // https://shiki.style/packages/transformers#transformernotationdiff
      // }),
      transformerNotationHighlight({
        matchAlgorithm: "v3",
        // https://shiki.style/packages/transformers#transformernotationhighlight
      }),
      transformerNotationWordHighlight({
        matchAlgorithm: "v3",
        // https://shiki.style/packages/transformers#transformernotationwordhighlight
      }),
    ],
  });

  return html;
};
