import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 shrink-0 outline-none cursor-pointer whitespace-nowrap text-sm font-medium rounded-md transition-all` +
    ` [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0` +
    ` focus-visible:border-neutral-500/75 focus-visible:ring-neutral-100 focus-visible:ring-[3px]` +
    ` disabled:pointer-events-none disabled:opacity-50`,
  {
    variants: {
      variant: {
        default: "text-neutral-100 bg-neutral-700",
        outline:
          "border border-neutral-700 shadow-xs bg-neutral-800 hover:bg-neutral-600/40 text-theme-color",
        destructive:
          "text-neutral-100 shadow-xs border border-red-900 bg-red-950 hover:bg-red-800/50 focus-visible:ring-red-500 focus-visible:border-red-500/50",
        link: "text-blue-500 border border-neutral-800 bg-neutral-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
