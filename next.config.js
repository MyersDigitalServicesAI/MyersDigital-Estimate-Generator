/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable experimental features if needed
  experimental: {
    serverActions: true,
  },
  
  // Configure image domains if using external images
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
