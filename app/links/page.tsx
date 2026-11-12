import type { Metadata } from "next";
import LinksSection from "../components/LinksSection";

export const metadata: Metadata = {
  title: "Links",
  description: "Cooper Mapes — arranger, composer, and educator. All my links in one place.",
  alternates: { canonical: "/links" },
};

export default function LinksPage() {
  return <LinksSection />;
}
