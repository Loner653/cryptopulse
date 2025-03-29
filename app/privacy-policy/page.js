import Link from "next/link";
import "../global.css";

export const metadata = {
  title: "Privacy Policy | CryptoGlobal",
  description: "Read CryptoGlobal's Privacy Policy to understand how we handle your data and protect your privacy.",
};

export default function PrivacyPolicy() {
  return (
    <div className="content-container">
      <h1 className="article-section-title">Privacy Policy</h1>
      <p className="article-image-caption">Last Updated: March 29, 2025</p>

      <section className="article-section">
        <h2 className="article-section-subtitle">Introduction</h2>
        <p>
          At <strong>CryptoGlobal</strong>, we value your privacy and are committed to protecting any information you share with us. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website, accessible at [insert your domain here]. By using CryptoGlobal, you agree to the practices described in this policy.
        </p>
        <p>
          Our services include cryptocurrency analytics, news headlines, and original articles. We rely on trusted third-party data sources and schema-based feeds, but we prioritize transparency and user trust in everything we do.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul className="article-list">
          <li>
            <strong>Personal Information:</strong> If you contact us directly (e.g., via email at <a href="mailto:cryptoglobalive@gmail.com" className="x-link">cryptoglobalive@gmail.com</a>), we may collect your name, email address, or other details you provide.
          </li>
          <li>
            <strong>Usage Data:</strong> We use Vercel Analytics to collect anonymized data about how you interact with our site, such as page views, session duration, and device type. This helps us improve your experience.
          </li>
          <li>
            <strong>Cookies:</strong> We may use cookies or similar technologies to enhance functionality and track usage patterns. You can manage cookie preferences through your browser settings.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> We do not collect sensitive financial information (e.g., wallet addresses or transaction details) unless explicitly provided by you in correspondence.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">How We Use Your Information</h2>
        <p>Your data is used solely to:</p>
        <ul className="article-list">
          <li>Provide and improve our services, such as delivering accurate analytics and relevant content.</li>
          <li>Respond to your inquiries or feedback sent to <a href="mailto:cryptoglobalive@gmail.com" className="x-link">cryptoglobalive@gmail.com</a>.</li>
          <li>Analyze site performance and user behavior anonymously via Vercel Analytics.</li>
        </ul>
        <p>We do not sell, trade, or share your personal information with third parties, except as required by law.</p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Third-Party Data Sources</h2>
        <p>
          CryptoGlobal integrates data from the following free and reputable sources to power our analytics and news features. We credit and thank them for their contributions:
        </p>
        <ul className="article-list">
          <li>
            <strong><Link href="https://www.coingecko.com" target="_blank" className="x-link">CoinGecko</Link>:</strong> Market data and trending coins.
          </li>
          <li>
            <strong><Link href="https://coinmarketcap.com" target="_blank" className="x-link">CoinMarketCap</Link>:</strong> Market capitalization and rankings.
          </li>
          <li>
            <strong><Link href="https://www.binance.com" target="_blank" className="x-link">Binance</Link>:</strong> Price and volume data via CoinGecko.
          </li>
          <li>
            <strong><Link href="https://data.messari.io" target="_blank" className="x-link">Messari</Link>:</strong> Asset metrics.
          </li>
          <li>
            <strong><Link href="https://www.cryptocompare.com" target="_blank" className="x-link">CryptoCompare</Link>:</strong> Top coin data.
          </li>
          <li>
            <strong><Link href="https://api.llama.fi" target="_blank" className="x-link">DefiLlama</Link>:</strong> DeFi TVL metrics.
          </li>
        </ul>
        <p>
          News headlines are sourced from schema-based feeds, ensuring timely updates. Our articles are original content owned by CryptoGlobal.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Data Security</h2>
        <p>
          We take reasonable measures to protect your data from unauthorized access, loss, or misuse. However, no online platform can guarantee absolute security. Any personal information you send us (e.g., via email) is stored securely and only accessed by authorized team members.
        </p>
        <p>
          Our site is hosted on Vercel, which provides robust security standards. For more details, see <Link href="https://vercel.com/security" target="_blank" className="x-link">Vercel’s Security Policy</Link>.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="article-list">
          <li>Request access to any personal data we hold about you.</li>
          <li>Request corrections or deletion of your data.</li>
          <li>Opt out of cookies via your browser settings.</li>
        </ul>
        <p>
          To exercise these rights, contact us at <a href="mailto:cryptoglobalive@gmail.com" className="x-link">cryptoglobalive@gmail.com</a>.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy as our services evolve. Changes will be posted here with an updated "Last Updated" date. We encourage you to review this page periodically.
        </p>
      </section>

      <section className="article-section">
        <h2 className="article-section-subtitle">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or our practices, reach out to us at:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:cryptoglobalive@gmail.com" className="x-link">cryptoglobalive@gmail.com</a>
        </p>
        <p>
          Thank you for trusting CryptoGlobal with your crypto journey!
        </p>
      </section>
    </div>
  );
}