import type {
  GridToursBlock as GridToursBlockType,
  TitleGroup,
  Tour,
} from "@/cms-types";
import { CardTourData } from "@/components/CardTour";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/Subtitle";
import { BothComponent } from "@/components/BothComponent";
import { MeiliBothFilterClient } from "@/components/meili-both-filter-client";
import {
  getMeiliCompleteImageFallback,
  parseMeiliCompleteImage,
} from "@/lib2/meili-image";

interface Props extends Omit<GridToursBlockType, "blockTitle" | "blockType"> {
  rangeSlider?: boolean;
  fromPayload?: boolean;
  searchParams?: string;
  page?: number;
  destinationName?: string;
  filterTourName?: string;
  selectedCategories?: string[];
  context?: {
    nameCollection: string;
  } | null;
}

type MeiliSearchResponse = {
  hits?: MeiliTourItem[];
  estimatedTotalHits?: number;
};

type PayloadToursResponse = {
  docs?: Tour[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
};

type MeiliTourItem = {
  id: number;
  title?: string;
  slug?: string;
  image?: string;
  completeImage?: unknown;
  description?: unknown;
  miniDescription?: unknown;
  _formatted?: {
    description?: unknown;
    miniDescription?: unknown;
  };
  categories?: string[];
  destination?: string;
  max_capacity?: number;
  difficulty?: string;
  price?: number;
  currency?: string;
  medusa_id?: string;
};

type LexicalDescription = NonNullable<CardTourData["miniDescription"]>;

function isLexicalDescription(value: unknown): value is LexicalDescription {
  return typeof value === "object" && value !== null && "root" in value;
}

function parseLexicalDescription(value: unknown): LexicalDescription | null {
  if (isLexicalDescription(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("{")) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(trimmedValue);
    return isLexicalDescription(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

function getDescriptionText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  if (parseLexicalDescription(trimmedValue)) {
    return null;
  }

  return trimmedValue;
}

function resolveMeiliDescription(tour: MeiliTourItem): {
  miniDescription: LexicalDescription | null;
  descriptionText: string | null;
} {
  const lexicalCandidates: unknown[] = [
    tour.miniDescription,
    tour.description,
    tour._formatted?.miniDescription,
    tour._formatted?.description,
  ];

  for (const candidate of lexicalCandidates) {
    const lexicalDescription = parseLexicalDescription(candidate);
    if (lexicalDescription) {
      return {
        miniDescription: lexicalDescription,
        descriptionText: null,
      };
    }
  }

  const textCandidates: unknown[] = [
    tour.miniDescription,
    tour.description,
    tour._formatted?.miniDescription,
    tour._formatted?.description,
  ];

  for (const candidate of textCandidates) {
    const descriptionText = getDescriptionText(candidate);
    if (descriptionText) {
      return {
        miniDescription: null,
        descriptionText,
      };
    }
  }

  return {
    miniDescription: null,
    descriptionText: null,
  };
}

type Difficulty = "easy" | "medium" | "hard";

function mapMeiliTourToCardTourData(tour: MeiliTourItem): CardTourData {
  const meiliCompleteImage = parseMeiliCompleteImage(tour.completeImage);
  const { miniDescription, descriptionText } = resolveMeiliDescription(tour);

  return {
    id: tour.id,
    title: tour.title ?? "Tour en Cusco",
    slug: tour.slug ?? `tour-${tour.id}`,
    miniDescription,
    descriptionText,
    meiliImage:
      getMeiliCompleteImageFallback(meiliCompleteImage) ??
      tour.image ??
      "/backgroundDestinoPage.png",
    meiliCompleteImage,
    destinationName: tour.destination ?? "Cusco",
    price: typeof tour.price === "number" ? tour.price : 299,
    medusaId: tour.medusa_id ?? null,
    Desde: "Desde",
    "Person desc": "Por persona",
    maxPassengers: tour.max_capacity,
    difficulty: tour.difficulty as Difficulty,
    priceMedusa: null,
  };
}

function getCategoryNamesFromBlock(
  category: GridToursBlockType["category"],
): string[] {
  if (!Array.isArray(category)) {
    return [];
  }

  return category
    .map((item) => {
      if (typeof item === "object" && item !== null && "name" in item) {
        return item.name;
      }

      return null;
    })
    .filter((value): value is string => typeof value === "string");
}

function getCategoryIdsFromBlock(
  category: GridToursBlockType["category"],
): number[] {
  if (!Array.isArray(category)) {
    return [];
  }

  return category.filter((item): item is number => typeof item === "number");
}

function getDestinationId(
  destination: GridToursBlockType["destination"],
): number | undefined {
  if (typeof destination === "number") {
    return destination;
  }

  if (
    typeof destination === "object" &&
    destination !== null &&
    "id" in destination
  ) {
    return destination.id;
  }

  return undefined;
}

function sanitizeCategories(categories?: string[]): string[] {
  if (!categories) return [];

  return categories.map((value) => value.trim()).filter(Boolean);
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function searchBothFromMeilisearch({
  query,
  destinationName,
  categories,
  page,
  limit,
}: {
  query?: string;
  destinationName?: string;
  categories: string[];
  page: number;
  limit: number;
}): Promise<{ tours: MeiliTourItem[]; totalDocs: number }> {
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!host || !apiKey) {
    return { tours: [], totalDocs: 0 };
  }

  const filters: string[] = [];

  if (destinationName) {
    filters.push(`destination = "${escapeFilterValue(destinationName)}"`);
  }

  if (categories.length > 0) {
    const categoriesFilter = categories
      .map(
        (categoryName) => `categories = "${escapeFilterValue(categoryName)}"`,
      )
      .join(" OR ");

    filters.push(`(${categoriesFilter})`);
  }

  const offset = (page - 1) * limit;

  const response = await fetch(`${host}/indexes/tours/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query?.trim() ?? "",
      filter: filters.length > 0 ? filters.join(" AND ") : undefined,
      limit,
      offset,
    }),
    next: { tags: ["tours", "paquetes"] },
  });

  if (!response.ok) {
    throw new Error(
      `Meilisearch request failed with status ${response.status}`,
    );
  }

  const result: MeiliSearchResponse = await response.json();
  const tours = Array.isArray(result.hits) ? result.hits : [];

  return {
    tours,
    totalDocs: result.estimatedTotalHits ?? tours.length,
  };
}

export async function GridBoth(props: Props) {
  const {
    gridColumns,
    gridStyle: mode,
    destination,
    page,
    overrideDefaults,
    searchParams,
    destinationName: destinationNameFromParams,
    filterTourName,
    selectedCategories,
  } = props;

  const toursPerPage = gridColumns ?? 6;
  const currentPage = page ?? 1;
  const destinationNameFromBlock =
    typeof destination === "object" &&
    destination !== null &&
    "name" in destination
      ? destination.name
      : undefined;
  const destinationName = destinationNameFromParams ?? destinationNameFromBlock;
  const categoriesToFilter = sanitizeCategories(selectedCategories);
  const shouldUseClientPriceSearch = Boolean(props.rangeSlider);

  let tours: CardTourData[] = [];
  let totalDocs = 0;

  const meiliResult = await searchBothFromMeilisearch({
    query: filterTourName,
    destinationName,
    categories: categoriesToFilter,
    page: currentPage,
    limit: toursPerPage,
  });

  tours = meiliResult.tours.map(mapMeiliTourToCardTourData);
  totalDocs = meiliResult.totalDocs;

  const totalPages = Math.max(1, Math.ceil(totalDocs / toursPerPage));

  return (
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      {shouldUseClientPriceSearch ? (
        <MeiliBothFilterClient
          initialItems={tours}
          mode={Boolean(mode)}
          query={filterTourName}
          destinationName={destinationName}
          categories={categoriesToFilter}
          searchParams={searchParams ?? ""}
          currentPage={currentPage}
          initialTotalDocs={totalDocs}
          page={currentPage}
          limit={toursPerPage}
        />
      ) : (
        <BothComponent mode={Boolean(mode)} tours={tours} rangeSlider={false} />
      )}
      {overrideDefaults && totalPages > 1 && !shouldUseClientPriceSearch && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          searchParams={searchParams ?? ""}
          type={"both"}
        />
      )}
    </div>
  );
}
