import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alex Coupon Inbox",
    short_name: "Alex Inbox",
    description:
      "Private live inbox for Anndrea's coupon redemptions and wishes.",
    start_url: "/alex",
    scope: "/",
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#faf4eb",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
