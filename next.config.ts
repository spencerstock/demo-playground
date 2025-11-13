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
  webpack: (config) => {
    // Enable symlinks resolution for local package development
    config.resolve.symlinks = true;
    return config;
  },
};

export default nextConfig;
