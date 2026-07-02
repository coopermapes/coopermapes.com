export default function TermsSection() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: 13, color: "#9A9A95", margin: "0 0 40px" }}>
          Effective Date: July 1, 2026
        </p>

        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#3A3A3A", margin: "0 0 32px" }}>
          Cooper Mapes (&ldquo;Cooper Mapes,&rdquo; &ldquo;I,&rdquo; &ldquo;me,&rdquo; or &ldquo;my&rdquo;) provides marching band arranging, part editing, and flip folder conversion services. By using this website or engaging these services, you agree to the terms below.
        </p>

        {[
          {
            heading: "Services",
            body: "Services are offered on a per-project, quote basis: Flip Folder Conversion, Part Editing & Revoicing, and Custom Arranging. Pricing is determined per project after a quote request and is not published on this site.",
          },
          {
            heading: "Payment Terms",
            body: "Projects require a 50% deposit of the total service cost, due upon acceptance of a quote. Work begins once the deposit payment has been submitted and cleared. The remaining 50% is due upon completion of the final files and must be paid in full before files are released.",
          },
          {
            heading: "Cancellation",
            body: "Deposits are non-refundable once work has started. If a project is cancelled before work begins, the deposit will be refunded, minus any time already spent on preliminary planning, at my discretion.",
          },
          {
            heading: "Scope & Revisions",
            body: "Each project covers the service and scope described in the accepted quote. Requests beyond that scope (additional movements, parts, or arrangement changes not originally discussed) may be billed separately upon request.",
          },
          {
            heading: "Ownership",
            body: "Full rights to delivered arrangements and files transfer to the client only upon receipt of final payment in full.",
          },
          {
            heading: "Source Material & Licensing",
            body: "Clients are responsible for ensuring they hold the necessary rights, licenses, or permissions for any copyrighted music supplied for arranging, editing, or conversion. Cooper Mapes is not responsible for verifying third-party copyright ownership of client-supplied material.",
          },
          {
            heading: "Limitation of Liability",
            body: "Services are provided on an as-described basis. Cooper Mapes is not liable for indirect, incidental, or consequential damages arising from use of delivered materials, to the fullest extent permitted by law.",
          },
          {
            heading: "Dispute Resolution & Governing Law",
            body: "These terms are governed by the laws of the State of Mississippi. Any dispute arising from these terms or services provided will first be addressed through direct written communication between the parties before either party pursues formal action.",
          },
          {
            heading: "Changes to These Terms",
            body: "These terms may be updated from time to time. Continued use of this site or engagement of services after changes constitutes acceptance of the updated terms.",
          },
          {
            heading: "Contact",
            body: "Questions about these terms can be sent to contact@coopermapes.com.",
          },
        ].map((s, index) => (
          <div key={`terms-${index}`} style={{ marginBottom: 28 }}>
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
