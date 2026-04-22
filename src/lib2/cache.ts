export const MARKETING_REVALIDATE_SECONDS = 60 * 60;

export const CACHE_TAGS = {
  destinations: "destinations",
  pages: "pages",
  paquetes: "paquetes",
  tourCategories: "tourCategory",
  tours: "tours",
} as const;

export const getGlobalCacheTag = (slug: string) => `global_${slug}`;

export const getPageCacheTag = (slug: string) => `page-${slug}`;

export const getPaqueteCacheTag = (slug: string) => `paquete-${slug}`;

export const getTourCacheTag = (slug: string) => `tour-${slug}`;

export function getRevalidatedFetchOptions(tags: string[] = []): RequestInit {
  if (tags.length === 0) {
    return {
      next: {
        revalidate: MARKETING_REVALIDATE_SECONDS,
      },
    };
  }

  return {
    next: {
      revalidate: MARKETING_REVALIDATE_SECONDS,
      tags,
    },
  };
}
