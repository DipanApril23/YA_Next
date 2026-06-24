import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Young-Architects: Aspiring to be the best",
  description: "Official Page of Young Architects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Warm up the font + remote-image origins early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://youngarchitects.in" />
        <link
          rel="dns-prefetch"
          href="https://youngarchitects.in"
        />
        {/* Section fonts (Fraunces / Outfit) — loaded once here instead of via a
            runtime @import inside a component <style> block */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className={`${roboto.variable} antialiased`} suppressHydrationWarning>
        {children}
        <div id="portal-modal-root" />
      </body>
    </html>
  );
}
