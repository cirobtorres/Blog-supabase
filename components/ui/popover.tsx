"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/utils/classnames";

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          `z-50 min-w-40 p-1 shadow-md outline-hidden ` +
            `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 ` +
            `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ` +
            `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ` +
            `origin-(--radix-popover-content-transform-origin) ` +
            `backdrop-blur-md bg-[hsla(0,0%,7%,0.25)] text-neutral-200 text-sm ` +
            `rounded-lg border border-neutral-800 `,
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverContentClipPath({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          `z-50 min-w-40 p-1 shadow-md outline-hidden ` +
            `data-[state=open]:animate-circular-open data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 ` +
            `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ` +
            `data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ` +
            `origin-(--radix-popover-content-transform-origin) ` +
            `backdrop-blur-md bg-[hsla(0,0%,7%,0.25)] text-neutral-200 text-sm ` +
            `rounded-lg border border-neutral-800 `,
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverContentClipPath,
  PopoverAnchor,
};
