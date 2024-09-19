import "~/styles/globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark" >
      <body className="h-full min-h-screen bg-background font-sans antialiased overscroll-none">
        {children}
      </body>
    </html>
  );
}
