import { focusWithinWhiteRing, hoverWhiteRing } from "@/styles/classNames";
import { cn } from "@/utils/classnames";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import {
  DeleteEditorButton,
  DragEditorButton,
  LockEditorButton,
  PushEditorDownButton,
} from "../Buttons/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function BlkEdWrapperAccordion({
  id,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & { id: string }) {
  const { setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <AccordionPrimitive.Root
      ref={setNodeRef}
      style={style}
      data-slot="accordion"
      {...props}
    />
  );
}

function BlkEdWrapperAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "w-full h-full transition-all duration-300 rounded-sm overflow-hidden border border-neutral-700",
        hoverWhiteRing,
        focusWithinWhiteRing,
        className
      )}
      {...props}
    />
  );
}

function BlkEdWrapperAccordionTrigger({
  id,
  label,
  className,
  onRemove,
  moveToNext,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  id: string;
  label: string;
  onRemove: React.MouseEventHandler<HTMLButtonElement>;
  moveToNext: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { attributes, listeners, isDragging } = useSortable({ id });

  return (
    <AccordionPrimitive.Header className="w-full flex items-center gap-4 bg-neutral-900">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "cursor-pointer flex-1 flex items-center gap-4 p-3 outline-none text-left text-sm font-medium disabled:pointer-events-none disabled:opacity-50 transition-all [&[data-state=open]>svg]:rotate-180 bg-neutral-900",
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
      <div className="w-full flex flex-0 p-1 items-center justify-center gap-1">
        <PushEditorDownButton moveToNext={moveToNext} />
        <LockEditorButton />
        <DeleteEditorButton onRemove={onRemove} />
        <DragEditorButton
          attributes={attributes}
          listeners={listeners}
          isDragging={isDragging}
        />
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

export default function BlockEditorWrapper({
  children,
  id,
  wrapperLabel,
  onRemove,
  moveToNext,
}: BlockEditorWrapperProps) {
  return (
    <BlkEdWrapperAccordion id={id} type="single" collapsible className="w-full">
      <BlkEdWrapperAccordionItem value="item-1">
        <BlkEdWrapperAccordionTrigger
          id={id}
          label={wrapperLabel}
          moveToNext={(e) => {
            e.stopPropagation();
            moveToNext(id);
          }}
          // e: React.MouseEvent<HTMLButtonElement, MouseEvent>
          onRemove={() => onRemove(id)}
        />
        <BlkEdWrapperAccordionContent>{children}</BlkEdWrapperAccordionContent>
      </BlkEdWrapperAccordionItem>
    </BlkEdWrapperAccordion>
  );
}
