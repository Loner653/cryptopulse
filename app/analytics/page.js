import DataFetcher from "./DataFetcher";
import AnalyticsClient from "./AnalyticsClient";
import ErrorBoundary from "./ErrorBoundary";

export const metadata = {
  title: "Crypto Analytics | CryptoPulse",
  description: "Get the latest cryptocurrency analytics, including market overview, DeFi metrics, trending coins, Binance prices, and more.",
};

export default async function Analytics() {
  return (
    <ErrorBoundary>
      <DataFetcher>
        {(props) => (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  name: "Crypto Analytics",
                  description: "Real-time cryptocurrency analytics including market data, DeFi metrics, trending coins, Binance prices, and more.",
                  mainEntity: [
                    {
                      "@type": "ItemList",
                      name: "Market Overview",
                      itemListElement: props.marketData.map((coin, index) => ({
                        "@type": "ListItem",
                        position: index + 1,
                        item: {
                          "@type": "CryptoCurrency",
                          name: coin.name,
                          currentPrice: coin.current_price,
                          currency: "USD",
                        },
                      })),
                    },
                  ],
                }),
              }}
            />
            <AnalyticsClient {...props} />
          </>
        )}
      </DataFetcher>
    </ErrorBoundary>
  );
}