"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { DeleteEditorButton, PushEditorDownButton } from "../Buttons/client";
import { MovableIcon } from "../Icons";
import { cn } from "@/utils/classnames";

function BlkEdWrapperAccordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function BlkEdWrapperAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "w-full h-full rounded-sm overflow-hidden transition-all duration-300 " +
          "border border-neutral-700 " +
          "hover:ring-2 hover:border-transparent hover:ring-theme-color " +
          "focus-within:ring-2 focus-within:border-transparent focus-within:ring-theme-color ",
        className
      )}
      {...props}
    />
  );
}

function BlkEdWrapperAccordionTrigger({
  label,
  className,
  onRemove,
  moveToNext,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  label: string;
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  moveToNext: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <AccordionPrimitive.Header className="w-full flex items-center gap-4 bg-neutral-900">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "cursor-pointer flex-1 flex items-center gap-4 p-3 outline-none " +
            "text-left text-sm font-medium " +
            "disabled:pointer-events-none disabled:opacity-50 " +
            "transition-all [&[data-state=open]>svg]:rotate-180 " +
            "bg-neutral-900 ",
          className
        )}
        {...props}
      >
        <ChevronDownIcon className="text-neutral-300 pointer-events-none size-4 shrink-0 transition-transform duration-200" />
        <p
          className="text-sm font-medium text-neutral-400" // transition-all group-focus-within:text-theme-color
        >
          {label}
        </p>
      </AccordionPrimitive.Trigger>
      <div className="w-full flex flex-0 p-3 items-center justify-center gap-4">
        <PushEditorDownButton moveToNext={moveToNext} />
        <DeleteEditorButton onRemove={onRemove} />
        <MovableIcon className="size-4 stroke-neutral-300" />
      </div>
    </AccordionPrimitive.Header>
  );
}

function BlkEdWrapperAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      style={{ height: "auto" }}
      className={cn(
        "w-full h-full text-sm border-t border-neutral-700 overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      {children}
    </AccordionPrimitive.Content>
  );
}

// ---
function ArticleAccordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function ArticleAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function ArticleAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-1 stroke-3 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function ArticleAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export {
  BlkEdWrapperAccordion,
  BlkEdWrapperAccordionItem,
  BlkEdWrapperAccordionTrigger,
  BlkEdWrapperAccordionContent,
  ArticleAccordion,
  ArticleAccordionItem,
  ArticleAccordionTrigger,
  ArticleAccordionContent,
};
