import { getBaseURL } from "@/lib/util/env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = getBaseURL();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin",
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
