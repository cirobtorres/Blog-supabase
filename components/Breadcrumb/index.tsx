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
import { focusVisibleWhiteRing } from "../../styles/classNames";

export const ArticleBreadcrumb = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const [, articles, article] = pathname.split("/");

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href="/"
            className={cn(
              "transition-all duration-300 hover:text-neutral-100 rounded outline-none",
              focusVisibleWhiteRing
            )}
          >
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Link
            href="/admin"
            className={cn(
              "transition-all duration-300 hover:text-neutral-100 rounded outline-none",
              focusVisibleWhiteRing
            )}
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
