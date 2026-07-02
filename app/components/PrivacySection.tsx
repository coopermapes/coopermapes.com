import LegalPage from "./LegalPage";

export default function PrivacySection() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="July 1, 2026"
      intro="This policy explains what information coopermapes.com collects, how it's used, and your choices."
      sections={[
        {
          heading: "Information Collected",
          body: "When you submit a quote request or inquiry through this site, the following information is collected via the contact forms: name, email address, school/organization, phone number (optional), service of interest, how you heard about this site, and any message you provide. This information is sent to and stored by Formspree, the third-party form service used to process these submissions, and is used solely to respond to your request and, if you become a client, to manage that project.",
        },
        {
          heading: "Analytics",
          body: "This site uses PostHog, a third-party analytics tool, to understand how visitors use the site (page views, clicks, and general usage patterns) so it can be improved over time. This site does not use session recording — individual visitor sessions are not recorded or replayed.",
        },
        {
          heading: "Payment Information",
          body: "If you become a client, payment is processed through Zoho Invoice and Stripe. Card and payment details are handled directly by Stripe and are not stored on this site.",
        },
        {
          heading: "Data Sharing",
          body: "Your information is not sold to third parties. It is only shared with the service providers listed above (Formspree, PostHog, Zoho, Stripe) as necessary to operate this site and provide services.",
        },
        {
          heading: "Your Rights",
          body: "You may request to know what information has been collected about you, request its deletion, or opt out of future communication at any time by emailing contact@coopermapes.com.",
        },
        {
          heading: "Children's Privacy",
          body: "This site is not directed at children under 13, and personal information is not knowingly collected from children.",
        },
        {
          heading: "Changes to This Policy",
          body: "This policy may be updated from time to time. Continued use of this site after changes constitutes acceptance of the updated policy.",
        },
        {
          heading: "Contact",
          body: "Questions about this policy can be sent to contact@coopermapes.com.",
        },
      ]}
    />
  );
}
