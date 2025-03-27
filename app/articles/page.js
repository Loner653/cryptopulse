// app/articles/page.js
import { headers } from "next/headers"; // Import headers for server-side context
import ArticlesContentServer from "./ArticlesContentServer";
import ArticlesContentClient from "./ArticlesContentClient";

export default function ArticlesPage() {
  const headersList = headers();
  const host = headersList.get("host"); // e.g., localhost:3000
  const protocol = headersList.get("x-forwarded-proto") || "https"; // Detect protocol (http or https)
  const origin = `${protocol}://${host}`; // Construct origin, e.g., https://localhost:3000

  return (
    <ArticlesContentClient>
      <ArticlesContentServer origin={origin} />
    </ArticlesContentClient>
  );
}