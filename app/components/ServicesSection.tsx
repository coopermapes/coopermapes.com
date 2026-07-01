"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "../hooks/useIsMobile";

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

export default function ServicesSection() {
  const router = useRouter();
  const scrollToContact = () => { router.push("/contact"); };
  const scrollToInquiry = () => { router.push("/contact#inquiry"); };
  const isMobile = useIsMobile();

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

      {/* ── Service 1: Flip Folder Conversion ── */}
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
                Flip Folder Conversion
              </h2>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#1254D9", margin: "22px 0 8px" }}>
                Who This Is For
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: 0, maxWidth: 430, textAlign: "left" }}>
                Directors who purchase scores and arrangements without access to flip folder parts, whether the parts are in 8.5x11 style or are not provided as individual parts at all.
              </p>
            </ScrollFadeUp>
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <ScrollFadeUp delay={150}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", marginBottom: 16 }}>
                What You Receive
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="All parts and all movements in 7x5 flip folder formatting" />
                <Bullet text="Parts organized by movement for efficient printing inside of Google Drive" />
              </div>
              <ContactButton onClick={scrollToContact} />
            </ScrollFadeUp>
          </div>
        </div>
      </div>

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
                Who This Is For
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: 0, maxWidth: 430, textAlign: "left" }}>
                Directors who need thorough edits made to their music. Have notes out of playable range, sections struggling with their parts, or chords completely out of balance? This is your fix.
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
                <Bullet text="Formatting is included" />
                <Bullet text="Parts and scores organized by movement for efficient printing inside of Google Drive" />
              </div>
              <ContactButton onClick={scrollToContact} />
            </ScrollFadeUp>
          </div>
        </div>
      </div>

      {/* ── Service 3: Custom Arranging ── */}
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
                Accepting Fall 2027 Clients Soon
              </div>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)", lineHeight: 1.02, letterSpacing: "-.5px", textTransform: "uppercase", margin: 0 }}>
                Custom Arranging
              </h2>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#1254D9", margin: "22px 0 8px" }}>
                Who This Is For
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: 0, maxWidth: 430, textAlign: "left" }}>
                Directors seeking a fully custom winds arrangement for their fall marching production. Designed specifically for your ensemble&apos;s competitive and long-term growth goals.
              </p>
            </ScrollFadeUp>
          </div>
          <div style={{ flex: "1 1 380px" }}>
            <ScrollFadeUp delay={150}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: "1.4px", textTransform: "uppercase", color: "#767672", marginBottom: 16 }}>
                What You Receive
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                <Bullet text="Full winds arrangement for marching band, includes professional-grade scores and parts" />
                <Bullet html="Pacing spreadsheet and score analysis for design efficiency<br/>and easy-to-teach musical intent" />
                <Bullet text="Rewrites and edits on request to match your ensemble&apos;s strengths and weaknesses" />
              </div>
              <ContactButton onClick={scrollToInquiry} />
            </ScrollFadeUp>
          </div>
        </div>
      </div>

    </section>
  );
}
