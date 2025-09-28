import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: false,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
