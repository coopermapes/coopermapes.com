import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coopermapes.com"),
  title: "Cooper Mapes - Arranger",
  description:
    "Music editing, engraving, and arranging for performing ensembles.",
  openGraph: {
    type: "website",
    url: "https://coopermapes.com",
    siteName: "Cooper Mapes",
    title: "Cooper Mapes - Arranger",
    description:
      "Music editing, engraving, and arranging for performing ensembles.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Cooper Mapes — Arranger, Composer, Educator",
    description:
      "Music editing, engraving, and arranging for performing ensembles.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#111111]">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Nav />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </body>
    </html>
  );
}
