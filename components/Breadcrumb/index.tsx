"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ArticleBreadcrumb = () => {
  const pathname = usePathname();
  const pathnameSplit = pathname.split("/");
  const svg = (
    <svg viewBox="0 0 24 24" className="css-s3mb0o">
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  );

  return <nav></nav>;
};
