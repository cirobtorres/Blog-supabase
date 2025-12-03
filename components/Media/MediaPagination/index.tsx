"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "../../../components/ui/pagination";
import { cn } from "../../../utils/classnames";
import { buttonVariants } from "../../../styles/classNames";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface MediaPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function MediaPagination(props: MediaPaginationProps) {
  const params = useSearchParams();
  const router = useRouter();

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(params);
    newParams.set(key, value);
    router.push(`/admin/media?${newParams.toString()}`);
  };

  return (
    props.totalPages > 1 && (
      <Pagination className="my-8">
        <PaginationContent>
          <NavToPreviousPage {...{ ...props, updateParam }} />
          <FirstPage {...{ ...props, updateParam }} />
          <PreviousEllipsis {...{ ...props, updateParam }} />
          <PreviousPage {...{ ...props, updateParam }} />
          <CurrentPage {...{ ...props, updateParam }} />
          <NextPage {...{ ...props, updateParam }} />
          <NextEllipsis {...{ ...props, updateParam }} />
          <LastPage {...{ ...props, updateParam }} />
          <NavToNextPage {...{ ...props, updateParam }} />
        </PaginationContent>
      </Pagination>
    )
  );
}

const PreviousEllipsis = ({
  currentPage,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) =>
  currentPage > 3 && (
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
  );

const NextEllipsis = ({
  currentPage,
  totalPages,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) =>
  totalPages > currentPage + 2 && (
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
  );

const FirstPage = ({
  currentPage,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  const disabled = currentPage === 1;

  return (
    currentPage - 1 > 0 && (
      <PaginationItem>
        <button
          role="button"
          disabled={disabled}
          onClick={() => updateParam("page", "1")}
          aria-current={disabled ? "page" : undefined}
          data-slot="pagination-link"
          aria-label="Navegar para primeira página"
          data-active={disabled}
          className={cn(
            buttonVariants({
              variant: disabled ? "outline" : "default",
            }),
            disabled && "pointer-events-none opacity-50"
          )}
        >
          1
        </button>
      </PaginationItem>
    )
  );
};

const LastPage = ({
  totalPages,
  currentPage,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  const disabled = currentPage === totalPages;

  return (
    currentPage < totalPages && (
      <PaginationItem>
        <button
          role="button"
          disabled={disabled}
          onClick={() => updateParam("page", totalPages.toString())}
          data-slot="pagination-link"
          aria-label="Navegar para última página"
          data-active={disabled}
          className={cn(
            buttonVariants({
              variant: disabled ? "outline" : "default",
            }),
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {totalPages}
        </button>
      </PaginationItem>
    )
  );
};

const NavToPreviousPage = ({
  currentPage,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  const disabled = currentPage === 1;
  const navTo = currentPage > 1 ? currentPage - 1 : 1;

  return (
    <PaginationItem>
      <button
        role="button"
        disabled={disabled}
        onClick={() => updateParam("page", navTo.toString())}
        data-slot="pagination-link"
        aria-label="Navegar para página anterior"
        className={cn(
          "size-[34px]",
          buttonVariants({
            variant: disabled ? "disabled" : "default",
          }),
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeftIcon />
      </button>
    </PaginationItem>
  );
};

const NavToNextPage = ({
  currentPage,
  totalPages,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  const disabled = currentPage === totalPages;
  const navTo = currentPage + 1 > totalPages ? totalPages : currentPage + 1;

  return (
    <PaginationItem>
      <button
        role="button"
        disabled={disabled}
        onClick={() => updateParam("page", navTo.toString())}
        data-slot="pagination-link"
        aria-label="Navegar para próxima página"
        className={cn(
          "size-[34px]",
          buttonVariants({
            variant: disabled ? "disabled" : "default",
          }),
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <ChevronRightIcon />
      </button>
    </PaginationItem>
  );
};

const PreviousPage = ({
  currentPage,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  const navTo = currentPage - 1;
  return (
    currentPage - 1 > 1 && (
      <PaginationItem>
        <button
          role="button"
          onClick={() => updateParam("page", navTo.toString())}
          data-slot="pagination-link"
          aria-label={`Navegar para página ${navTo}`}
          className={cn(
            "size-[34px]",
            buttonVariants({
              variant: "default",
            })
          )}
        >
          {currentPage - 1}
        </button>
      </PaginationItem>
    )
  );
};

const CurrentPage = ({
  currentPage,
  totalPages,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  return (
    <PaginationItem>
      <button
        role="button"
        disabled
        onClick={() => updateParam("page", currentPage.toString())}
        aria-current={"page"}
        data-slot="pagination-link"
        aria-label="Página atual"
        className={cn(
          "size-[34px]",
          buttonVariants({
            variant: "outline",
          })
        )}
      >
        {currentPage < 1
          ? 1
          : currentPage > totalPages
          ? totalPages
          : currentPage}
      </button>
    </PaginationItem>
  );
};

const NextPage = ({
  currentPage,
  totalPages,
  updateParam,
}: MediaPaginationProps & {
  updateParam: (key: string, value: string) => void;
}) => {
  const navTo = currentPage + 1;

  return (
    currentPage + 1 < totalPages && (
      <PaginationItem>
        <button
          role="button"
          onClick={() => updateParam("page", navTo.toString())}
          data-slot="pagination-link"
          aria-label={`Navegar para página ${navTo}`}
          className={cn(
            "size-[34px]",
            buttonVariants({
              variant: "default",
            })
          )}
        >
          {currentPage + 1}
        </button>
      </PaginationItem>
    )
  );
};
