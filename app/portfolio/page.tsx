import PortfolioSection from "../components/PortfolioSection";

export const metadata = {
  title: "Arranging Portfolio",
  description:
    "Selected marching band, drum corps, indoor winds, and brass ensemble arrangements by Cooper Mapes, with audio samples, including BOA Regional and MHSAA State performances.",
  alternates: { canonical: "/portfolio" },
};

// Mirror of the public works in PortfolioSection's WORKS array (locked
// "Coming Soon" entry excluded). If a work is added/renamed there, update it
// here too — this list is what search engines and AI systems read.
const WORKS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Arranging portfolio of Cooper Mapes",
  itemListElement: [
    { name: "Escher Sketch", description: "Marching band show for Olive Branch HS, 2025. Performed at BOA Regional and MHSAA State 2025." },
    { name: "In Calm and Storm", description: "For drum corps." },
    { name: "Ramayana", description: "For drum corps. Percussion by Simon Edwards." },
    { name: "Ignite", description: "For indoor winds." },
    { name: "Amazing Grace", description: "For brass ensemble, Hernando HS, 2024." },
    { name: "Gospel", description: "Flow Chorale, Olive Branch HS, 2025." },
    { name: "Horkstow Grange", description: "Flow Chorale, Olive Branch HS, 2026." },
    { name: "Jurassic Park", description: "Flow Chorale arrangement." },
    { name: "Joy to the World", description: "Parade tune arrangement." },
  ].map((work, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: work.name,
      description: work.description,
      creator: { "@id": "https://coopermapes.com/#person" },
      genre: "Marching band arrangement",
    },
  })),
};

export default function PortfolioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WORKS_JSONLD) }}
      />
      <PortfolioSection />
    </>
  );
}
