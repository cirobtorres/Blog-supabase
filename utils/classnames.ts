import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type ClassValue = string | number | null | undefined | boolean;

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
