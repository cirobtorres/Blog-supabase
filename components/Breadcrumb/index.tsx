"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export const ArticleBreadcrumb = () => {
  const pathname = usePathname();
  const [, articles, article] = pathname.split("/");

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href="/"
            className="transition-all hover:text-neutral-100 rounded outline-none focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
          >
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link
            href="/articles"
            className="transition-all hover:text-neutral-100 rounded outline-none focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
          >
            {articles}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{article}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
