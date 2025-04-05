"use client";

import ClientLayout from "./ClientLayout";

export default function ClientWrapper({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}