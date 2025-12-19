import { useState } from "react";
import { cn } from "../../../utils/classnames";
import { CheckIcon, CopyCodeIcon } from "../../Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

export default function CopyToClipboardButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [disable, setDisable] = useState(false);

  const handleCopy = () => {
    if (!code) return;

    navigator.clipboard.writeText(code);

    setCopied(true);
    setDisable(true);

    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setDisable(false), 2000);
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
                "border border-neutral-700 " +
                "hover:bg-neutral-800",
              className
            )}
          >
            <CheckIcon
              className={cn(
                "absolute size-4 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 stroke-neutral-400",
                copied ? "visible animate-pop" : "invisible"
              )}
            />
            <CopyCodeIcon
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
