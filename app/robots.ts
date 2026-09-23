import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/generated/",
          "/api/",
          "/studio/inbox",
          "/studio/products",
          "/studio/orders",
          "/favorites",
          "/cart",
          "/checkout",
          "/order",
        ],
      },
    ],
  };
}
