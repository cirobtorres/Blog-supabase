"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/classnames";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/constants/adminMenu";

export default function AdminMenu() {
  const pathname = usePathname();

  return (
    <div className="z-20 w-[calc(36px_+_8px_+_1px)]">
      <nav className="z-10 w-12 absolute top-0 bottom-0 bg-neutral-950 border-r border-neutral-800 hover:w-[200px] transition-width duration-100">
        <ul className="sticky top-0 flex flex-col p-1 gap-1">
          {MENU_ITEMS.map((item) => (
            <li key={item.key} className="group">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-xs whitespace-nowrap overflow-hidden border border-transparent outline-none transition-all duration-300 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-theme-color",
                  pathname && pathname.includes(item.href)
                    ? "[&_svg]:stroke-neutral-100 [&_span]:text-neutral-100 border-theme-color bg-theme-color-backdrop"
                    : "hover:bg-neutral-800 hover:border-neutral-700"
                )}
              >
                {item.icon({
                  className:
                    "size-9 shrink-0 p-2.5 stroke-neutral-500 group-hover:stroke-neutral-100",
                })}
                <span className="px-2 text-xs text-neutral-500 group-hover:text-neutral-100">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
