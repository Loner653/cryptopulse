import ClientLayout from "./ClientLayout"; // Import the client component
import "./global.css"; // Keep global styles

export const metadata = {
  title: "CryptoGlobal",
  description: "Your hub for crypto updates, news, and real-time tracking",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense script - loads on all pages */}
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