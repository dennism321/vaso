import type { NextConfig } from "next";

// Static site: `next build` writes plain HTML/CSS/JS to ./out (no server or database needed).
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
