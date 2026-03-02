import type {
  Destination,
  GridPaquetesBlock as GridPaquetesBlockType,
} from "@/cms-types";
import { CardPaqueteData } from "@/components/cardPaquete";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/Subtitle";
import { PaquetesComponent } from "@/components/PaquetesComponent";

import { listProducts } from "@/lib/data/products";
import { HttpTypes } from "@medusajs/types";

interface Props extends GridPaquetesBlockType {
  rangeSlider?: boolean;
  searchParams?: string;
  page?: number;
  selectedCategories?: string[];
  context?: {
    nameCollection: string;
  } | null;
  countryCode?: string;
}



type MeiliSearchResponse = {
  hits?: MeiliPaqueteItem[];
  estimatedTotalHits?: number;
};

type MeiliPaqueteItem = {
  id: number;
  title?: string;
  slug?: string;
  image?: string;
  description?: unknown;
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

function getDescriptionText(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  return null;
}

type Difficulty = 'easy' | 'medium' | 'hard';
function mapMeiliPaqueteToCardPaqueteData(
  paquete: MeiliPaqueteItem,
): CardPaqueteData {
  return {
    id: paquete.id,
    title: paquete.title ?? "Paquete en Cusco",
    slug: paquete.slug ?? `paquete-${paquete.id}`,
    miniDescription: isLexicalDescription(paquete.description)
      ? paquete.description
      : null,
    descriptionText: getDescriptionText(paquete.description),
    meiliImage: paquete.image ?? "/backgroundDestinoPage.png",
    price: typeof paquete.price === "number" ? paquete.price : 299,
    medusaId: paquete.medusa_id ?? null,
    Desde: "Desde",
    "Person desc": "Por persona",
    maxPassengers: paquete.max_capacity,
    difficulty: paquete.difficulty as Difficulty,
    priceMedusa: null,
  };
}


function sanitizeCategories(categories?: string[]): string[] {
  if (!categories) return [];

  return categories.map((value) => value.trim()).filter(Boolean);
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function searchPaquetesFromMeilisearch({
  destinationName,
  categories,
  page,
  limit,
}: {
  destinationName?: string;
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
      q: "",
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

export async function GridPaquetes(props: Props) {
  const {
    gridColumns,
    gridStyle: mode,
    destination,
    page,
    overrideDefaults,
    searchParams,
    selectedCategories,
    countryCode = "pe",
  } = props;

  const paquetesPerPage = gridColumns ?? 6;
  const currentPage = page ?? 1;
  const destinationName = (destination as Destination | undefined)?.name;

  const categoriesToFilter = sanitizeCategories(selectedCategories ?? []);

  const meiliResult = await searchPaquetesFromMeilisearch({
    destinationName,
    categories: categoriesToFilter,
    page: currentPage,
    limit: paquetesPerPage,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(meiliResult.totalDocs / paquetesPerPage),
  );


  const paquetes = meiliResult.paquetes.map(
    mapMeiliPaqueteToCardPaqueteData
  );


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
