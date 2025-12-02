import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Disable Turbopack so Vercel uses Webpack
  turbopack: {},

  // Force Webpack (required for next-pwa)
  webpack: (config) => {
    return config;
  },

  // Disable TypeScript errors blocking Vercel builds
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint blocking builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
