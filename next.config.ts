import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Frontend-only: `next build` emits a fully static site into `out/`.
  output: "export",
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
