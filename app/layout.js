import ClientLayout from "./ClientLayout";
import "./global.css";

export const metadata = {
  title: "CryptoGlobal",
  description: "Your hub for crypto updates, news, and real-time tracking",
  icons: {
    icon: "/favicon.png" // Changed to PNG
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8535596092968633"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}