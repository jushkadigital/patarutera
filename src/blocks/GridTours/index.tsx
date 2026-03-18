import type { GridToursBlock as GridToursBlockType, Tour } from "@/cms-types";
import { CardTourData } from "@/components/CardTour";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/Subtitle";
import { MeiliToursFilterClient } from "@/components/meili-tours-filter-client";
import { ToursComponent } from "@/components/ToursComponent";
import { BASEURL } from "@/lib2/config";
import {
  getMeiliCompleteImageFallback,
  parseMeiliCompleteImage,
} from "@/lib2/meili-image";

interface Props extends GridToursBlockType {
  rangeSlider?: boolean;
  fromPayload?: boolean;
  searchParams?: string;
  page?: number;
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

function mapPayloadTourToCardTourData(tour: Tour): CardTourData {
  const miniDescriptionValue = tour.miniDescription as unknown;

  const destinationName =
    typeof tour.destinos === "object" &&
    tour.destinos !== null &&
    "name" in tour.destinos
      ? tour.destinos.name
      : null;

  return {
    id: tour.id,
    title: tour.title,
    slug: tour.slug ?? `tour-${tour.id}`,
    miniDescription: isLexicalDescription(miniDescriptionValue)
      ? miniDescriptionValue
      : null,
    descriptionText: getDescriptionText(miniDescriptionValue),
    featuredImage: tour.featuredImage,
    destinationName,
    destinos: tour.destinos,
    price: typeof tour.price === "number" ? tour.price : tour.priceGeneral,
    iconMaxPassengers: tour.iconMaxPassengers,
    maxPassengers:
      typeof tour.maxPassengers === "number"
        ? tour.maxPassengers
        : tour.maxPassengersGeneral,
    iconDifficulty: tour.iconDifficulty,
    difficulty: tour.difficulty,
    medusaId: null,
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

async function searchToursFromMeilisearch({
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
  filters.push('type = "tour"');

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
    next: { tags: ["tours"] },
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

async function searchToursFromPayload({
  destinationId,
  destinationName,
  categoryNames,
  categoryIds,
  page,
  limit,
}: {
  destinationId?: number;
  destinationName?: string;
  categoryNames: string[];
  categoryIds: number[];
  page: number;
  limit: number;
}): Promise<{ tours: Tour[]; totalDocs: number }> {
  if (!BASEURL) {
    return { tours: [], totalDocs: 0 };
  }

  const params = new URLSearchParams();
  params.append("limit", String(limit));
  params.append("page", String(page));
  params.append("depth", "2");
  params.append("draft", "false");

  params.append("select[featuredImage]", "true");
  params.append("select[slug]", "true");
  params.append("select[title]", "true");
  params.append("select[price]", "true");
  params.append("select[difficulty]", "true");
  params.append("select[iconDifficulty]", "true");
  params.append("select[maxPassengers]", "true");
  params.append("select[iconMaxPassengers]", "true");
  params.append("select[miniDescription]", "true");
  params.append("select[destinos]", "true");

  if (destinationName) {
    params.append("where[destinos.name][equals]", destinationName);
  } else if (destinationId) {
    params.append("where[destinos][equals]", String(destinationId));
  }

  if (categoryNames.length > 0) {
    params.append("where[categorias.name][in]", categoryNames.join(","));
  } else if (categoryIds.length > 0) {
    params.append("where[categorias][in]", categoryIds.join(","));
  }

  const response = await fetch(`${BASEURL}/api/tours?${params.toString()}`, {
    next: { tags: ["tours"] },
  });

  if (!response.ok) {
    throw new Error(`Payload request failed with status ${response.status}`);
  }

  const result: PayloadToursResponse = await response.json();
  const tours = Array.isArray(result.docs) ? result.docs : [];
  const totalDocs =
    typeof result.totalDocs === "number" && Number.isFinite(result.totalDocs)
      ? result.totalDocs
      : tours.length;

  return {
    tours,
    totalDocs,
  };
}

export async function GridTours(props: Props) {
  const {
    gridColumns,
    gridStyle: mode,
    destination,
    category,
    blockTitle,
    page,
    overrideDefaults,
    searchParams,
    filterTourName,
    selectedCategories,
    fromPayload = true,
  } = props;

  const toursPerPage = gridColumns ?? 6;
  const currentPage = page ?? 1;
  const destinationName =
    typeof destination === "object" &&
    destination !== null &&
    "name" in destination
      ? destination.name
      : undefined;
  const destinationId = getDestinationId(destination);
  const categoryFromBlock = getCategoryNamesFromBlock(category);
  const categoryIdsFromBlock = getCategoryIdsFromBlock(category);

  const categoriesToFilter = sanitizeCategories(
    selectedCategories && selectedCategories.length > 0
      ? selectedCategories
      : categoryFromBlock,
  );

  const payloadCategoryNames = sanitizeCategories(
    categoryFromBlock.length > 0
      ? categoryFromBlock
      : selectedCategories && selectedCategories.length > 0
        ? selectedCategories
        : [],
  );

  const shouldUsePayload = Boolean(fromPayload);
  const shouldUseClientPriceSearch =
    !shouldUsePayload && Boolean(props.rangeSlider);

  let tours: CardTourData[] = [];
  let totalDocs = 0;

  if (shouldUsePayload) {
    const payloadResult = await searchToursFromPayload({
      destinationId,
      destinationName,
      categoryNames: payloadCategoryNames,
      categoryIds: categoryIdsFromBlock,
      page: currentPage,
      limit: toursPerPage,
    });

    tours = payloadResult.tours.map(mapPayloadTourToCardTourData);
    totalDocs = payloadResult.totalDocs;
  } else {
    const meiliResult = await searchToursFromMeilisearch({
      query: filterTourName,
      destinationName,
      categories: categoriesToFilter,
      page: currentPage,
      limit: toursPerPage,
    });

    tours = meiliResult.tours.map(mapMeiliTourToCardTourData);
    totalDocs = meiliResult.totalDocs;
  }

  const totalPages = Math.max(1, Math.ceil(totalDocs / toursPerPage));

  return (
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      <Subtitle className="" titleGroup={blockTitle} />
      {shouldUseClientPriceSearch ? (
        <MeiliToursFilterClient
          initialTours={tours}
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
        <ToursComponent
          mode={Boolean(mode)}
          tours={tours}
          rangeSlider={props.rangeSlider}
        />
      )}
      {overrideDefaults && totalPages > 1 && !shouldUseClientPriceSearch && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          searchParams={searchParams ?? ""}
          type={"tours"}
        />
      )}
    </div>
  );
}
