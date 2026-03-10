import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: {
    compilationMode: 'annotation',
  },
  allowedDevOrigins: ['*.trycloudflare.com'],
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;

