/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "assets.coingecko.com",
          pathname: "/**",
        },
      ],
    },
    async redirects() {
      return [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "cryptopulse-nu.vercel.app",
            },
          ],
          destination: "https://cryptoglobalive.com/:path*",
          permanent: true,
        },
      ];
    },
    compress: false, // Disable gzip compression
    async headers() {
      return [
        {
          source: "/api/ticker-prices",
          headers: [
            {
              key: "Content-Type",
              value: "application/json",
            },
            {
              key: "Cache-Control",
              value: "no-store, max-age=0",
            },
          ],
        },
      ];
    },
    eslint: {
      ignoreDuringBuilds: false,
      dirs: ['app'],
    },
    overrides: [
      {
        files: ['app/chart/CryptoChart.js'],
        rules: {
          'react-hooks/exhaustive-deps': 'warn',
        },
      },
      {
        files: ['app/chat/page.js'],
        rules: {
          '@next/next/no-img-element': 'warn',
        },
      },
      {
        files: ['app/quiz/page.js'],
        rules: {
          'react-hooks/exhaustive-deps': 'warn',
        },
      },
    ],
  };
  
  export default nextConfig;