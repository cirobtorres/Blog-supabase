import { cn } from "@/utils/classnames";
import { cva } from "class-variance-authority";

const focusVisibleThemeRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 focus-visible:ring-theme-color focus-visible:opacity-100";

const focusWithinThemeRing =
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-theme-color focus-within:ring-offset-neutral-950";

const hoverThemeRing =
  "hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-neutral-950 hover:ring-theme-color hover:opacity-100";

const focusVisibleWhiteRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-neutral-950";

const focusWithinWhiteRing =
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-neutral-100 focus-within:ring-offset-neutral-950";

const hoverWhiteRing =
  "hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-neutral-950 hover:ring-neutral-100 hover:opacity-100";

const buttonVariants = cva(
  "transition-all duration-300 inline-flex items-center justify-center gap-2 px-3 py-1.5 has-[>svg]:px-3 shrink-0 outline-none cursor-pointer whitespace-nowrap text-sm font-medium rounded-xs [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-neutral-100 border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-[#202020] focus-visible:bg-[#202020]",
        disabled:
          "text-neutral-100 border border-neutral-700 bg-neutral-900 hover:border-neutral-600 hover:bg-[#202020] focus-visible:bg-[#202020] pointer-events-none opacity-50",
        outline:
          "text-theme-color border border-neutral-800 bg-neutral-900 hover:border-neutral-700 hover:bg-[#202020] focus-visible:bg-neutral-900",
        destructive:
          "text-neutral-100 border border-red-900 hover:border-red-800 bg-red-950 hover:bg-red-800/50 focus-visible:bg-red-800/50 [&_svg]:stroke-neutral-100",
        link: "underline underline-offset-4 text-blue-500 [&_svg]:stroke-blue-500",
      },
      focus: {
        default: focusVisibleWhiteRing,
        themed: focusWithinThemeRing,
      },
    },
    defaultVariants: {
      variant: "default",
      focus: "default",
    },
  }
);

const getUniformTipTapClassName = (func: boolean) =>
  cn(
    `flex justify-center items-center outline-none transition-all cursor-pointer rounded border ${
      func
        ? "text-theme-color border-neutral-600 bg-neutral-700 hover:bg-neutral-600"
        : "border-neutral-700 hover:bg-neutral-700 hover:border-neutral-600 bg-neutral-800"
    }`,
    focusVisibleWhiteRing
  );

export {
  focusVisibleThemeRing,
  focusWithinThemeRing,
  hoverThemeRing,
  focusVisibleWhiteRing,
  focusWithinWhiteRing,
  hoverWhiteRing,
  buttonVariants,
  getUniformTipTapClassName,
};
