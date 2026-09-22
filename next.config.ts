import type { NextConfig } from "next";

const noIndexGenerated = [
  {
    source: "/generated/:path*",
    headers: [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
      { key: "Cache-Control", value: "private, max-age=86400" },
    ],
  },
  {
    source: "/api/media/:path*",
    headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
  },
];

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingIncludes: {
    "*": ["./prisma/dev.db"],
  },
  async redirects() {
    return [
      { source: "/approach", destination: "/services", permanent: true },
      { source: "/studio", destination: "/about", permanent: true },
    ];
  },
  async headers() {
    return noIndexGenerated;
  },
  images: {
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fal.media",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "v3.fal.media",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
