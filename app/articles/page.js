import { Suspense } from "react";
import ArticlesContentClient from "./ArticlesContentClient";

export const metadata = {
  title: "Crypto Articles | CryptoPulse",
  description: "Explore in-depth articles on cryptocurrency topics including Bitcoin's origin, Ethereum's evolution, stablecoins, and more.",
};

export default function ArticlesPage() {
  return (
    <Suspense fallback={<div>Loading articles...</div>}>
      <ArticlesContentClient />
    </Suspense>
  );
}