"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils/classnames";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "w-fit z-50 px-3 py-1 rounded-xs text-xs text-balance border border-neutral-800 text-neutral-100 bg-neutral-900 animate-in fade-in-0 zoom-in-95 outline-none ring-2 ring-offset-2 ring-neutral-500 ring-offset-neutral-950 origin-(--radix-tooltip-content-transform-origin) data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2",
          className
        )}
        {...props}
      >
        {children}
        {/* <TooltipPrimitive.Arrow className="bg-neutral-100 fill-neutral-100 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" /> */}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

function ToolTipWrapper({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={0}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export default ToolTipWrapper;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
