import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend-only: `next build` emits a fully static site into `out/`.
  output: "export",
  // No image optimization server in a static export; assets are pre-sized.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
