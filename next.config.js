/** @type {import('next').NextConfig} */
const nextConfig = {
  // Changed from 'export' to enable API routes
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;