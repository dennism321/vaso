import type { NextConfig } from "next";

// Static site: `next build` writes plain HTML/CSS/JS to ./out (no server or database needed).
// GitHub Pages serves it under /<repo-name>; the Pages workflow sets PAGES_BASE_PATH for that.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
};

export default nextConfig;
