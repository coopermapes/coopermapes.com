import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import { PostHogProvider } from "./components/PostHogProvider";

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

const SITE_DESCRIPTION =
  "Custom marching band arrangements, part editing & revoicing, and flip folder conversion by Cooper Mapes, an arranger, composer, and educator in Hernando, Mississippi.";

export const metadata: Metadata = {
  metadataBase: new URL("https://coopermapes.com"),
  title: {
    default: "Cooper Mapes | Marching Band Arranger, Composer & Educator",
    template: "%s - Cooper Mapes",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://coopermapes.com",
    siteName: "Cooper Mapes",
    title: "Cooper Mapes | Marching Band Arranger, Composer & Educator",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Cooper Mapes | Marching Band Arranger, Composer & Educator",
    description: SITE_DESCRIPTION,
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

// Entity declaration for search engines and AI systems: who Cooper Mapes is,
// which profiles are the same person (sameAs), and that this site is his.
// The sameAs list is the disambiguation signal vs. the other Cooper Mapeses
// (junior golfer, baseball player) and John Mapes (percussion designer).
const ENTITY_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://coopermapes.com/#person",
      name: "Cooper Mapes",
      url: "https://coopermapes.com",
      jobTitle: ["Marching Band Arranger", "Composer", "Music Educator"],
      description:
        "Cooper Mapes is a marching band arranger, composer, and music educator based in Hernando, Mississippi. He offers custom marching band arrangements, part editing and revoicing, and flip folder conversion for school band programs.",
      email: "mailto:contact@coopermapes.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hernando",
        addressRegion: "MS",
        addressCountry: "US",
      },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "University of Mississippi",
          sameAs: "https://olemiss.edu",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "University of Memphis",
          sameAs: "https://www.memphis.edu",
        },
      ],
      knowsAbout: [
        "marching band arranging",
        "music composition",
        "music theory",
        "music engraving",
        "flip folder conversion",
      ],
      sameAs: [
        "https://www.linkedin.com/in/coopermapes/",
        "https://youtube.com/@coopermapes",
        "https://www.instagram.com/coopermapes",
        "https://www.facebook.com/ctmapes/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://coopermapes.com/#website",
      name: "Cooper Mapes",
      url: "https://coopermapes.com",
      publisher: { "@id": "https://coopermapes.com/#person" },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ENTITY_JSONLD) }}
        />
        <PostHogProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Nav />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </PostHogProvider>
        </body>
    </html>
  );
}
