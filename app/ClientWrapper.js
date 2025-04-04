// app/ClientWrapper.js
"use client";

import { NhostProvider, NhostClient } from "@nhost/nextjs";
import ClientLayout from "./ClientLayout";

const nhost = new NhostClient({
  subdomain: process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN,
  region: process.env.NEXT_PUBLIC_NHOST_REGION,
});

export default function ClientWrapper({ children }) {
  return (
    <NhostProvider nhost={nhost}>
      <ClientLayout>{children}</ClientLayout>
    </NhostProvider>
  );
}