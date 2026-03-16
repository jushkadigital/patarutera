import { NextRequest, NextResponse } from "next/server";
import { MeiliSearch } from "meilisearch";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ tours: [], paquetes: [] });
  }

  const host = process.env.MEILISEARCH_HOST;
  const apiKey = process.env.MEILISEARCH_API_KEY;

  if (!host || !apiKey) {
    console.error("Meilisearch environment variables missing on server");
    return NextResponse.json(
      { error: "Configuration error", tours: [], paquetes: [] },
      { status: 500 },
    );
  }

  try {
    const client = new MeiliSearch({ host, apiKey });
    const index = client.index("tours");

    const [toursResponse, paquetesResponse] = await Promise.all([
      index.search(query, {
        limit: 3,
        filter: 'type = "tour"',
      }),
      index.search(query, {
        limit: 3,
        filter: 'type = "paquete"',
      }),
    ]);

    return NextResponse.json({
      tours: toursResponse.hits,
      paquetes: paquetesResponse.hits,
    });
  } catch (error) {
    console.error("Meilisearch search error:", error);
    return NextResponse.json(
      { error: "Search failed", tours: [], paquetes: [] },
      { status: 500 },
    );
  }
}
