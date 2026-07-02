type LegalSection = { heading: string; body: string };

export default function LegalPage({ title, effectiveDate, intro, sections }: {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section style={{ background: "#ffffff", paddingTop: "98px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px clamp(32px, 3.5vw, 52px)" }}>
        <h1 style={{
          fontFamily: "var(--font-anton)",
          fontSize: "clamp(44px, 6.5vw, 80px)",
          fontWeight: 400,
          letterSpacing: "-1.5px",
          textTransform: "uppercase",
          color: "#111111",
          margin: "0 0 8px",
        }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, color: "#9A9A95", margin: "0 0 40px" }}>
          Effective Date: {effectiveDate}
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#3A3A3A", margin: "0 0 32px" }}>
          {intro}
        </p>

        {sections.map((s, index) => (
          <div key={`${title}-${index}`} style={{ marginBottom: 28 }}>
            <h2 style={{
              fontFamily: "var(--font-inter)",
              fontSize: 15,
              fontWeight: 600,
              color: "#111111",
              margin: "0 0 8px",
            }}>
              {s.heading}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#5A5A5A", margin: 0 }}>
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
