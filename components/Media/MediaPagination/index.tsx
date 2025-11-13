import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { cn } from "@/utils/classnames";
import { buttonVariants } from "@/styles/classNames";
// import { useRenderCount } from "@/utils/renderCount";

interface MediaPaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function MediaPagination(props: MediaPaginationProps) {
  // useRenderCount("MediaPagination"); // DEBUG

  return (
    <Pagination className="mb-0 mt-auto">
      <PaginationContent>
        <NavToPreviousPage {...props} />
        <FirstPage {...props} />
        <PreviousEllipsis {...props} />
        <PreviousPage {...props} />
        <CurrentPage {...props} />
        <NextPage {...props} />
        <NextEllipsis {...props} />
        <LastPage {...props} />
        <NavToNextPage {...props} />
      </PaginationContent>
    </Pagination>
  );
}

const PreviousEllipsis = ({ currentPage }: MediaPaginationProps) =>
  currentPage > 3 && (
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
  );

const NextEllipsis = ({ currentPage, totalPages }: MediaPaginationProps) =>
  totalPages > currentPage + 2 && (
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
  );

const FirstPage = ({ currentPage }: MediaPaginationProps) =>
  currentPage - 1 > 0 && (
    <PaginationItem>
      <PaginationLink href="?page=1">1</PaginationLink>
    </PaginationItem>
  );

const LastPage = ({ totalPages, currentPage }: MediaPaginationProps) =>
  currentPage < totalPages && (
    <PaginationItem>
      <PaginationLink href={`?page=${totalPages}`}>{totalPages}</PaginationLink>
    </PaginationItem>
  );

const NavToPreviousPage = ({ currentPage }: MediaPaginationProps) => (
  <PaginationItem>
    <PaginationPrevious
      href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
      className={cn(
        `${
          currentPage < 2
            ? `${buttonVariants({ variant: "disabled" })} pointer-events-none`
            : ""
        }`
      )}
    />
  </PaginationItem>
);

const NavToNextPage = ({ currentPage, totalPages }: MediaPaginationProps) => (
  <PaginationItem>
    <PaginationNext
      href={`?page=${
        currentPage + 1 > totalPages ? totalPages : currentPage + 1
      }`}
      className={cn(
        `${
          currentPage === totalPages
            ? `${buttonVariants({ variant: "disabled" })} pointer-events-none`
            : ""
        }`
      )}
    />
  </PaginationItem>
);

const PreviousPage = ({ currentPage }: MediaPaginationProps) =>
  currentPage - 1 > 1 && (
    <PaginationItem>
      <PaginationLink href={`?page=${currentPage - 1}`}>
        {currentPage - 1}
      </PaginationLink>
    </PaginationItem>
  );

const CurrentPage = ({ currentPage, totalPages }: MediaPaginationProps) => (
  <PaginationItem>
    <PaginationLink href={`?page=${currentPage}`} isActive>
      {currentPage < 1
        ? 1
        : currentPage > totalPages
        ? totalPages
        : currentPage}
    </PaginationLink>
  </PaginationItem>
);

const NextPage = ({ currentPage, totalPages }: MediaPaginationProps) =>
  currentPage + 1 < totalPages && (
    <PaginationItem>
      <PaginationLink href={`?page=${currentPage + 1}`}>
        {currentPage + 1}
      </PaginationLink>
    </PaginationItem>
  );
