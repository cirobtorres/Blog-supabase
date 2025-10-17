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
import { cn } from "../../utils/classnames";

export const ArticleBreadcrumb = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [, articles, article] = pathname.split("/");

  return (
    <Breadcrumb className={cn("mb-6", className)}>
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
            href="/admin"
            className="transition-all hover:text-neutral-100 rounded outline-none focus-visible:text-neutral-100 focus-visible:ring-neutral-100 focus-visible:ring-[3px]"
          >
            {articles}
          </Link>
        </BreadcrumbItem>
        {article !== undefined && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
