import { getClientSideURL } from "@/utilities/getURL";

export const getMediaUrl = (url: string | null | undefined): string => {
  if (!url) return "";

  // Check if URL already has http/https protocol
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Otherwise prepend client-side URL
  const baseUrl = getClientSideURL();
  return `${baseUrl}${url}`;
};
