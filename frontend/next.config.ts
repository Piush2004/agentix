import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '50mb',
    },
    middlewareClientMaxBodySize: 52428800, // 50MB limit for rewrites proxy
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/workspace',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/onboarding',
        destination: '/dashboard',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;
