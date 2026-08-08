"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, X } from "@phosphor-icons/react";
import { useIsMobile } from "../hooks/useIsMobile";

const CUSTOM_ARRANGEMENT_PRICING = [
  { duration: ":30", price: "$100" },
  { duration: ":45", price: "$125" },
  { duration: "1:00", price: "$150" },
  { duration: "1:30", price: "$175" },
  { duration: "2:00", price: "$200" },
];

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

function ContactButton({ onClick }: { onClick: () => void }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={isMobile ? undefined : () => setHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setHovered(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        marginTop: 28,
        background: hovered && !isMobile ? "#0E45B5" : "#1254D9",
        color: "#fff",
        border: `1.5px solid ${hovered && !isMobile ? "#0E45B5" : "#1254D9"}`,
        padding: "12px 24px",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: ".6px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background .2s ease, border-color .2s ease, transform 0.1s ease, opacity 0.1s ease",
        fontFamily: "var(--font-inter)",
        borderRadius: 0,
        display: "block",
        transform: isMobile && pressed ? "scale(0.96)" : "scale(1)",
        opacity: isMobile && pressed ? 0.75 : 1,
      }}
    >
      Get In Touch
    </button>
  );
}

function PricingInfoButton({ onClick, buttonRef }: { onClick: () => void; buttonRef: React.RefObject<HTMLButtonElement | null> }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onMouseEnter={isMobile ? undefined : () => setHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setHovered(false)}
      aria-label="View Custom Arrangement pricing by duration"
      style={{
        width: 16, height: 16, border: "none", background: "transparent", color: hovered ? "#1254D9" : "#111111",
        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        flexShrink: 0, padding: 0, opacity: hovered ? 1 : 0.5, transition: "opacity .15s ease, color .15s ease",
      }}
    >
      <Info size={16} weight="regular" />
    </button>
  );
}

function Bullet({ text, html }: { text?: string; html?: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ width: 7, height: 7, background: "#1254D9", marginTop: 8, flexShrink: 0, display: "block" }} />
      {html
        ? <span style={{ fontSize: 16, lineHeight: 1.6, color: "#3A3A3A" }} dangerouslySetInnerHTML={{ __html: html }} />
        : <span style={{ fontSize: 16, lineHeight: 1.6, color: "#3A3A3A" }}>{text}</span>
      }
    </div>
  );
}

function PricingInfoModal({ open, onClose, triggerRef }: { open: boolean; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) {
  const isMobile = useIsMobile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(17,17,17,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 20 : 24 }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", border: "1px solid #DCDBD7", maxWidth: 420, width: "100%", padding: isMobile ? "28px 24px" : "36px 32px", position: "relative", outline: "none" }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close pricing details"
          style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", color: "#767672" }}
        >
          <X size={20} weight="bold" />
        </button>
        <h3 id={headingId} style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(22px,3vw,28px)", textTransform: "uppercase", letterSpacing: "-.5px", margin: "0 0 20px", color: "#111111" }}>
          Custom Arrangement Pricing
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-inter)" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", fontSize: 11, fontWeight: 500, letterSpacing: "1.2px", textTransform: "uppercase", color: "#767672", paddingBottom: 10, borderBottom: "1px solid #DCDBD7" }}>Duration</th>
              <th style={{ textAlign: "right", fontSize: 11, fontWeight: 500, letterSpacing: "1.2px", textTransform: "uppercase", color: "#767672", paddingBottom: 10, borderBottom: "1px solid #DCDBD7" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOM_ARRANGEMENT_PRICING.map(row => (
              <tr key={row.duration}>
                <td style={{ padding: "10px 0", fontSize: 15, color: "#2A2A2A", borderBottom: "1px solid #EDECE8" }}>{row.duration}</td>
                <td style={{ padding: "10px 0", fontSize: 15, color: "#111111", fontWeight: 600, textAlign: "right", borderBottom: "1px solid #EDECE8" }}>{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, lineHeight: 1.6, color: "#5A5A5A", margin: "20px 0 0" }}>
          This arrangement is written and licensed for your group, but it&apos;s non-exclusive: it may also be listed on Hal Leonard&apos;s Arrange Me for other ensembles to purchase.
        </p>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const router = useRouter();
  const scrollToContact = () => { router.push("/contact"); };
  const isMobile = useIsMobile();
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const pricingInfoButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="services" style={{ background: "#ffffff", paddingTop: "98px" }}>

      {/* ── Section header ── */}
      <div style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: isMobile
          ? "clamp(40px,9vw,64px) clamp(20px,5vw,40px) clamp(20px,5vw,36px)"
          : "clamp(64px,7vw,96px) clamp(24px,5vw,64px) clamp(24px,3vw,48px)",
      }}>
        <ScrollFadeUp>
          <h1 style={{
            fontFamily: "var(--font-anton)",
            fontWeight: 400,
            fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(44px,6.5vw,80px)",
            lineHeight: ".92",
            letterSpacing: "-1.5px",
            textTransform: "uppercase",
            margin: 0,
          }}>
            Services
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#5A5A5A", margin: "20px 0 0", maxWidth: 620, textAlign: "left" }}>
            Three ways to refine, rebuild, and reimagine your ensemble&apos;s music.<br />
            Head over to the contact form to get started.
          </p>
        </ScrollFadeUp>
      </div>

      {/* ── Service 1: Custom Arrangement ── */}
      <div style={{ background: "#EAEAEA", borderTop: "1px solid #DCDBD7" }}>
        <div style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile
            ? "clamp(32px,8vw,56px) clamp(20px,5vw,40px)"
            : "clamp(48px,5.5vw,96px) clamp(24px,5vw,64px)",
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "clamp(24px,6vw,40px)" : "clamp(40px,5vw,72px)",
        }}>
          <div style={{ flex: "1 1 340px" }}>
            <ScrollFadeUp>
              <div style={{ fontFamily: "var(--font-anton)", fontSize: isMobile ? "clamp(36px,9vw,56px)" : "clamp(48px,5.5vw,96px)", lineHeight: ".9", color: "#B6B5AD", letterSpacing: "-2px", marginBottom: 14 }}>01</div>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)", lineHeight: 1.02, letterSpacing: "-.5px", textTransform: "uppercase", margin: 0 }}>
                Custom Arrangement
              </h2>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#1254D9", margin: "22px 0 8px" }}>
                Who Is This For?
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: 0, maxWidth: 430, textAlign: "left" }}>
                Directors who want a custom-written arrangement of a specific song for a stands routine or parade performance, without commissioning a full competitive show.
              </p>
            </ScrollFadeUp>
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <ScrollFadeUp delay={150}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", marginBottom: 16 }}>
                What You Receive
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="Director's score for your custom arrangement" />
                <Bullet text="Custom parts for your ensemble's instrumentation" />
                <Bullet text="MP3 audio render of the finished arrangement" />
              </div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", margin: "24px 0 16px" }}>
                Pricing
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Bullet text="$100-$200 (based on duration)" />
                  <PricingInfoButton onClick={() => setPricingModalOpen(true)} buttonRef={pricingInfoButtonRef} />
                </div>
              </div>
              <ContactButton onClick={scrollToContact} />
            </ScrollFadeUp>
          </div>
        </div>
      </div>
      <PricingInfoModal open={pricingModalOpen} onClose={() => setPricingModalOpen(false)} triggerRef={pricingInfoButtonRef} />

      {/* ── Service 2: Part Editing & Revoicing ── */}
      <div style={{ background: "#FFFFFF", borderTop: "1px solid #DCDBD7" }}>
        <div style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile
            ? "clamp(32px,8vw,56px) clamp(20px,5vw,40px)"
            : "clamp(48px,5.5vw,96px) clamp(24px,5vw,64px)",
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "clamp(24px,6vw,40px)" : "clamp(40px,5vw,72px)",
        }}>
          <div style={{ flex: "1 1 340px" }}>
            <ScrollFadeUp>
              <div style={{ fontFamily: "var(--font-anton)", fontSize: isMobile ? "clamp(36px,9vw,56px)" : "clamp(48px,5.5vw,96px)", lineHeight: ".9", color: "#D5D4CE", letterSpacing: "-2px", marginBottom: 14 }}>02</div>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)", lineHeight: 1.02, letterSpacing: "-.5px", textTransform: "uppercase", margin: 0 }}>
                Part Editing &amp; Revoicing
              </h2>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#1254D9", margin: "22px 0 8px" }}>
                Who Is This For?
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: 0, maxWidth: 430, textAlign: "left" }}>
                Directors who need thorough edits made to their music: have notes out of playable range, sections struggling with their parts, or chords completely out of balance... this is your fix.
              </p>
            </ScrollFadeUp>
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <ScrollFadeUp delay={150}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", marginBottom: 16 }}>
                What You Receive
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="New parts and scores with all edits or revoicings made" />
                <Bullet text="Files organized by movement for efficient printing inside of Google Drive" />
                <Bullet text="Formatting offered at a discounted rate" />
              </div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", margin: "24px 0 16px" }}>
                Pricing
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="$100-$500 (based on project scope)" />
              </div>
              <ContactButton onClick={scrollToContact} />
            </ScrollFadeUp>
          </div>
        </div>
      </div>

      {/* ── Service 3: Fall Show Arranging ── */}
      <div style={{ background: "#EAEAEA", borderTop: "1px solid #DCDBD7" }}>
        <div style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: isMobile
            ? "clamp(32px,8vw,56px) clamp(20px,5vw,40px)"
            : "clamp(48px,5.5vw,96px) clamp(24px,5vw,64px)",
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "clamp(24px,6vw,40px)" : "clamp(40px,5vw,72px)",
        }}>
          <div style={{ flex: "1 1 340px" }}>
            <ScrollFadeUp>
              <div style={{ fontFamily: "var(--font-anton)", fontSize: isMobile ? "clamp(36px,9vw,56px)" : "clamp(48px,5.5vw,96px)", lineHeight: ".9", color: "#B6B5AD", letterSpacing: "-2px", marginBottom: 14 }}>03</div>
              <div style={{ display: "inline-block", background: "#1254D9", color: "#fff", fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 12px", borderRadius: 0, marginBottom: 14 }}>
                Accepting 2027 Clients Soon
              </div>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)", lineHeight: 1.02, letterSpacing: "-.5px", textTransform: "uppercase", margin: 0 }}>
                Fall Show Arranging
              </h2>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#1254D9", margin: "22px 0 8px" }}>
                Who Is This For?
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: 0, maxWidth: 430, textAlign: "left" }}>
                Directors seeking a fully custom winds arrangement for their fall marching production, designed specifically for your ensemble&apos;s competitive and long-term growth goals.
              </p>
            </ScrollFadeUp>
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <ScrollFadeUp delay={150}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", marginBottom: 16 }}>
                What You Receive
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="Full winds arrangement for marching band, including professional-grade scores and parts" />
                <Bullet html="Pacing spreadsheet and score analysis for design efficiency<br/>and easy-to-teach musical intent" />
                <Bullet text="Rewrites and edits on request to match your ensemble&apos;s strengths and weaknesses" />
              </div>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", margin: "24px 0 16px" }}>
                Pricing
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="$2,000-$3,000 (based on show length and complexity)" />
              </div>
              <ContactButton onClick={scrollToContact} />
            </ScrollFadeUp>
          </div>
        </div>
      </div>

    </section>
  );
}
