import { getServerSideURL } from "@/utilities/getURL";
import type { Metadata, MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots {
    const url = getServerSideURL()
    return {
        rules: [{
            userAgent: '*',
            allow: '/',
            disallow: '/admin'
        }],
        sitemap: `${url}/sitemap.xml`
    }
}