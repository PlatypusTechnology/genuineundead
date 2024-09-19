import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Header } from "~/components/header";
import "~/styles/globals.css";
import { cn } from "@genuineundead/core";
import { Footer } from "~/components/footer";
import { Providers } from "./providers";


const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Genuine Undead",
  description:
    "Home of the Genuine Undead (GU). Genuine Undead homepage. Find out about what Genuine Undead is all about, the art work, the history, the community that formed around this masterpiece Pixel Art Collection and why we think GU is the most significant NFT collection / collective to date.",
  openGraph: {
    title: "Genuine Undead",
    description:
      "Home of the Genuine Undead (GU). Genuine Undead homepage. Find out about what Genuine Undead is all about, the art work, the history, the community that formed around this masterpiece Pixel Art Collection and why we think GU is the most significant NFT collection / collective to date.",
    url: "https://www.genuineundead.io",
    siteName: "Genuine Undead",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Providers headers={headers()}>
      <div
        className={cn(
          "relative flex min-h-screen flex-col",
          fontSans.className,
        )}
      >
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </Providers>
  );
}