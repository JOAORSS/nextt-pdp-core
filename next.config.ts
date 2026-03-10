import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['*.trycloudflare.com'],
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
