import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  webpack(config: Configuration) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
    };
    return config;
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
