import type {
  Destination,
  GridToursBlock as GridToursBlockType,
  TourCategory,
} from "@/cms-types";
import { CardTourData } from "@/components/CardTour";
import { Pagination } from "@/components/Pagination";
import { Subtitle } from "@/components/Subtitle";
import { ToursComponent } from "@/components/ToursComponent";

interface Props extends GridToursBlockType {
  rangeSlider?: boolean;
  searchParams?: string;
  page?: number;
  selectedCategories?: string[];
  context?: {
    nameCollection: string;
  } | null;
}

type MeiliSearchResponse = {
  hits?: MeiliTourItem[];
  estimatedTotalHits?: number;
};

type MeiliTourItem = {
  id: number;
  title?: string;
  slug?: string;
  image?: string;
  description?: unknown;
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

function getDescriptionText(value: unknown): string | null {
  if (typeof value === "string") {
    return value.trim() || null;
  }

  return null;
}

type Difficulty = 'easy' | 'medium' | 'hard';
function mapMeiliTourToCardTourData(tour: MeiliTourItem): CardTourData {
  return {
    id: tour.id,
    title: tour.title ?? "Tour en Cusco",
    slug: tour.slug ?? `tour-${tour.id}`,
    miniDescription: isLexicalDescription(tour.description)
      ? tour.description
      : null,
    descriptionText: getDescriptionText(tour.description),
    meiliImage: tour.image ?? "/backgroundDestinoPage.png",
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

function sanitizeCategories(categories?: string[]): string[] {
  if (!categories) return [];

  return categories.map((value) => value.trim()).filter(Boolean);
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

async function searchToursFromMeilisearch({
  destinationName,
  categories,
  page,
  limit,
}: {
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
      q: "",
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
    selectedCategories,
  } = props;

  const toursPerPage = gridColumns ?? 6;
  const currentPage = page ?? 1;
  const destinationName = (destination as Destination | undefined)?.name;
  const categoryFromBlock = (
    (category as TourCategory[] | undefined) ?? []
  ).map((item) => item.name);

  const categoriesToFilter = sanitizeCategories(
    selectedCategories && selectedCategories.length > 0
      ? selectedCategories
      : categoryFromBlock,
  );

  const meiliResult = await searchToursFromMeilisearch({
    destinationName,
    categories: categoriesToFilter,
    page: currentPage,
    limit: toursPerPage,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(meiliResult.totalDocs / toursPerPage),
  );

  const tours = meiliResult.tours.map(mapMeiliTourToCardTourData);

  return (
    <div className=" mx-auto py-4 bg bg-white w-[90%]">
      <Subtitle className="" titleGroup={blockTitle} />
      <ToursComponent
        mode={Boolean(mode)}
        tours={tours}
        rangeSlider={props.rangeSlider}
      />
      {overrideDefaults && totalPages > 1 && (
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
