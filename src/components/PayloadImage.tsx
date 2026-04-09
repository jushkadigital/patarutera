import { Media } from "@/cms-types";
import { BASEURL } from "@/lib2/config";
import Image, { ImageProps } from "next/image";

type SizeKey = keyof NonNullable<Media["sizes"]>;

type PayloadImageCandidate = {
  url?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
};

type OverrideImageProps = Omit<ImageProps, "src" | "alt"> & {
  media: Media;
  className?: string;
  fill?: boolean;
  sources?: {
    media: string;
    sizeKey: SizeKey;
  }[];
  fallbackSize?: SizeKey;
};

const INVALID_URL_SUFFIXES = ["/null", "/undefined"];

const encodePathSegment = (segment: string) => {
  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
};

const encodeUrl = (value: string) => {
  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const parsed = new URL(value);
      parsed.pathname = parsed.pathname
        .split("/")
        .map((segment) => encodePathSegment(segment))
        .join("/");
      return parsed.toString();
    }

    if (value.startsWith("//")) {
      const parsed = new URL(`https:${value}`);
      parsed.pathname = parsed.pathname
        .split("/")
        .map((segment) => encodePathSegment(segment))
        .join("/");
      return parsed.toString().replace(/^https:/, "");
    }

    return encodeURI(value);
  } catch {
    return encodeURI(value);
  }
};

const isSerializedInvalidUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return true;

  const withoutQuery =
    (trimmed.split("?")[0] ?? trimmed).split("#")[0] ?? trimmed;
  const lower = withoutQuery.toLowerCase();

  if (lower === "null" || lower === "undefined") return true;
  if (INVALID_URL_SUFFIXES.some((suffix) => lower.endsWith(suffix)))
    return true;

  try {
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      const path = new URL(lower).pathname;
      return INVALID_URL_SUFFIXES.some((suffix) => path.endsWith(suffix));
    }

    if (lower.startsWith("//")) {
      const path = new URL(`https:${lower}`).pathname;
      return INVALID_URL_SUFFIXES.some((suffix) => path.endsWith(suffix));
    }
  } catch {
    return lower.endsWith("/null") || lower.endsWith("/undefined");
  }

  return false;
};

const normalizeUrl = (url?: string | null) => {
  if (!url) return null;

  const trimmed = url.trim();
  if (isSerializedInvalidUrl(trimmed)) return null;

  const resolved =
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("//")
      ? trimmed
      : BASEURL
        ? `${BASEURL.replace(/\/$/, "")}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`
        : trimmed;

  if (isSerializedInvalidUrl(resolved)) return null;
  return encodeUrl(resolved);
};

const hasUsableUrl = (
  candidate?: PayloadImageCandidate | null,
): candidate is PayloadImageCandidate => {
  return Boolean(normalizeUrl(candidate?.url));
};

const getLargestValidSize = (sizes?: NonNullable<Media["sizes"]>) => {
  if (!sizes) return null;

  const candidates = Object.values(sizes).filter((size) => hasUsableUrl(size));
  if (!candidates.length) return null;

  return candidates.reduce((largest, current) => {
    const largestWidth = largest.width ?? 0;
    const currentWidth = current.width ?? 0;
    return currentWidth > largestWidth ? current : largest;
  });
};

export default function PayloadImage({
  media,
  className,
  sources = [
    { media: "(max-width: 640px)", sizeKey: "small" },
    { media: "(max-width: 1024px)", sizeKey: "medium" },
    { media: "(min-width: 1025px)", sizeKey: "large" },
  ],
  fallbackSize = "large",
  fill,
  priority,
  fetchPriority,
  loading,
  ...props
}: OverrideImageProps) {
  if (!media) return null;

  const preferredFallback = media.sizes?.[fallbackSize];
  const largestSize = getLargestValidSize(media.sizes);
  const selectedCandidate = hasUsableUrl(preferredFallback)
    ? preferredFallback
    : (largestSize ?? {
        url: media.url,
        width: media.width,
        height: media.height,
        mimeType: media.mimeType,
      });

  const src = normalizeUrl(selectedCandidate.url) ?? "/placeholder.svg";
  const width = selectedCandidate.width ?? media.width ?? 1200;
  const height = selectedCandidate.height ?? media.height ?? 800;
  const pictureClassName = fill
    ? "absolute inset-0 block h-full w-full"
    : undefined;
  const resolvedLoading = priority ? undefined : (loading ?? "lazy");
  const resolvedFetchPriority =
    fetchPriority ?? (priority ? "high" : undefined);

  return (
    <picture className={pictureClassName}>
      {sources.map((source) => {
        const size = media.sizes?.[source.sizeKey];
        const sourceUrl = normalizeUrl(size?.url);
        if (!sourceUrl) return null;

        return (
          <source
            key={source.media}
            srcSet={sourceUrl}
            media={source.media}
            type={size?.mimeType || undefined}
          />
        );
      })}

      {fill ? (
        <Image
          {...props}
          src={src}
          alt={media.alt || ""}
          fill
          className={className}
          priority={priority}
          fetchPriority={resolvedFetchPriority}
          loading={resolvedLoading}
          unoptimized
        />
      ) : (
        <Image
          {...props}
          src={src}
          alt={media.alt || ""}
          width={width}
          height={height}
          className={className}
          priority={priority}
          fetchPriority={resolvedFetchPriority}
          loading={resolvedLoading}
          unoptimized
        />
      )}
    </picture>
  );
}
