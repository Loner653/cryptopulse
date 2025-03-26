/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "coin-images.coingecko.com",
          pathname: "/coins/images/**", // Optional: restrict to specific paths
        },
      ],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;