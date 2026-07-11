import ContactSection from "../components/ContactSection";

export const metadata = {
  title: "Contact: Get in Touch",
  description:
    "Request a quote for flip folder conversion, part editing & revoicing, or custom marching band arranging, or send a general inquiry.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: 98 }}>
      <ContactSection />
    </div>
  );
}
