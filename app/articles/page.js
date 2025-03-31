import { headers } from "next/headers";
import Link from "next/link";
import styles from "./ArticlesContentClient.module.css";

export const metadata = {
  title: "Crypto Articles | CryptoPulse",
  description: "Browse cryptocurrency articles by topic.",
};

// 15 topics
const topics = [
  { name: "Bitcoin Origins", slug: "bitcoin-origins" },
  { name: "Real World Assets", slug: "real-world-assets" },
  { name: "Healthcare & Blockchain", slug: "healthcare-blockchain" },
  { name: "Global Currency", slug: "global-currency" },
  { name: "Ethereum Evolution", slug: "ethereum-evolution" },
  { name: "Stablecoins", slug: "stablecoins" },
  { name: "Gaming & Crypto", slug: "gaming-crypto" },
  { name: "Crypto Security", slug: "security" },
  { name: "Decentralized Finance (DeFi)", slug: "defi" },
  { name: "Non-Fungible Tokens (NFTs)", slug: "nfts" },
  { name: "Blockchain Scalability", slug: "blockchain-scalability" },
  { name: "Crypto Regulation", slug: "crypto-regulation" },
  { name: "Altcoin Innovations", slug: "altcoin-innovations" },
  { name: "Crypto Mining", slug: "crypto-mining" },
  { name: "Future of Money", slug: "future-of-money" },
];

export default async function ArticlesPage() {
  const headersList = await headers(); // Await headers()
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "https";
  const origin = `${protocol}://${host}`;

  return (
    <div className={styles.pageLayout}>
      <main className={styles.mainContainer}>
        <h1 className={styles.articleSectionTitle}>Crypto Articles</h1>
        <div className={styles.tableOfContents}>
          <h2 className={styles.tocTitle}>Table of Contents</h2>
          <ul className={styles.tocList}>
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link href={`/articles/${topic.slug}`} className={styles.tocLink}>
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}