"use client";

import { cn } from "../../../../utils/classnames";
import { PlusIcon } from "../../../../components/Icons";
import { focusVisibleWhiteRing } from "../../../../styles/classNames";

export default function AddFolder() {
  return (
    <button
      type="submit"
      onClick={() => console.log("Criar Pasta")}
      className={cn(
        "w-40 cursor-pointer flex justify-center items-center gap-2 rounded px-2 py-1 text-sm border duration-300 outline-none text-theme-color border-neutral-800 bg-neutral-900",
        focusVisibleWhiteRing
      )}
    >
      <PlusIcon className="size-4" /> Criar Pasta
    </button>
  );
}
