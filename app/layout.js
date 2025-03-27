import ClientLayout from "./ClientLayout"; // Import the client component
import "./global.css"; // Keep global styles

export const metadata = {
  title: "CryptoPulse",
  description: "Your hub for crypto airdrops, news, and real-time tracking",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}