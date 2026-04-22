import { BASEURL } from "@/lib2/config";
import { getBaseURL } from "@/lib/util/env";
import type { MetadataRoute } from "next";

type SitemapDocument = {
  slug?: string | null;
  updatedAt?: string | null;
};

type PayloadCollectionResponse = {
  docs?: SitemapDocument[];
};

export const revalidate = 3600;

async function fetchCollectionForSitemap(
  collection: "tours" | "paquetes",
): Promise<SitemapDocument[]> {
  if (!BASEURL) {
    return [];
  }

  const params = new URLSearchParams({
    depth: "0",
    draft: "false",
    pagination: "false",
  });

  params.append("select[slug]", "true");
  params.append("select[updatedAt]", "true");

  const response = await fetch(
    `${BASEURL}/api/${collection}?${params.toString()}`,
    {
      next: {
        tags: [collection],
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${collection} for sitemap: ${response.status}`,
    );
  }

  const result: PayloadCollectionResponse = await response.json();

  return Array.isArray(result.docs) ? result.docs : [];
}

function buildCollectionEntries(
  baseUrl: string,
  collection: "tours" | "paquetes",
  docs: SitemapDocument[],
): MetadataRoute.Sitemap {
  return docs
    .filter((doc): doc is SitemapDocument & { slug: string } =>
      Boolean(doc.slug),
    )
    .map((doc) => ({
      url: `${baseUrl}/pe/${collection}/${doc.slug}`,
      lastModified: doc.updatedAt ?? undefined,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL();
  const [tours, paquetes] = await Promise.all([
    fetchCollectionForSitemap("tours"),
    fetchCollectionForSitemap("paquetes"),
  ]);

  return [
    {
      url: `${baseUrl}/pe/tours`,
    },
    {
      url: `${baseUrl}/pe/paquetes`,
    },
    ...buildCollectionEntries(baseUrl, "tours", tours),
    ...buildCollectionEntries(baseUrl, "paquetes", paquetes),
  ];
}
