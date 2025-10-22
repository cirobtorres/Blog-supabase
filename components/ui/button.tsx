import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/classnames";
import { buttonVariants } from "../../styles/classNames";
import { type VariantProps } from "class-variance-authority";

function Button({
  className,
  variant,
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
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button };
