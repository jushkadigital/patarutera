import { Media } from "@/cms-types";

export type MeiliCompleteImage = {
  large?: string | null;
  medium?: string | null;
  small?: string | null;
  og?: string | null;
  square?: string | null;
};

const IMAGE_KEYS: Array<keyof MeiliCompleteImage> = [
  "large",
  "medium",
  "small",
  "og",
  "square",
];

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (value && typeof value === "object" && "url" in value) {
    const urlValue = (value as { url?: unknown }).url;

    if (typeof urlValue === "string") {
      const trimmed = urlValue.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
  }

  return null;
}

function parseObjectRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return null;
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (parsed && typeof parsed === "object") {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function parseMeiliCompleteImage(
  value: unknown,
): MeiliCompleteImage | null {
  const imageRecord = parseObjectRecord(value);

  if (!imageRecord) {
    return null;
  }

  const sizesRecord = parseObjectRecord(imageRecord.sizes);
  const candidateRecords = sizesRecord
    ? [sizesRecord, imageRecord]
    : [imageRecord];
  const parsed: MeiliCompleteImage = {};

  IMAGE_KEYS.forEach((key) => {
    const normalizedUrl = candidateRecords
      .map((record) => normalizeImageUrl(record[key]))
      .find((url): url is string => Boolean(url));

    if (normalizedUrl) {
      parsed[key] = normalizedUrl;
    }
  });

  return IMAGE_KEYS.some((key) => parsed[key]) ? parsed : null;
}

export function getMeiliCompleteImageFallback(
  image?: MeiliCompleteImage | null,
): string | null {
  if (!image) {
    return null;
  }

  return (
    image.large ??
    image.medium ??
    image.small ??
    image.og ??
    image.square ??
    null
  );
}

export function toMediaFromMeiliCompleteImage(
  image: MeiliCompleteImage | null | undefined,
  altText?: string | null,
): Media | null {
  if (!image) {
    return null;
  }

  const fallbackUrl = getMeiliCompleteImageFallback(image);

  if (!fallbackUrl) {
    return null;
  }

  return {
    id: 0,
    createdAt: "",
    updatedAt: "",
    alt: altText ?? "",
    url: fallbackUrl,
    sizes: {
      ...(image.small ? { small: { url: image.small } } : {}),
      ...(image.medium ? { medium: { url: image.medium } } : {}),
      ...(image.large ? { large: { url: image.large } } : {}),
      ...(image.og ? { og: { url: image.og } } : {}),
      ...(image.square ? { square: { url: image.square } } : {}),
    },
  };
}

export function toMediaFromUrl(
  url: string | null | undefined,
  altText?: string | null,
): Media | null {
  const normalizedUrl = normalizeImageUrl(url);

  if (!normalizedUrl) {
    return null;
  }

  return {
    id: 0,
    createdAt: "",
    updatedAt: "",
    alt: altText ?? "",
    url: normalizedUrl,
  };
}
