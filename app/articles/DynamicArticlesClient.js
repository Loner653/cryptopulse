"use client";

import dynamic from "next/dynamic";

// Dynamically import ArticlesContentClient with SSR disabled
const ArticlesContentClient = dynamic(() => import("./ArticlesContentClient"), {
  ssr: false, // Disable server-side rendering for this component
});

export default function DynamicArticlesClient() {
  return <ArticlesContentClient />;
}