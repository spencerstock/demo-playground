import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['@base-org/account'],
  // Turbopack configuration for Next.js 16+
  turbopack: {
    resolveAlias: {},
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  webpack: (config) => {
    // Enable symlinks resolution for local package development
    config.resolve.symlinks = true;
    return config;
  },
};

export default nextConfig;
