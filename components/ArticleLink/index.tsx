import Link from "next/link";
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ExternalLinkIcon } from "../Icons";
import { cn } from "../../utils/classnames";
import { focusVisibleWhiteRing } from "../../styles/classNames";

export default function ArticleLink({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={cn(
            "px-1 pr-2 py-0.5 underline outline-none group transition-all duration-300 rounded-md border border-neutral-800 text-theme-color hover:text-neutral-100 bg-neutral-900",
            focusVisibleWhiteRing
          )}
        >
          {text}
          {!href.includes("http://localhost") && (
            <ExternalLinkIcon className="size-3 inline-block align-top" />
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent sideOffset={10}>
        <p>{href}</p>
      </TooltipContent>
    </Tooltip>
  );
}
