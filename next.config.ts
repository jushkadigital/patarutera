import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{
      protocol: "http",
      hostname: "localhost",
      port: "3000",
      pathname: "/**"
    },
    {
      protocol: "https",
      hostname: "patarutera.pe",
      pathname: "/**"
    },
    {
      protocol: "https",
      hostname: "patarutera.pe",
      pathname: "/**"
    },
    {
      protocol: "https",
      hostname: "patarutera.com",
      pathname: "/**"
    }
  ],
  },
};

export default nextConfig;
