import { NextRequest, NextResponse } from "next/server";

import type { CardTourData } from "@/components/CardTour";
import {
  getMeiliCompleteImageFallback,
  parseMeiliCompleteImage,
} from "@/lib2/meili-image";

type MeiliTourItem = {
  id: number;
  title?: string;
  slug?: string;
  image?: string;
  completeImage?: unknown;
  description?: unknown;
  destination?: string;
  max_capacity?: number;
  difficulty?: string;
  price?: number;
  medusa_id?: string;
};

type MeiliSearchResponse = {
  hits?: MeiliTourItem[];
  estimatedTotalHits?: number;
};

type SearchPayload = {
  query?: string;
  destinationName?: string;
  categories?: string[];
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  searchType?: "tour" | "both";
};

function sanitizeCategories(categories?: string[]): string[] {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories.map((value) => value.trim()).filter(Boolean);
}

function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }

  return value;
}

function mapMeiliTourToCardTourData(tour: MeiliTourItem): CardTourData {
  const meiliCompleteImage = parseMeiliCompleteImage(tour.completeImage);

  return {
    id: tour.id,
    title: tour.title ?? "Tour en Cusco",
    slug: tour.slug ?? `tour-${tour.id}`,
    miniDescription: null,
    descriptionText: null,
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
    difficulty: (tour.difficulty as CardTourData["difficulty"]) ?? null,
    priceMedusa: null,
  };
}

export async function POST(request: NextRequest) {
  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!host || !apiKey) {
    return NextResponse.json(
      { error: "Meilisearch environment variables missing", tours: [] },
      { status: 500 },
    );
  }

  let payload: SearchPayload;

  try {
    payload = (await request.json()) as SearchPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid payload", tours: [] },
      { status: 400 },
    );
  }

  const categories = sanitizeCategories(payload.categories);
  const page =
    typeof payload.page === "number" && payload.page > 0
      ? Math.floor(payload.page)
      : 1;
  const limit =
    typeof payload.limit === "number" && payload.limit > 0
      ? Math.floor(payload.limit)
      : 6;
  const minPrice = toFiniteNumber(payload.minPrice);
  const maxPrice = toFiniteNumber(payload.maxPrice);
  const filters: string[] = [];

  if (payload.searchType !== "both") {
    filters.push('type = "tour"');
  }

  if (payload.destinationName) {
    filters.push(
      `destination = "${escapeFilterValue(payload.destinationName)}"`,
    );
  }

  if (categories.length > 0) {
    const categoriesFilter = categories
      .map(
        (categoryName) => `categories = "${escapeFilterValue(categoryName)}"`,
      )
      .join(" OR ");
    filters.push(`(${categoriesFilter})`);
  }

  if (typeof minPrice === "number" && typeof maxPrice === "number") {
    const low = Math.min(minPrice, maxPrice);
    const high = Math.max(minPrice, maxPrice);
    filters.push(`price >= ${low}`);
    filters.push(`price <= ${high}`);
  } else if (typeof minPrice === "number") {
    filters.push(`price >= ${minPrice}`);
  } else if (typeof maxPrice === "number") {
    filters.push(`price <= ${maxPrice}`);
  }

  const offset = (page - 1) * limit;

  try {
    const response = await fetch(`${host}/indexes/tours/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: payload.query?.trim() ?? "",
        filter: filters.join(" AND "),
        limit,
        offset,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Meilisearch failed with ${response.status}`, tours: [] },
        { status: response.status },
      );
    }

    const result: MeiliSearchResponse = await response.json();
    const tours = Array.isArray(result.hits)
      ? result.hits.map(mapMeiliTourToCardTourData)
      : [];

    return NextResponse.json({
      tours,
      totalDocs: result.estimatedTotalHits ?? tours.length,
    });
  } catch (error) {
    console.error("Meilisearch tours search error:", error);
    return NextResponse.json(
      { error: "Search failed", tours: [] },
      { status: 500 },
    );
  }
}
