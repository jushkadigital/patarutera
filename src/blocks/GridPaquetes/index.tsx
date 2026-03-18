import type {
  Destination,
  GridPaquetesBlock as GridPaquetesBlockType,
  Paquete,
} from "@/cms-types";
import { CardPaqueteData } from "@/components/cardPaquete";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/Subtitle";
import { PaquetesComponent } from "@/components/PaquetesComponent";
import { BASEURL } from "@/lib2/config";
import {
  getMeiliCompleteImageFallback,
  parseMeiliCompleteImage,
} from "@/lib2/meili-image";

interface Props extends GridPaquetesBlockType {
  rangeSlider?: boolean;
  fromPayload?: boolean | null;
  searchParams?: string;
  page?: number;
  filterTourName?: string;
  selectedCategories?: string[];
  selectedDestinations?: string[];
  context?: {
    nameCollection: string;
  } | null;
  countryCode?: string;
}

type MeiliSearchResponse = {
  hits?: MeiliPaqueteItem[];
  estimatedTotalHits?: number;
};

type PayloadPaquetesResponse = {
  docs?: Paquete[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
};

type MeiliPaqueteItem = {
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
  max_capacity?: number;
  difficulty?: string;
  destination?: string;
  price?: number;
  currency?: string;
  medusa_id?: string;
};

type LexicalDescription = NonNullable<CardPaqueteData["miniDescription"]>;

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

function resolveMeiliDescription(paquete: MeiliPaqueteItem): {
  miniDescription: LexicalDescription | null;
  descriptionText: string | null;
} {
  const lexicalCandidates: unknown[] = [
    paquete.miniDescription,
    paquete.description,
    paquete._formatted?.miniDescription,
    paquete._formatted?.description,
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
    paquete.miniDescription,
    paquete.description,
    paquete._formatted?.miniDescription,
    paquete._formatted?.description,
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
function mapMeiliPaqueteToCardPaqueteData(
  paquete: MeiliPaqueteItem,
): CardPaqueteData {
  const meiliCompleteImage = parseMeiliCompleteImage(paquete.completeImage);
  const { miniDescription, descriptionText } = resolveMeiliDescription(paquete);

  return {
    id: paquete.id,
    title: paquete.title ?? "Paquete en Cusco",
    slug: paquete.slug ?? `paquete-${paquete.id}`,
    miniDescription,
    descriptionText,
    meiliImage:
      getMeiliCompleteImageFallback(meiliCompleteImage) ??
      paquete.image ??
      "/backgroundDestinoPage.png",
    meiliCompleteImage,
    price: typeof paquete.price === "number" ? paquete.price : 299,
    medusaId: paquete.medusa_id ?? null,
    Desde: "Desde",
    "Person desc": "Por persona",
    maxPassengers: paquete.max_capacity,
    difficulty: paquete.difficulty as Difficulty,
    priceMedusa: null,
  };
}

function isDestination(value: unknown): value is Destination {
  return typeof value === "object" && value !== null && "name" in value;
}

function getDestinationNameFromPaquete(paquete: Paquete): string | null {
  if (Array.isArray(paquete.destinos)) {
    const names = paquete.destinos
      .filter(isDestination)
      .map((destination) => destination.name);

    return names.length > 0 ? names.join(", ") : null;
  }

  return null;
}

function mapPayloadPaqueteToCardPaqueteData(paquete: Paquete): CardPaqueteData {
  const miniDescriptionValue = paquete.miniDescription as unknown;

  return {
    id: paquete.id,
    title: paquete.title,
    slug: paquete.slug ?? `paquete-${paquete.id}`,
    miniDescription: isLexicalDescription(miniDescriptionValue)
      ? miniDescriptionValue
      : null,
    descriptionText: getDescriptionText(miniDescriptionValue),
    featuredImage: paquete.featuredImage,
    destinationName: getDestinationNameFromPaquete(paquete),
    destinos: paquete.destinos,
    price:
      typeof paquete.price === "number" ? paquete.price : paquete.priceGeneral,
    Desde: "Desde",
    "Person desc": "Por persona",
    iconMaxPassengers: paquete.iconMaxPassengers,
    maxPassengers:
      typeof paquete.maxPassengers === "number"
        ? paquete.maxPassengers
        : paquete.maxPassengersGeneral,
    iconDifficulty: paquete.iconDifficulty,
    difficulty: paquete.difficulty,
    medusaId: null,
    priceMedusa: null,
  };
}

function getDestinationNamesFromBlock(
  destination: GridPaquetesBlockType["destination"],
): string[] {
  if (!Array.isArray(destination)) {
    return [];
  }

  return destination
    .map((item) => {
      if (typeof item === "object" && item !== null && "name" in item) {
        return item.name;
      }

      return null;
    })
    .filter((value): value is string => typeof value === "string");
}

function getDestinationIdsFromBlock(
  destination: GridPaquetesBlockType["destination"],
): number[] {
  if (!Array.isArray(destination)) {
    return [];
  }

  const ids: number[] = [];

  destination.forEach((item) => {
    if (typeof item === "number") {
      ids.push(item);
      return;
    }

    if (typeof item === "object" && item !== null && "id" in item) {
      ids.push(item.id);
    }
  });

  return ids;
}

function sanitizeCategories(categories?: string[]): string[] {
  if (!categories) return [];

  return categories.map((value) => value.trim()).filter(Boolean);
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function searchPaquetesFromMeilisearch({
  query,
  destinationNames,
  categories,
  page,
  limit,
}: {
  query?: string;
  destinationNames: string[];
  categories: string[];
  page: number;
  limit: number;
}): Promise<{ paquetes: MeiliPaqueteItem[]; totalDocs: number }> {
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!host || !apiKey) {
    return { paquetes: [], totalDocs: 0 };
  }

  const filters: string[] = [];
  filters.push('type = "paquete"');

  if (destinationNames.length > 0) {
    const destinationFilter = destinationNames
      .map(
        (destinationName) =>
          `destination = "${escapeFilterValue(destinationName)}"`,
      )
      .join(" OR ");

    filters.push(`(${destinationFilter})`);
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
    next: { tags: ["paquetes"] },
  });

  if (!response.ok) {
    throw new Error(
      `Meilisearch request failed with status ${response.status}`,
    );
  }

  const result: MeiliSearchResponse = await response.json();
  const paquetes = Array.isArray(result.hits) ? result.hits : [];

  return {
    paquetes,
    totalDocs: result.estimatedTotalHits ?? paquetes.length,
  };
}

async function searchPaquetesFromPayload({
  destinationNames,
  destinationIds,
  page,
  limit,
}: {
  destinationNames: string[];
  destinationIds: number[];
  page: number;
  limit: number;
}): Promise<{ paquetes: Paquete[]; totalDocs: number }> {
  if (!BASEURL) {
    return { paquetes: [], totalDocs: 0 };
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
  params.append("select[priceGeneral]", "true");
  params.append("select[difficulty]", "true");
  params.append("select[iconDifficulty]", "true");
  params.append("select[maxPassengers]", "true");
  params.append("select[maxPassengersGeneral]", "true");
  params.append("select[iconMaxPassengers]", "true");
  params.append("select[miniDescription]", "true");
  params.append("select[destinos]", "true");

  if (destinationNames.length > 0) {
    params.append("where[destinos.name][in]", destinationNames.join(","));
  } else if (destinationIds.length > 0) {
    params.append("where[destinos][in]", destinationIds.join(","));
  }

  const response = await fetch(`${BASEURL}/api/paquetes?${params.toString()}`, {
    next: { tags: ["paquetes"] },
  });

  if (!response.ok) {
    throw new Error(`Payload request failed with status ${response.status}`);
  }

  const result: PayloadPaquetesResponse = await response.json();
  const paquetes = Array.isArray(result.docs) ? result.docs : [];
  const totalDocs =
    typeof result.totalDocs === "number" && Number.isFinite(result.totalDocs)
      ? result.totalDocs
      : paquetes.length;

  return {
    paquetes,
    totalDocs,
  };
}

export async function GridPaquetes(props: Props) {
  const {
    gridColumns,
    gridStyle: mode,
    destination,
    page,
    overrideDefaults,
    searchParams,
    filterTourName,
    selectedCategories,
    selectedDestinations,
    fromPayload,
  } = props;

  const paquetesPerPage = gridColumns ?? 6;
  const currentPage = page ?? 1;
  const destinationNamesFromBlock = getDestinationNamesFromBlock(destination);
  const destinationIdsFromBlock = getDestinationIdsFromBlock(destination);

  const categoriesToFilter = sanitizeCategories(selectedCategories ?? []);
  const destinationNamesToFilter = sanitizeCategories(
    selectedDestinations && selectedDestinations.length > 0
      ? selectedDestinations
      : destinationNamesFromBlock,
  );

  const shouldUsePayload = Boolean(fromPayload);

  let paquetes: CardPaqueteData[] = [];
  let totalDocs = 0;

  if (shouldUsePayload) {
    const payloadResult = await searchPaquetesFromPayload({
      destinationNames: destinationNamesToFilter,
      destinationIds: destinationIdsFromBlock,
      page: currentPage,
      limit: paquetesPerPage,
    });

    paquetes = payloadResult.paquetes.map(mapPayloadPaqueteToCardPaqueteData);
    totalDocs = payloadResult.totalDocs;
  } else {
    const meiliResult = await searchPaquetesFromMeilisearch({
      query: filterTourName,
      destinationNames: destinationNamesToFilter,
      categories: categoriesToFilter,
      page: currentPage,
      limit: paquetesPerPage,
    });

    paquetes = meiliResult.paquetes.map(mapMeiliPaqueteToCardPaqueteData);
    totalDocs = meiliResult.totalDocs;
  }

  const totalPages = Math.max(1, Math.ceil(totalDocs / paquetesPerPage));

  return (
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      <Subtitle className="" titleGroup={props.blockTitle} />
      <PaquetesComponent
        mode={Boolean(mode)}
        paquetes={paquetes}
        rangeSlider={props.rangeSlider}
      />
      {overrideDefaults && totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          searchParams={searchParams ?? ""}
          type={"paquetes"}
        />
      )}
    </div>
  );
}
