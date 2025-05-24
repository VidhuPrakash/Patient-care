import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  swcMinify: false,
  transpilePackages: ["@electric-sql/pglite"],
};

export default nextConfig;
