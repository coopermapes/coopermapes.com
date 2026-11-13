import ContactSection from "../components/ContactSection";

export const metadata = {
  title: "Contact: Get in Touch",
  description:
    "Get in touch with Cooper Mapes about arranging, part editing, or any other project inquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: 98 }}>
      <ContactSection />
    </div>
  );
}
