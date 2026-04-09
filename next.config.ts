import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/shoptinthanh-evolved",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;