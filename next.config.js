/** @type {import('next').NextConfig} */
const nextConfig = {
  // Changed from 'export' to enable API routes
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // matches all domains
      },
    ],
  },
};

module.exports = nextConfig;