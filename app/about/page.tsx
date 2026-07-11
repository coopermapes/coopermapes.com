import AboutSection from "../components/AboutSection";

export const metadata = {
  title: "About",
  description:
    "Cooper Mapes is a marching band arranger, composer, and educator: B.A. in Music (Ole Miss), M.M. (University of Memphis), and current DMA candidate in Music Theory & Composition.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 98 }}>
      <AboutSection />
    </div>
  );
}
