import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Disable turbopack so Vercel uses webpack
  turbopack: {},

  // Force Webpack
  webpack: (config) => {
    return config;
  },

  // Disable TypeScript build errors on Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
