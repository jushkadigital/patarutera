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
      hostname: "cms.patarutera.pe",
      port:"",
      pathname: "/**"
    },
    {
      protocol: "https",
      hostname: "cms.patarutera.pe",
      port:"",
      pathname: "/**"
    },
    {
      protocol: "https",
      hostname: "cms.patarutera.com",
      port:"",
      pathname: "/**"
    }
  ],
  },
  experimental: {
    nextScriptWorkers: true,
  },
};

export default nextConfig;
