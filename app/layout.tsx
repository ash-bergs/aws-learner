import type { Metadata } from "next";
import Header from "./components/layout/Header";
import { SecondaryHeader } from "./components/layout/SecondaryHeader";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

import "@fontsource/poppins/index.css";

export const metadata: Metadata = {
  title: "Trekbit",
  description: "Level up your habits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`font-sans antialiased`}>
          <Header />
          <SecondaryHeader />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
