// app/faq/page.js
import FAQPage from "./FAQPage";

// SEO Metadata
export const metadata = {
  title: "CryptoGlobal FAQ - Ultimate Guide to Cryptocurrency Questions",
  description:
    "Find answers to all your cryptocurrency questions on CryptoGlobal’s FAQ page. Learn about blockchain, DeFi, NFTs, staking, scams, wallets, and more at www.cryptoglobalive.com.",
  keywords:
    "cryptocurrency FAQ, blockchain guide, DeFi explained, NFT basics, crypto staking, avoid crypto scams, future of crypto, crypto wallets, CryptoGlobal FAQ, crypto investing",
  openGraph: {
    title: "CryptoGlobal FAQ - Ultimate Guide to Cryptocurrency Questions",
    description:
      "Explore detailed answers to your crypto questions on CryptoGlobal. Learn about blockchain, DeFi, NFTs, staking, and more.",
    url: "https://www.cryptoglobalive.com/faq",
    siteName: "CryptoGlobal",
    type: "website",
    images: [
      {
        url: "https://www.cryptoglobalive.com/og-image-faq.jpg", // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "CryptoGlobal FAQ Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CryptoGlobal FAQ - Ultimate Guide to Cryptocurrency Questions",
    description:
      "Explore detailed answers to your crypto questions on CryptoGlobal. Learn about blockchain, DeFi, NFTs, staking, and more.",
    image: "https://www.cryptoglobalive.com/og-image-faq.jpg", // Replace with your actual Twitter image URL
  },
};

// Structured Data for FAQPage Schema (SEO)
const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Cryptocurrency?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Cryptocurrency is a digital or virtual form of money that uses cryptography for security. Unlike traditional currencies issued by governments (like the US dollar or euro), cryptocurrencies operate on decentralized networks, typically based on blockchain technology. Bitcoin, created in 2009 by Satoshi Nakamoto, was the first cryptocurrency and remains the most well-known. Today, there are over 10,000 cryptocurrencies, with a total market cap exceeding $3 trillion as of March 29, 2025. Cryptocurrencies enable peer-to-peer transactions without intermediaries, offering benefits like transparency, security, and global accessibility, but they also come with risks like volatility and regulatory uncertainty.",
      },
    },
    // Add more mainEntity items for each FAQ question if desired for better SEO
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FAQPage />
    </>
  );
}