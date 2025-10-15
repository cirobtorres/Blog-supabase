import { cva } from "class-variance-authority";

export const focusVisibleThemeRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:ring-theme-color focus-visible:opacity-100";

export const focusVisibleWhiteRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-neutral-950 focus-visible:text-neutral-100 ";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 shrink-0 outline-none cursor-pointer whitespace-nowrap text-sm font-medium rounded-xs transition-all duration-300 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:ring-neutral-100 focus-visible:ring-2 focus-visible:border-transparent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-neutral-100 border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-[#202020] focus-visible:bg-[#202020]",
        disabled: "",
        outline:
          "text-theme-color border border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900 focus-visible:bg-neutral-900",
        destructive:
          "text-neutral-100 border border-red-900 bg-red-950 hover:bg-red-800/50 focus-visible:ring-red-500 focus-visible:border-red-500/50",
        link: "text-blue-500 border border-neutral-800 bg-neutral-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
