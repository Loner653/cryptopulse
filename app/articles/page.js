// app/articles/page.js
import { headers } from "next/headers"; // Import headers for server-side context
import ArticlesContentServer from "./ArticlesContentServer";
import ArticlesContentClient from "./ArticlesContentClient";

// Force dynamic rendering to allow headers()
export const dynamic = "force-dynamic";

export default function ArticlesPage() {
  const headersList = headers();
  const host = headersList.get("host"); // e.g., yourdomain.com or localhost:3000
  const protocol = headersList.get("x-forwarded-proto") || "https"; // Default to https for production
  const origin = `${protocol}://${host}`; // e.g., https://yourdomain.com

  return (
    <ArticlesContentClient>
      <ArticlesContentServer origin={origin} />
    </ArticlesContentClient>
  );
}