import { Inter } from "next/font/google";
import { cn } from "@genuineundead/core";
import "~/styles/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "h-full min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
