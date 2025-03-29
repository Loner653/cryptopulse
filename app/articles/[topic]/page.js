// app/articles/[topic]/page.js
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ArticlesContentClient from "../ArticlesContentClient";
import ArticlesContentServer from "../ArticlesContentServer";

export const dynamic = "force-dynamic";

// Mapping 15 topics to their article IDs
const topicMapping = {
  "bitcoin-origins": ["origin-of-bitcoin"],
  "real-world-assets": ["real-world-assets"],
  "healthcare-blockchain": ["healthcare-blockchain"],
  "global-currency": ["cryptocurrency-global-currency"],
  "ethereum-evolution": ["evolution-of-ethereum"],
  "stablecoins": ["stablecoins"],
  "gaming-crypto": ["crypto-adoption-gaming"],
  "security": ["crypto-security"],
  "defi": ["defi-explained"],
  "nfts": ["nft-boom"],
  "blockchain-scalability": ["scaling-solutions"],
  "crypto-regulation": ["crypto-laws"],
  "altcoin-innovations": ["altcoin-rise"],
  "crypto-mining": ["mining-economics"],
  "future-of-money": ["money-future"],
};

export async function generateMetadata({ params }) {
  const { topic } = params;
  const topicName = topic
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return {
    title: `${topicName} Articles | CryptoPulse`,
    description: `Explore articles about ${topicName.toLowerCase()} in the cryptocurrency world.`,
  };
}

export default function TopicPage({ params }) {
  const { topic } = params;
  const articleIds = topicMapping[topic];

  if (!articleIds) {
    notFound();
  }

  const headersList = headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const origin = `${protocol}://${host}`;

  return (
    <ArticlesContentClient>
      <ArticlesContentServer origin={origin} topic={topic} articleIds={articleIds} />
    </ArticlesContentClient>
  );
}

export async function generateStaticParams() {
  return Object.keys(topicMapping).map((topic) => ({
    topic,
  }));
}