/** @type {import('next').NextConfig} */
const nextConfig = {
  // Changed from 'export' to enable API routes
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['images.pexels.com', 'images.unsplash.com', 'res-console.cloudinary.com', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;