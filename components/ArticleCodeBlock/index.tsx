import { formatCodeBlockLanguage } from "@/utils/strings";
import ArticleCopyCodeButton from "../ArticleCopyCodeButton";
import { BundledLanguage } from "shiki";
import { highlightCodeWithShiki } from "@/utils/shiki";
import { useEffect, useState } from "react";

export const ArticleCodeBlock = ({
  data: { filename, language, code },
}: {
  data: BlogCode;
}) => {
  const [shikiCode, setShikiCode] = useState<string>("");

  useEffect(() => {
    (async () => {
      const highlightedCode = await highlightCodeWithShiki({
        filename,
        language,
        code,
      });
      setShikiCode(highlightedCode);
    })();
  }, [filename, language, code]);

  return (
    <div className="overflow-hidden mb-8 rounded border border-neutral-600 bg-[#1E1E1E] group">
      <div className="flex justify-between p-3 font-medium text-sm border-b border-neutral-600">
        <p className="pb-0! text-neutral-300">{filename}</p>
        <p className="pb-0! text-neutral-500">
          {formatCodeBlockLanguage(language as BundledLanguage)}
        </p>
      </div>
      <div className="relative">
        <div
          dangerouslySetInnerHTML={{
            __html: shikiCode,
          }}
          className="overflow-x-auto max-w-full min-w-0 [&_pre_code]:py-4"
        />
        <ArticleCopyCodeButton
          code={code}
          className="transition-opacity duration-200 absolute top-1 right-1 bg-[#1e1e1e]" // opacity-0 group-hover:opacity-100
        />
      </div>
    </div>
  );
};
