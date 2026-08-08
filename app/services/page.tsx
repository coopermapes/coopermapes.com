import ServicesSection from "../components/ServicesSection";

export const metadata = {
  title: "Ensemble Arranging Services and Pricing",
  description:
    "Custom arrangement ($100–$200), part editing & revoicing ($100–$500), and fall show arranging ($2,000–$3,000) for school band programs.",
  alternates: { canonical: "/services" },
};

// The three services with their published price ranges, marked up so search
// engines and AI systems can cite concrete offerings and pricing.
const SERVICES_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Custom Arrangement",
      serviceType: "Custom stands and parade tune arrangement",
      description:
        "Short custom arrangement of a specific song for a marching band stands routine or parade performance, priced by duration.",
      provider: { "@id": "https://coopermapes.com/#person" },
      areaServed: "United States",
      url: "https://coopermapes.com/services",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 100,
          maxPrice: 200,
          priceCurrency: "USD",
        },
      },
    },
    {
      "@type": "Service",
      name: "Part Editing & Revoicing",
      serviceType: "Marching band part editing and revoicing",
      description:
        "Editing and revoicing of existing marching band parts to fit a band's actual instrumentation, ranges, and skill level.",
      provider: { "@id": "https://coopermapes.com/#person" },
      areaServed: "United States",
      url: "https://coopermapes.com/services",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 100,
          maxPrice: 500,
          priceCurrency: "USD",
        },
      },
    },
    {
      "@type": "Service",
      name: "Fall Show Arranging",
      serviceType: "Custom marching band show arrangement",
      description:
        "Fully custom marching band show arrangements written for a specific ensemble, priced by show length and complexity.",
      provider: { "@id": "https://coopermapes.com/#person" },
      areaServed: "United States",
      url: "https://coopermapes.com/services",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: 2000,
          maxPrice: 3000,
          priceCurrency: "USD",
        },
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_JSONLD) }}
      />
      <ServicesSection />
    </>
  );
}
