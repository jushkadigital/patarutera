"use client";
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/utilities/ui";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const Pagination: React.FC<{
  className?: string;
  page: number;
  totalPages: number;
  searchParams: string;
  type: "tours" | "paquetes" | "both" | "posts";
}> = (props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { className, page, totalPages } = props;

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const hasExtraPrevPages = page - 1 > 1;
  const hasExtraNextPages = page + 1 < totalPages;

  const goToPage = (targetPage: number) => {
    const params = new URLSearchParams(props.searchParams);
    params.set("page", String(targetPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("my-12", className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              isActive={hasPrevPage}
              aria-disabled={!hasPrevPage}
              tabIndex={hasPrevPage ? 0 : -1}
              className={
                !hasPrevPage ? "cursor-pointer opacity-50" : "cursor-pointer"
              }
              onClick={() => {
                if (hasPrevPage) goToPage(page - 1);
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => goToPage(page - 1)}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              aria-current="page"
              tabIndex={-1}
              isActive
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => goToPage(page + 1)}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              isActive={hasNextPage}
              aria-disabled={!hasNextPage}
              tabIndex={hasNextPage ? 0 : -1}
              className={
                !hasNextPage ? "cursor-pointer opacity-50" : "cursor-pointer"
              }
              onClick={() => {
                if (hasNextPage) goToPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};
