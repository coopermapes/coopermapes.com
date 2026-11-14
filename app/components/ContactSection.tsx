"use client";

import { useEffect, useRef, useState } from "react";
import { Envelope, ArrowRight } from "@phosphor-icons/react";
import GridPattern from "./GridPattern";
import { useIsMobile } from "../hooks/useIsMobile";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaeoqdzn";

// Same scroll-triggered fade-up used on Projects and Portfolio.
function ScrollFadeUp({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter)",
  fontSize: 15,
  color: "#111111",
  background: "#FFFFFF",
  border: "1px solid #DCDBD7",
  padding: "12px 14px",
  width: "100%",
};

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} style={{ fontFamily: "var(--font-inter)", fontSize: 17, fontWeight: 600, color: "#111111" }}>
      {children}{" "}
      <span style={{ fontWeight: 400, color: "#5A5A5A", fontSize: 14 }}>(required)</span>
    </label>
  );
}

function Field({
  label, id, type = "text", value, onChange,
}: {
  label: string; id: string; type?: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        name={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

export default function ContactSection() {
  const isMobile = useIsMobile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const isValid = firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ "First Name": firstName, "Last Name": lastName, Email: email, Message: message }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#FFFFFF", minHeight: "calc(100vh - 98px)" }}>
      {!isMobile && <GridPattern interactive={false} />}

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 560,
        margin: "0 auto",
        padding: isMobile
          ? "clamp(48px,12vw,64px) clamp(20px,5vw,40px)"
          : "clamp(72px,9vw,112px) clamp(24px,5vw,64px)",
      }}>
        <ScrollFadeUp delay={150}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 12 }}>
          <h1 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(44px,6.5vw,80px)", lineHeight: ".92", letterSpacing: "-1.5px", textTransform: "uppercase", color: "#111111", margin: 0 }}>
            Get In Touch
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#5A5A5A", maxWidth: 440, lineHeight: 1.8, margin: 0 }}>
            For any questions, inquiries, or music services, get in direct contact with me by filling out the form below.
          </p>
        </div>
        </ScrollFadeUp>

        <ScrollFadeUp delay={350}>
        {submitted ? (
          <div style={{ marginTop: 40, border: "1px solid #DCDBD7", background: "#FFFFFF", padding: "40px 32px", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, margin: "0 auto 16px", display: "grid", placeItems: "center", background: "#1254D9", color: "#FFFFFF" }}>
              <Envelope size={22} weight="regular" />
            </div>
            <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)", lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "-.5px", color: "#111111", margin: 0 }}>
              Sent!
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, lineHeight: 1.8, color: "#5A5A5A", marginTop: 12 }}>
              Expect to hear back from me soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20, border: "1px solid #DCDBD7", background: "#FFFFFF", padding: isMobile ? 24 : 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
              <Field label="First Name" id="contact-first-name" value={firstName} onChange={setFirstName} />
              <Field label="Last Name" id="contact-last-name" value={lastName} onChange={setLastName} />
            </div>

            <Field label="Email" id="contact-email" type="email" value={email} onChange={setEmail} />

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <FieldLabel htmlFor="contact-message">How can I help?</FieldLabel>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me a bit about your project."
                style={{ ...inputStyle, resize: "vertical", fontFamily: "var(--font-inter)" }}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || submitting}
              onMouseEnter={isMobile ? undefined : () => setBtnHover(true)}
              onMouseLeave={isMobile ? undefined : () => setBtnHover(false)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase",
                color: "#FFFFFF",
                background: !isValid || submitting ? "#1254D9" : btnHover ? "#0E45B5" : "#1254D9",
                border: "1.5px solid #1254D9",
                padding: "15px 24px",
                cursor: !isValid || submitting ? "default" : "pointer",
                opacity: !isValid || submitting ? 0.55 : 1,
                transition: "background-color .2s ease, opacity .2s ease",
              }}
            >
              {submitting ? "Sending…" : "Send Message"}
              {!submitting && <ArrowRight size={16} />}
            </button>

            {error && (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, color: "#CC3333", margin: 0 }}>
                Something went wrong sending your message. Please try again or email directly.
              </p>
            )}
          </form>
        )}
        </ScrollFadeUp>
      </div>
    </section>
  );
}
