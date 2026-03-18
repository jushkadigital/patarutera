"use client";

import * as React from "react";
import { debounce } from "lodash";

import type { CardTourData } from "@/components/CardTour";
import type { CardPaqueteData } from "@/components/cardPaquete";
import { BothComponent } from "@/components/BothComponent";
import { FilterLoadingOverlay } from "@/components/filter-loading-overlay";
import { Pagination } from "@/components/Pagination";
import { useSharedState } from "@/hooks/sharedContextDestinos";

type BothCardData = CardTourData | CardPaqueteData;

interface MeiliBothFilterClientProps {
  initialItems: BothCardData[];
  mode: boolean;
  query?: string;
  destinationName?: string;
  categories: string[];
  searchParams: string;
  currentPage: number;
  initialTotalDocs: number;
  page: number;
  limit: number;
}

interface MeiliBothFilterResponse {
  tours?: BothCardData[];
  totalDocs?: number;
}

export function MeiliBothFilterClient({
  initialItems,
  mode,
  query,
  destinationName,
  categories,
  searchParams,
  currentPage,
  initialTotalDocs,
  page,
  limit,
}: MeiliBothFilterClientProps) {
  const { priceOne } = useSharedState();
  const [items, setItems] = React.useState<BothCardData[]>(initialItems);
  const [totalDocs, setTotalDocs] = React.useState(initialTotalDocs);
  const [isSearching, setIsSearching] = React.useState(false);
  const requestIdRef = React.useRef(0);
  const hasMountedRef = React.useRef(false);

  React.useEffect(() => {
    setItems(initialItems);
    setTotalDocs(initialTotalDocs);
  }, [initialItems, initialTotalDocs]);

  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (range: [number, number]) => {
        const [rangeStart, rangeEnd] =
          range[0] <= range[1] ? [range[0], range[1]] : [range[1], range[0]];
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;
        setIsSearching(true);

        try {
          const response = await fetch("/api/meili/tours", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
              destinationName,
              categories,
              page,
              limit,
              minPrice: rangeStart,
              maxPrice: rangeEnd,
              searchType: "both",
            }),
          });

          if (!response.ok) {
            throw new Error(`Meilisearch request failed: ${response.status}`);
          }

          const data: MeiliBothFilterResponse = await response.json();

          if (requestIdRef.current !== requestId) {
            return;
          }

          const nextItems = Array.isArray(data.tours) ? data.tours : [];
          setItems(nextItems);
          setTotalDocs(
            typeof data.totalDocs === "number" &&
              Number.isFinite(data.totalDocs)
              ? data.totalDocs
              : nextItems.length,
          );
        } catch (error) {
          console.error("Meilisearch both price filter error:", error);
        } finally {
          if (requestIdRef.current === requestId) {
            setIsSearching(false);
          }
        }
      }, 350),
    [categories, destinationName, limit, page, query],
  );

  React.useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    debouncedSearch(priceOne);

    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch, priceOne]);

  const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

  return (
    <div className="relative">
      {isSearching && <FilterLoadingOverlay label="Actualizando tours..." />}
      <BothComponent mode={mode} tours={items} rangeSlider={false} />
      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          searchParams={searchParams}
          type={"both"}
        />
      )}
    </div>
  );
}
