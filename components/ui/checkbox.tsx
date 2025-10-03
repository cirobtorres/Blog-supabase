"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/utils/classnames";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-6 shrink-0 rounded " +
          "transition-shadow outline-none shadow-xs border border-neutral-700 " +
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive " +
          "data-[state=checked]:text-neutral-100 data-[state=checked]:border-theme-color data-[state=checked]:bg-theme-color-light " +
          "focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:border-transparent " +
          "disabled:cursor-not-allowed disabled:opacity-50 ",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
