import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Youtube",
  icons: { icon: "/logo.svg" },
};

interface Props {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html>
        <body className={font.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
