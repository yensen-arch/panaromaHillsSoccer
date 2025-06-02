/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable API routes
  output: 'standalone',
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