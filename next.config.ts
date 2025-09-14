import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/components', '@/lib'],
  },
  // Enable compression
  compress: true,
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Generate static pages at build time where possible
  generateBuildId: async () => {
    return 'meditations-build-' + Date.now();
  },
};

export default nextConfig;
