/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Keep this as-is
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.coingecko.com", // Allow CoinGecko image URLs
        pathname: "/**", // Match all paths under this domain
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*", // Match all paths on the old domain
        has: [
          {
            type: "host",
            value: "cryptopulse-nu.vercel.app", // Old Vercel preview URL
          },
        ],
        destination: "https://cryptoglobalive.com/:path*", // Redirect to the same path on the new domain
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
};

module.exports = nextConfig;