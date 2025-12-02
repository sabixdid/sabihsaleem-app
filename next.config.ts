import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Force Webpack for Next.js 16 + next-pwa
  turbopack: {},

  webpack: (config) => {
    return config;
  },

  // Disable TS errors during production build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint errors during build too
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
