import { useState } from "react";
import { cn } from "@/utils/classnames";
import { CheckIcon, CopyCodeIcon } from "../Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function ArticleCopyCodeButton({
  code,
  iconSize = 24,
  className,
}: {
  code: string;
  iconSize?: number;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [disable, setDisable] = useState(false);

  const handleCopy = () => {
    const codeContent = new DOMParser().parseFromString(code, "text/html").body
      .innerText;

    if (codeContent) {
      navigator.clipboard.writeText(codeContent);

      setCopied(true);
      setDisable(true);

      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setDisable(false), 2000);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={disable ? true : undefined}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            disabled={disable}
            className={cn(
              "flex justify-center items-center rounded size-9 " +
                "cursor-pointer disabled:cursor-auto disabled:bg-neutral-800 " +
                "border border-neutral-600 " +
                "hover:bg-neutral-800",
              className
            )}
          >
            <CheckIcon
              size={iconSize}
              className={cn(
                "absolute size-4 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 stroke-neutral-400",
                copied ? "visible animate-pop" : "invisible"
              )}
            />
            <CopyCodeIcon
              size={iconSize}
              className={cn(
                "absolute size-4 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 stroke-neutral-400",
                copied ? "invisible" : "visible"
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copiado!" : "Copiar"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
