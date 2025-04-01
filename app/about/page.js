import Link from "next/link";
import "./about.css"; // Changed from ./about.module.css to ./about.css

export const metadata = {
  title: "About CryptoGlobal",
  description: "Learn about CryptoGlobal, your go-to source for cryptocurrency analytics, news, and original articles.",
};

export default function About() {
  return (
    <div className="content-container">
      <h1 className="article-section-title">About CryptoGlobal</h1>

      <section className="article-section">
        <h2 className="article-section-subtitle">Our Mission</h2>
        <p>
          Welcome to <strong>CryptoGlobal</strong>, your premier destination for all things cryptocurrency. Our mission is to empower individuals and investors with comprehensive, real-time insights into the ever-evolving world of digital assets. Whether you're a seasoned trader or a curious newcomer, we aim to provide you with the tools, knowledge, and resources to navigate the crypto landscape confidently.
        </p>
        <p>
          At CryptoGlobal, we believe that the future of finance is decentralized, and we’re here to bridge the gap between traditional systems and the blockchain revolution. Through detailed analytics, up-to-date news, and thought-provoking articles, we strive to foster a community of informed enthusiasts and professionals.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">What We Offer</h2>
        <ul className="article-list">
          <li>
            <strong>Cryptocurrency Analytics:</strong> Real-time data on market trends, DeFi metrics, and asset performance sourced from industry-leading platforms.
          </li>
          <li>
            <strong>News Headlines:</strong> Stay updated with the latest developments in the crypto space, aggregated from reliable sources via schema-based feeds.
          </li>
          <li>
            <strong>Original Articles:</strong> In-depth, expertly crafted content written by our team, covering topics from Bitcoin’s origins to the tokenization of real-world assets.
          </li>
          <li>
            <strong>Interactive Tools:</strong> Charts, historical data, and more to help you analyze and understand market movements.
          </li>
        </ul>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Our Data Sources</h2>
        <p>
          CryptoGlobal is proud to leverage data from some of the most trusted and widely recognized platforms in the cryptocurrency ecosystem. We extend our gratitude to the following free sources that make our analytics possible:
        </p>
        <ul className="article-list">
          <li>
            <strong><Link href="https://www.coingecko.com" target="_blank" className="x-link">CoinGecko</Link>:</strong> For providing comprehensive market data, trending coins, and Binance price insights.
          </li>
          <li>
            <strong><Link href="https://coinmarketcap.com" target="_blank" className="x-link">CoinMarketCap</Link>:</strong> A key resource for market capitalization and cryptocurrency rankings.
          </li>
          <li>
            <strong><Link href="https://www.binance.com" target="_blank" className="x-link">Binance</Link>:</strong> For real-time price data and trading volume metrics via CoinGecko’s integration.
          </li>
          <li>
            <strong><Link href="https://data.messari.io" target="_blank" className="x-link">Messari</Link>:</strong> For detailed asset metrics including market cap and circulating supply.
          </li>
          <li>
            <strong><Link href="https://www.cryptocompare.com" target="_blank" className="x-link">CryptoCompare</Link>:</strong> For top coins by market cap and additional market insights.
          </li>
          <li>
            <strong><Link href="https://api.llama.fi" target="_blank" className="x-link">DefiLlama</Link>:</strong> For DeFi protocol data and total value locked (TVL) metrics.
          </li>
        </ul>
        <p>
          Additionally, our news headlines are fetched from schema-based feeds, ensuring timely and accurate updates from the crypto world. All articles on CryptoGlobal are original works owned and authored by our team.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Our Team</h2>
        <p>
          CryptoGlobal is driven by a passionate team of blockchain enthusiasts, data analysts, and writers dedicated to delivering high-quality content and tools. While we’re a small, independent operation, our commitment to excellence and transparency sets us apart.
        </p>
        <p>
          Have questions or want to get in touch? Reach out to us at{" "}
          <a href="mailto:cryptoglobalive@gmail.com" className="x-link">cryptoglobalive@gmail.com</a>.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Join the CryptoGlobal Community</h2>
        <p>
          We’re more than just a website—we’re a growing community of crypto advocates. Follow us on our journey as we explore the future of finance, one block at a time. Check out our <Link href="/articles" className="x-link">articles</Link>, dive into our <Link href="/analytics" className="x-link">analytics</Link>, or stay updated with the latest <Link href="/news" className="x-link">news</Link>.
        </p>
        <p>
          Thank you for choosing CryptoGlobal as your trusted crypto companion!
        </p>
      </section>
    </div>
  );
}