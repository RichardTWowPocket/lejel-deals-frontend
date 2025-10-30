import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to succeed even if there are type errors
    ignoreBuildErrors: true,
  },
  outputFileTracingRoot: "/Users/richardtandean/Documents/work/lejel-deals-new",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
