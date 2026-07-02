"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Chats, Envelope, ArrowRight } from "@phosphor-icons/react";
import GridPattern from "./GridPattern";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useIsMobile } from "../hooks/useIsMobile";

// ── Fade-up animation (matches homepage stagger) ─────────────────────────────
function FadeUp({ delay, instant = false, children, style }: { delay: number; instant?: boolean; children: React.ReactNode; style?: React.CSSProperties }) {
  const [visible, setVisible] = useState(instant);
  useEffect(() => {
    if (instant) { setVisible(true); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, instant]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.45s ease, transform 0.45s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Step definitions ──────────────────────────────────────────────────────────
const FLIP_STEPS = [
  { name: "Service",    desc: "Choose your service" },
  { name: "About You",  desc: "Your contact info" },
  { name: "Your Show",  desc: "About the show music" },
  { name: "Files",      desc: "Assets and delivery" },
  { name: "Review",     desc: "Confirm and send" },
];
const REVOICE_STEPS = [
  { name: "Service",    desc: "Choose your service" },
  { name: "About You",  desc: "Your contact info" },
  { name: "Your Show",  desc: "About the show music" },
  { name: "Changes",    desc: "Parts & issues" },
  { name: "Files",      desc: "Assets and delivery" },
  { name: "Review",     desc: "Confirm and send" },
];

function stepContent(step: number, path: "flip" | "revoice" | null) {
  if (step === 1) return { title: "How Can I Help?", sub: "Select the service that best fits your situation." };
  if (step === 2) return { title: "About You", sub: "Tell me who you are and where you're from." };
  if (step === 3) return { title: "Your Show", sub: "Tell me about the music you're working with." };
  if (step === 4 && path === "revoice") return { title: "What Needs to Change?", sub: "Help me understand what you're dealing with." };
  const isFilesStep = (path === "flip" && step === 4) || (path === "revoice" && step === 5);
  if (isFilesStep) return { title: "Files & Timeline", sub: "Share your files and let me know when you need this done." };
  return { title: "Review & Submit", sub: "Make sure everything looks right before you send." };
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  border: "1px solid #CFCEC9",
  fontSize: 16,
  color: "#111111",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  fontFamily: "inherit",
  borderRadius: 0,
};

// ── Step dot ──────────────────────────────────────────────────────────────────
function StepDot({ state }: { state: "completed" | "active" | "upcoming" }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
      background: state !== "upcoming" ? "#1254D9" : "transparent",
      border: state === "upcoming" ? "2px solid #CFCEC9" : "none",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {state === "completed" && (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 6l3 3 5-5" />
        </svg>
      )}
      {state === "active" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
    </div>
  );
}


// ── Radio card ────────────────────────────────────────────────────────────────
function RadioCard({ selected, onClick, children, size = "lg" }: {
  selected: boolean; onClick: () => void; children: React.ReactNode; size?: "lg" | "sm";
}) {
  const isMobile = useIsMobile();
  const [pressed, setPressed] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
      flex: 1,
      border: `2px solid ${selected ? "#1254D9" : "#DCDBD7"}`,
      background: selected ? "#EEF3FD" : "#FFFFFF",
      padding: size === "lg" ? "18px 24px" : "14px 16px",
      cursor: "pointer", display: "flex", gap: 14, alignItems: "center",
      transition: "border-color .15s ease, background-color .15s ease, transform 0.1s ease, opacity 0.1s ease",
      width: size === "lg" ? "100%" : undefined,
      minWidth: size === "sm" ? 160 : undefined,
      textAlign: "left",
      transform: isMobile && pressed ? "scale(0.96)" : "scale(1)",
      opacity: isMobile && pressed ? 0.75 : 1,
    }}>
      <span
        className={twMerge(clsx(
          "w-4 h-4 bg-white relative border rounded-full duration-200 after:duration-200 flex-shrink-0 flex items-center justify-center after:absolute after:top-1/2 after:left-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:rounded-full after:bg-blue",
          selected ? "border-blue after:w-2 after:h-2" : "border-[#CFCEC9] after:w-0 after:h-0"
        ))}
        aria-hidden="true"
      />
      <div style={{ fontFamily: "var(--font-inter)", fontSize: 17, fontWeight: 600, color: "#111111", lineHeight: 1.55 }}>
        {children}
      </div>
    </button>
  );
}

// ── Review group ──────────────────────────────────────────────────────────────
function ReviewGroup({ title, rows, onEdit }: { title: string; rows: { label: string; value: string }[]; onEdit: () => void }) {
  const isMobile = useIsMobile();
  const [editPressed, setEditPressed] = useState(false);
  return (
    <div style={{ border: "1px solid #E4E3DE", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 16px", background: "#F7F6F4", borderBottom: "1px solid #E4E3DE" }}>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 600, letterSpacing: "1.2px", textTransform: "uppercase", color: "#6A6A6A" }}>{title}</span>
        <button type="button" onClick={onEdit}
          onTouchStart={() => setEditPressed(true)}
          onTouchEnd={() => setEditPressed(false)}
          onTouchCancel={() => setEditPressed(false)}
          style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, color: "#1254D9", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, transition: "transform 0.1s ease, opacity 0.1s ease", transform: isMobile && editPressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && editPressed ? 0.75 : 1 }}>Edit</button>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "9px 16px", borderBottom: i < rows.length - 1 ? "1px solid #F5F4F0" : "none" }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", color: "#9A9A95", width: 120, flexShrink: 0, paddingTop: 2 }}>{r.label}</span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "#111111", lineHeight: 1.5, flex: 1, wordBreak: "break-word" }}>{r.value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

// ── Outline button with reliable hover state ─────────────────────────────────
function OutlineButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={isMobile ? undefined : () => setHov(true)}
      onMouseLeave={isMobile ? undefined : () => setHov(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{ background: "transparent", border: `1.5px solid ${hov && !isMobile ? "#111111" : "#DCDBD7"}`, color: "#111111", fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", padding: "14px 32px", cursor: "pointer", transition: "border-color 0.2s ease, transform 0.1s ease, opacity 0.1s ease", transform: isMobile && pressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && pressed ? 0.75 : 1 }}
    >
      {children}
    </button>
  );
}

// ── Contact card (landing) ────────────────────────────────────────────────────
function ContactCard({ icon, title, description, cta, onClick, active, locked }: {
  icon: React.ReactNode; title: string; description: string; cta: string;
  onClick: () => void; active?: boolean; locked?: boolean;
}) {
  const isMobile = useIsMobile();
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      onMouseEnter={isMobile ? undefined : () => !locked && setHov(true)}
      onMouseLeave={isMobile ? undefined : () => setHov(false)}
      onTouchStart={() => { if (!locked) setPressed(true); }}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hov && !locked && !isMobile ? "#1254D9" : "#DCDBD7"}`,
        position: "relative", overflow: "hidden",
        aspectRatio: isMobile ? undefined : "1",
        width: "100%",
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.45 : isMobile && pressed ? 0.75 : 1,
        transition: `border-color .32s ${ease}, opacity .18s ease, transform 0.1s ease`,
        transform: isMobile && pressed ? "scale(0.97)" : "scale(1)",
        textAlign: "left",
        padding: 0,
      }}
    >
      <div style={{
        padding: isMobile ? "clamp(32px,8vw,48px) 24px" : "44px 44px calc(44px + 72px)",
        display: "flex", flexDirection: "column", gap: 24,
        transform: !isMobile && hov && !locked ? "translateY(-16px)" : "translateY(0)",
        transition: `transform .38s ${ease}`,
      }}>
        <div style={{ width: 80, height: 80, background: "#FFFFFF", border: "1.5px solid #DCDBD7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: 34, textTransform: "uppercase", letterSpacing: "0px", color: "#111111", marginBottom: 10 }}>{title}</div>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 18, color: "#5A5A5A", lineHeight: 1.6, margin: 0 }}>{description}</p>
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 72,
        background: "#1254D9", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 4,
        transform: !isMobile && hov && !locked ? "translateY(0)" : "translateY(100%)",
        transition: `transform .38s ${ease}`,
      }}>
        <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#FFFFFF", lineHeight: 1 }}>
          {cta}
        </span>
        <ArrowRight size={18} weight="bold" color="#FFFFFF" />
      </div>
    </button>
  );
}

// ── Left panel (dark sidebar shared across all sub-screens) ───────────────────
function LeftPanel({ onBack, subtitle = "Tell me what your show needs — I’ll get back to you within 1–2 business days." }: { onBack: () => void; subtitle?: string }) {
  return (
    <div className="contact-left-panel" style={{
      width: "30%", flexShrink: 0, background: "#111111",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "clamp(40px,4.5vw,64px) clamp(24px,3vw,48px)",
      minHeight: "calc(100vh - 98px)", boxSizing: "border-box",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background texture */}
      <FadeUp delay={120} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/contact-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "rotate(180deg)",
          opacity: 0.35,
          filter: "hue-rotate(40deg) saturate(1.3) brightness(0.8)",
        }} />
      </FadeUp>

      {/* Top content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <FadeUp delay={60}>
          <button onClick={onBack} style={{
            fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600,
            letterSpacing: "1.2px", textTransform: "uppercase",
            color: "#909088", background: "none", border: "none",
            cursor: "pointer", padding: 0, marginBottom: 48,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            All Options
          </button>
        </FadeUp>
        <FadeUp delay={140}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#6B8FE8", margin: "0 0 16px" }}>
            Contact
          </p>
        </FadeUp>
        <FadeUp delay={200}>
          <h1 style={{
            fontFamily: "var(--font-anton)", fontWeight: 400,
            fontSize: "clamp(36px,3.6vw,52px)",
            textTransform: "uppercase", letterSpacing: "-1px", lineHeight: 1,
            color: "#FFFFFF", margin: 0,
          }}>
            Get In Touch
          </h1>
        </FadeUp>
        <FadeUp delay={310}>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#B0B0A8", maxWidth: 280, marginTop: 20, lineHeight: 1.65 }}>
            {subtitle}
          </p>
        </FadeUp>
      </div>

      {/* Bottom contact info */}
      <FadeUp delay={440} style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: "#8A8A82", marginBottom: 14 }}>Social Media</div>
          {[
            { label: "Instagram", href: "https://www.instagram.com/coopermapes" },
            { label: "Facebook",  href: "https://www.facebook.com/ctmapes/" },
            { label: "LinkedIn",  href: "https://www.linkedin.com/in/coopermapes/" },
            { label: "YouTube",   href: "https://youtube.com/@coopermapes/videos" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500, color: "#D8D8D0", textDecoration: "none", marginBottom: 10 }}>
              {s.label}
            </a>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: "#8A8A82", marginBottom: 14 }}>Email</div>
          <a href="mailto:contact@coopermapes.com" style={{ fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500, color: "#D8D8D0", textDecoration: "none" }}>
            contact@coopermapes.com
          </a>
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 700, letterSpacing: "1.6px", textTransform: "uppercase", color: "#8A8A82", marginBottom: 14 }}>Phone</div>
          <a href="tel:6629859780" style={{ fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500, color: "#D8D8D0", textDecoration: "none" }}>662-985-9780</a>
        </div>
      </div>
      </FadeUp>
    </div>
  );
}

// ── Horizontal step progress bar ──────────────────────────────────────────────
function HorizontalStepper({ steps, currentStep }: { steps: typeof FLIP_STEPS; currentStep: number }) {
  const isMobile = useIsMobile();
  const pct = ((currentStep - 1) / (steps.length - 1)) * 100;

  if (isMobile) {
    return (
      <div style={{ background: "#F7F6F4", borderBottom: "1px solid #E4E3DE", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#1254D9" }}>
            {steps[currentStep - 1].name}
          </span>
          <span style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, color: "#9A9A95" }}>
            {currentStep} / {steps.length}
          </span>
        </div>
        <div style={{ height: 3, background: "#E4E3DE", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#1254D9", width: `${pct}%`, transition: "width 0.38s cubic-bezier(0.4,0,0.2,1)", borderRadius: 2 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "flex-start",
      padding: "24px clamp(32px,4vw,64px)",
      background: "#F7F6F4", borderBottom: "1px solid #E4E3DE",
    }}>
      {steps.map((s, i) => {
        const state = i + 1 < currentStep ? "completed" : i + 1 === currentStep ? "active" : "upcoming";
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: i < steps.length - 1 ? 1 : undefined }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, flexShrink: 0 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                background: state !== "upcoming" ? "#1254D9" : "transparent",
                border: state === "upcoming" ? "2px solid #CFCEC9" : "2px solid #1254D9",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transition: "background 0.28s ease, border-color 0.28s ease",
              }}>
                {state === "completed" && (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
                {state === "active" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
              </div>
              <div style={{
                fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600,
                letterSpacing: ".5px", textTransform: "uppercase",
                color: state === "upcoming" ? "#B0B0AA" : state === "active" ? "#111111" : "#1254D9",
                textAlign: "center", maxWidth: 84, lineHeight: 1.35,
                transition: "color 0.28s ease",
              }}>
                {s.name}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1, background: "#E4E3DE",
                marginTop: 12, marginLeft: 8, marginRight: 8,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, bottom: 0,
                  background: "#1254D9",
                  width: i + 1 < currentStep ? "100%" : "0%",
                  transition: "width 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
                }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Inquiry screen ────────────────────────────────────────────────────────────
function InquiryScreen({ transitioning, onBack, initialDone = false }: { transitioning: boolean; onBack: () => void; initialDone?: boolean }) {
  const isMobile = useIsMobile();
  const [iName, setIName] = useState("");
  const [iEmail, setIEmail] = useState("");
  const [iSchool, setISchool] = useState("");
  const [iService, setIService] = useState("");
  const [iPhone, setIPhone] = useState("");
  const [iHear, setIHear] = useState("");
  const [iMessage, setIMessage] = useState("");
  const [iDone, setIDone] = useState(initialDone);
  const [iError, setIError] = useState("");
  const [iSubmitting, setISubmitting] = useState(false);
  const [sendPressed, setSendPressed] = useState(false);
  const iDoneHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (iDone) iDoneHeadingRef.current?.focus();
  }, [iDone]);

  const isValid = !!(iName.trim() && iEmail.trim() && iEmail.includes("@") && iSchool.trim() && iService && iHear && iMessage.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setISubmitting(true);
    setIError("");
    try {
      const res = await fetch("https://formspree.io/f/xbdvkbrd", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: iName,
          Email: iEmail,
          "School / Organization": iSchool,
          "Service of Interest": iService,
          "Phone": iPhone || "Not provided",
          "How did you hear about me?": iHear,
          Message: iMessage,
        }),
      });
      if (res.ok) { setIDone(true); } else { setIError("Something went wrong. Please try again or email me directly."); }
    } catch { setIError("Network error. Please try again or email me directly."); }
    finally { setISubmitting(false); }
  }

  return (
    <div style={{
      display: "flex", minHeight: isMobile ? "auto" : "calc(100vh - 98px)",
      opacity: transitioning ? 0 : 1,
      transition: "opacity 0.32s ease",
    }}>
      <LeftPanel onBack={onBack} subtitle="Fill out this form to get started. You will receive a message back from me within the next business day." />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", overflow: "hidden" }}>
        {iDone ? (
          <div role="status" aria-live="polite" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: isMobile ? "flex-start" : "center", padding: isMobile ? "clamp(60px,15vw,100px) clamp(40px,5vw,80px)" : "clamp(48px,6vw,96px) clamp(40px,5vw,80px)" }}>
            <div style={{ textAlign: "center", maxWidth: 480 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1254D9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l6 6 10-10" />
                </svg>
              </div>
              {/* tabIndex -1 + outline:none: programmatic focus target for screen readers only, not a tab stop */}
              <h2 ref={iDoneHeadingRef} tabIndex={-1} style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(36px,3.6vw,52px)", textTransform: "uppercase", letterSpacing: "-1px", margin: "0 0 16px", outline: "none" }}>
                Message Sent
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#3A3A3A", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Thanks for reaching out! Your inquiry has been submitted. I&apos;ll be reaching out to you as soon as possible to answer your questions.
              </p>
              <OutlineButton onClick={() => setIDone(false)}>Send Another Message</OutlineButton>
            </div>
          </div>
        ) : (
          <FadeUp delay={360} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <form onSubmit={handleSubmit} style={{
              flex: 1, display: "flex", flexDirection: "column",
              padding: isMobile
                ? "clamp(28px,7vw,48px) clamp(20px,5vw,36px)"
                : "clamp(36px,4.5vw,56px) clamp(40px,5vw,80px)",
            }}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#1254D9", marginBottom: 16 }}>
                Send an Inquiry
              </div>
              <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(36px,3.6vw,52px)", lineHeight: .95, letterSpacing: "-.5px", textTransform: "uppercase", color: "#111111", margin: "0 0 12px" }}>
                Let&apos;s Talk
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#6A6A6A", margin: "0 0 44px", lineHeight: 1.5 }}>
                Not ready for a full quote? Ask a question, share your situation, or just say hello.
              </p>

              <div style={{ flex: 1, maxWidth: 680, display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Row 1: Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <input
                    aria-label="Name" style={inputStyle} placeholder="Name *"
                    value={iName} onChange={e => setIName(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1254D9")}
                    onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                  />
                  <input
                    aria-label="Email address" style={inputStyle} type="email" placeholder="Email *"
                    value={iEmail} onChange={e => setIEmail(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1254D9")}
                    onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                  />
                </div>
                {/* Row 2: School + Service */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <input
                    aria-label="School or organization" style={inputStyle} placeholder="School / Organization *"
                    value={iSchool} onChange={e => setISchool(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1254D9")}
                    onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                  />
                  <select
                    aria-label="Service of interest"
                    style={{ ...inputStyle, color: iService ? "#141414" : "#A6A5A0" }}
                    value={iService} onChange={e => setIService(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1254D9")}
                    onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                  >
                    <option value="" disabled>Service of Interest *</option>
                    <option value="Flip Folder Conversion">Flip Folder Conversion</option>
                    <option value="Part Editing & Revoicing">Part Editing &amp; Revoicing</option>
                    <option value="Custom Arranging">Custom Arranging</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
                {/* Row 3: Phone + How did you hear */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
                  <input
                    aria-label="Phone number" style={inputStyle} type="tel" placeholder="Phone (optional)"
                    value={iPhone} onChange={e => setIPhone(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1254D9")}
                    onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                  />
                  <select
                    aria-label="How did you hear about me"
                    style={{ ...inputStyle, color: iHear ? "#141414" : "#A6A5A0" }}
                    value={iHear} onChange={e => setIHear(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1254D9")}
                    onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                  >
                    <option value="" disabled>How did you hear about me? *</option>
                    <option value="Word of mouth">Word of mouth</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="YouTube">YouTube</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Google search">Google search</option>
                    <option value="AI">AI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {/* Message */}
                <textarea
                  aria-label="Message" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  rows={6} placeholder="Message *"
                  value={iMessage} onChange={e => setIMessage(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = "#1254D9")}
                  onBlur={e => (e.target.style.borderColor = "#CFCEC9")}
                />
              </div>

              {iError && (
                <div style={{ marginTop: 16, background: "#FEF2F2", border: "1px solid #FECACA", padding: "12px 16px" }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500, color: "#CC3333" }}>{iError}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginTop: 40, paddingTop: 24, borderTop: "1px solid #E4E3DE" }}>
                <p style={{ fontSize: 12, color: "#9A9A95", margin: "0 0 12px", lineHeight: 1.5 }}>
                  By submitting, you agree to the{" "}
                  <Link href="/terms" style={{ color: "#1254D9", textDecoration: "underline" }}>Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" style={{ color: "#1254D9", textDecoration: "underline" }}>Privacy Policy</Link>.
                </p>
                <button
                  type="submit" disabled={!isValid || iSubmitting}
                  onMouseEnter={isMobile ? undefined : e => { if (isValid && !iSubmitting) { e.currentTarget.style.background = "#0E45B5"; e.currentTarget.style.borderColor = "#0E45B5"; } }}
                  onMouseLeave={isMobile ? undefined : e => { e.currentTarget.style.background = "#1254D9"; e.currentTarget.style.borderColor = "#1254D9"; }}
                  onTouchStart={() => { if (isValid && !iSubmitting) setSendPressed(true); }}
                  onTouchEnd={() => setSendPressed(false)}
                  onTouchCancel={() => setSendPressed(false)}
                  style={{
                    background: "#1254D9", color: "#fff", border: "1.5px solid #1254D9",
                    padding: isMobile ? "14px 28px" : "12px 28px", fontFamily: "var(--font-inter)", fontSize: 13,
                    fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase",
                    cursor: isValid && !iSubmitting ? "pointer" : "default",
                    opacity: !isValid || iSubmitting ? 0.38 : isMobile && sendPressed ? 0.75 : 1,
                    pointerEvents: isValid && !iSubmitting ? "auto" : "none",
                    transition: "background .15s, border-color .15s, transform 0.1s ease, opacity 0.1s ease",
                    transform: isMobile && sendPressed ? "scale(0.96)" : "scale(1)",
                  }}
                >
                  {iSubmitting ? "Sending…" : "Send Inquiry"}
                </button>
              </div>
            </form>
          </FadeUp>
        )}
      </div>
    </div>
  );
}

// ── Coming Soon screen ────────────────────────────────────────────────────────
function ComingSoonScreen({ title, subtitle, transitioning, onBack }: {
  title: string; subtitle: string; transitioning: boolean; onBack: () => void;
}) {
  return (
    <div style={{
      display: "flex", minHeight: "calc(100vh - 98px)",
      opacity: transitioning ? 0 : 1,
      transition: "opacity 0.32s ease",
    }}>
      <LeftPanel onBack={onBack} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(48px,6vw,96px) clamp(40px,5vw,80px)" }}>
        <FadeUp delay={300} style={{ textAlign: "center", maxWidth: 420 }}>
          <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(32px,3.5vw,52px)", textTransform: "uppercase", letterSpacing: "-1px", color: "#111111", margin: "0 0 16px" }}>
            {title}
          </h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#9A9A95", margin: 0, lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </FadeUp>
      </div>
    </div>
  );
}

// ── Mobile contact strip ──────────────────────────────────────────────────────
function MobileContactStrip() {
  return (
    <div style={{
      background: "#111111",
      padding: "clamp(28px,7vw,48px) clamp(20px,5vw,40px)",
      display: "flex",
      flexDirection: "column",
      gap: 24,
    }}>
      <div style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#6B8FE8" }}>
        Contact
      </div>
      <a href="mailto:contact@coopermapes.com" style={{ fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500, color: "#D8D8D0", textDecoration: "none" }}>
        contact@coopermapes.com
      </a>
      <a href="tel:6629859780" style={{ fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500, color: "#D8D8D0", textDecoration: "none" }}>
        662-985-9780
      </a>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { label: "Instagram", href: "https://www.instagram.com/coopermapes" },
          { label: "Facebook",  href: "https://www.facebook.com/ctmapes/" },
          { label: "LinkedIn",  href: "https://www.linkedin.com/in/coopermapes/" },
          { label: "YouTube",   href: "https://youtube.com/@coopermapes/videos" },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-inter)", fontSize: 15, fontWeight: 500, color: "#D8D8D0", textDecoration: "none" }}>
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ContactSection() {
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardPath, setWizardPath] = useState<"flip" | "revoice" | null>(null);
  const [wizardDone, setWizardDone] = useState(false);
  const [wizardError, setWizardError] = useState("");
  const [contactView, setContactView] = useState<"landing" | "wizard" | "inquiry">("landing");
  const [transitioning, setTransitioning] = useState(false);
  const [inquiryInitDone, setInquiryInitDone] = useState(false);
  const [stepTransitioning, setStepTransitioning] = useState(false);
  const [backPressed, setBackPressed] = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);
  const wizardDoneHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (wizardDone) wizardDoneHeadingRef.current?.focus();
  }, [wizardDone]);
  const fromBack = useRef(false);

  const [wName, setWName] = useState("");
  const [wEmail, setWEmail] = useState("");
  const [wSchool, setWSchool] = useState("");
  const [wShowName, setWShowName] = useState("");
  const [wMovements, setWMovements] = useState("");
  const [wNumParts, setWNumParts] = useState("");
  const [wCurrentFormat, setWCurrentFormat] = useState("");
  const [wSources, setWSources] = useState("");
  const [wPartsNeedWork, setWPartsNeedWork] = useState<"all" | "specific" | "">("");
  const [wSpecificInstruments, setWSpecificInstruments] = useState("");
  const [wIssuesDescription, setWIssuesDescription] = useState("");
  const [wShowType, setWShowType] = useState<"stock" | "custom" | "">("");
  const [wPartsLink, setWPartsLink] = useState("");
  const [wDeadline, setWDeadline] = useState("");
  const [wExpress, setWExpress] = useState(false);

  const isMobile = useIsMobile();
  const steps = wizardPath === "revoice" ? REVOICE_STEPS : FLIP_STEPS;
  const totalSteps = steps.length;
  const isFilesStep = wizardPath === "flip" ? wizardStep === 4 : wizardStep === 5;
  const isFinalStep = wizardStep === totalSteps;

  function isStepValid(): boolean {
    if (wizardStep === 1) return wizardPath !== null;
    if (wizardStep === 2) return !!(wName.trim() && wEmail.trim() && wEmail.includes("@") && wSchool.trim());
    if (wizardStep === 3) {
      const base = !!(wShowName.trim() && wMovements.trim() && wNumParts.trim());
      if (wizardPath === "flip") return base && !!wCurrentFormat;
      return base && !!wSources.trim();
    }
    if (wizardStep === 4 && wizardPath === "revoice") {
      if (!wPartsNeedWork) return false;
      if (wPartsNeedWork === "specific" && !wSpecificInstruments.trim()) return false;
      return !!(wIssuesDescription.trim() && wShowType);
    }
    if (isFilesStep) return !!wDeadline;
    return true;
  }

  function animateToStep(n: number) {
    setStepTransitioning(true);
    setTimeout(() => {
      setWizardStep(n);
      setStepTransitioning(false);
    }, 210);
  }

  function handleContinue() {
    if (!isStepValid()) { setWizardError("Please fill in all required fields before continuing."); return; }
    setWizardError("");
    if (isFinalStep) { handleSubmit(); } else { animateToStep(wizardStep + 1); }
  }

  function handleBack() { setWizardError(""); animateToStep(wizardStep - 1); }
  function goToStep(n: number) { setWizardError(""); animateToStep(n); }

  function resetWizard() {
    setWizardStep(1); setWizardPath(null); setWizardDone(false); setWizardError("");
    setWName(""); setWEmail(""); setWSchool("");
    setWShowName(""); setWMovements(""); setWNumParts(""); setWCurrentFormat(""); setWSources("");
    setWPartsNeedWork(""); setWSpecificInstruments(""); setWIssuesDescription(""); setWShowType("");
    setWPartsLink(""); setWDeadline(""); setWExpress(false);
  }

  function goToWizard() {
    window.history.pushState({ contactView: "wizard" }, "");
    setTransitioning(true);
    setTimeout(() => {
      setContactView("wizard");
      setTimeout(() => setTransitioning(false), 16);
    }, 280);
  }
  function goToInquiry() {
    window.history.pushState({ contactView: "inquiry" }, "", "#inquiry");
    setTransitioning(true);
    setTimeout(() => {
      setContactView("inquiry");
      setTimeout(() => setTransitioning(false), 16);
    }, 280);
  }
  function goToLanding() { window.history.back(); }

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#inquiry") {
      window.history.replaceState({ contactView: "inquiry" }, "");
      setContactView("inquiry");
    } else if (hash === "#inquiry-success") {
      window.history.replaceState({ contactView: "inquiry" }, "");
      setContactView("inquiry");
      setInquiryInitDone(true);
    } else if (hash === "#quote-success") {
      window.history.replaceState({ contactView: "wizard" }, "");
      setContactView("wizard");
      setWizardDone(true);
    } else {
      window.history.replaceState({ contactView: "landing" }, "");
    }
    function handlePopState(e: PopStateEvent) {
      if (e.state?.contactView === "landing") {
        fromBack.current = true;
        setTransitioning(true);
        setTimeout(() => {
          setContactView("landing");
          resetWizard();
          setTimeout(() => setTransitioning(false), 16);
        }, 280);
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function handleSubmit() {
    const payload: Record<string, string> = {
      Service: wizardPath === "flip" ? "Flip Folder Conversion" : "Part Editing & Revoicing",
      service_path: wizardPath === "flip" ? "flip_folder" : "revoicing",
      Name: wName, Email: wEmail, School: wSchool,
      "Show Name": wShowName, Movements: wMovements, "Parts Count": wNumParts,
      Deadline: wDeadline, "Express Delivery": wExpress ? "Yes — 48-hour turnaround" : "No",
    };
    if (wizardPath === "flip") {
      payload["Current Format"] = wCurrentFormat;
    } else {
      payload["Source Pieces"] = wSources;
      payload["Parts Need Work"] = wPartsNeedWork === "all" ? "All parts" : "Specific instruments";
      if (wPartsNeedWork === "specific") payload["Specific Instruments"] = wSpecificInstruments;
      payload["Issues"] = wIssuesDescription;
      payload["Show Type"] = wShowType === "stock" ? "Stock show (JW Pepper / Hal Leonard)" : "Custom arrangement";
    }
    if (wPartsLink.trim()) payload["Parts Link"] = wPartsLink;
    try {
      const res = await fetch("https://formspree.io/f/xnjknkab", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setWizardDone(true); } else { setWizardError("Something went wrong. Please try again or email me directly."); }
    } catch { setWizardError("Network error. Please try again or email me directly."); }
  }

  function stepLabel() {
    return `Step ${wizardStep} of ${totalSteps}`;
  }

  function dotState(i: number): "completed" | "active" | "upcoming" {
    if (i + 1 < wizardStep) return "completed";
    if (i + 1 === wizardStep) return "active";
    return "upcoming";
  }

  const { title, sub } = stepContent(wizardStep, wizardPath);
  const valid = isStepValid();

  return (
    <section style={{ background: "#FFFFFF", minHeight: "calc(100vh - 98px)", position: "relative", overflow: "hidden" }}>

      {/* ── Screen 1: Landing ── */}
      {contactView === "landing" && (
        <div style={{
          position: "relative", minHeight: "calc(100vh - 98px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
          padding: isMobile
            ? "clamp(48px,10vw,80px) clamp(20px,5vw,40px) clamp(40px,8vw,64px)"
            : "clamp(72px,9vw,120px) clamp(24px,5vw,64px) clamp(48px,6vw,96px)",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}>
          <GridPattern interactive={false} />
          {/* Radial fade: protects center text from background conflict */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 55% 55% at 50% 42%, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.65) 38%, rgba(255,255,255,0.25) 62%, rgba(255,255,255,0) 80%)",
          }} />
          <div style={{ textAlign: "center", marginBottom: "clamp(24px,3vw,40px)", position: "relative", zIndex: 1 }}>
            <FadeUp delay={80} instant={fromBack.current}>
              <h1 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: isMobile ? "clamp(40px,10vw,64px)" : "clamp(52px,7.5vw,96px)", textTransform: "uppercase", letterSpacing: "-1.5px", lineHeight: 0.92, color: "#111111", margin: 0 }}>
                Get In Touch
              </h1>
            </FadeUp>
            <FadeUp delay={260} instant={fromBack.current}>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#5A5A5A", maxWidth: 480, margin: "24px auto 0", lineHeight: 1.55 }}>
                The first step to better sheet music. Get a quote or send an inquiry to start our work together.
              </p>
            </FadeUp>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 400px))",
            justifyContent: "center",
            gap: 24, width: "100%", maxWidth: 1080, position: "relative", zIndex: 1,
          }}>
            <FadeUp delay={440} instant={fromBack.current}>
              <ContactCard
                icon={<Envelope size={40} weight="light" color="#1254D9" />}
                title="Get a Quote" cta="Start Your Quote" onClick={goToWizard} active
                description="Ready for me to take a look at your music? Fill out this quick form to receive a quote from me."
              />
            </FadeUp>
            <FadeUp delay={600} instant={fromBack.current}>
              <ContactCard
                icon={<Chats size={40} weight="light" color="#1254D9" />}
                title="Send an Inquiry" cta="Send a Message" onClick={goToInquiry} active
                description="Have questions before committing to a service? Shoot me a message and we can talk it out."
              />
            </FadeUp>
          </div>
        </div>
      )}

      {/* ── Screen 2: Wizard ── */}
      {contactView === "wizard" && (
        <>
        <div style={{
          display: "flex", minHeight: isMobile ? "auto" : "calc(100vh - 98px)",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(10px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}>
          <LeftPanel onBack={goToLanding} subtitle="Fill out this form to get started. You will receive a quote from me within the next business day." />

          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", overflow: "hidden" }}>
            {wizardDone ? (
              <div role="status" aria-live="polite" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: isMobile ? "flex-start" : "center", padding: isMobile ? "clamp(60px,15vw,100px) clamp(40px,5vw,80px)" : "clamp(48px,6vw,96px) clamp(40px,5vw,80px)" }}>
                <div style={{ textAlign: "center", maxWidth: 480 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1254D9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12l6 6 10-10" />
                    </svg>
                  </div>
                  {/* tabIndex -1 + outline:none: programmatic focus target for screen readers only, not a tab stop */}
                  <h2 ref={wizardDoneHeadingRef} tabIndex={-1} style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(36px,3.6vw,52px)", textTransform: "uppercase", letterSpacing: "-1px", margin: "0 0 16px", outline: "none" }}>
                    Quote Submitted
                  </h2>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#3A3A3A", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.6 }}>
                    Thanks for reaching out! Your quote request has been submitted. I&apos;ll be reaching out to you as soon as possible with more information.
                  </p>
                  <OutlineButton onClick={resetWizard}>Request Another Quote</OutlineButton>
                </div>
              </div>
            ) : (
              <>
                <FadeUp delay={200}>
                  <HorizontalStepper steps={steps} currentStep={wizardStep} />
                </FadeUp>

                <FadeUp delay={360} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  padding: isMobile
                    ? "clamp(28px,7vw,48px) clamp(20px,5vw,36px)"
                    : "clamp(36px,4.5vw,56px) clamp(40px,5vw,80px)",
                  opacity: stepTransitioning ? 0 : 1,
                  transform: stepTransitioning ? "translateY(8px)" : "translateY(0)",
                  transition: stepTransitioning
                    ? "opacity 0.18s ease, transform 0.18s ease"
                    : "opacity 0.24s ease, transform 0.24s ease",
                }}>
                  <div style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 600, letterSpacing: "1.8px", textTransform: "uppercase", color: "#1254D9", marginBottom: 16 }}>
                    {stepLabel()}
                  </div>
                  <h2 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: wizardStep === 4 && wizardPath === "revoice" ? "clamp(26px,2.6vw,38px)" : "clamp(36px,3.6vw,52px)", lineHeight: .95, letterSpacing: "-.5px", textTransform: "uppercase", color: "#111111", margin: "0 0 12px" }}>
                    {title}
                  </h2>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#6A6A6A", margin: "0 0 44px", lineHeight: 1.5 }}>
                    {sub}
                  </p>

                  <div style={{ flex: isMobile ? undefined : 1, maxWidth: 840 }}>
                    {wizardStep === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "fit-content" }}>
                        <RadioCard selected={wizardPath === "flip"} onClick={() => setWizardPath("flip")}>My parts need reformatting or organizing.</RadioCard>
                        <RadioCard selected={wizardPath === "revoice"} onClick={() => setWizardPath("revoice")}>My music needs rewrites or revoicings.</RadioCard>
                      </div>
                    )}
                    {wizardStep === 2 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <input aria-label="Name" style={inputStyle} placeholder="Name *" value={wName} onChange={e => setWName(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="Email address" style={inputStyle} type="email" placeholder="Email *" value={wEmail} onChange={e => setWEmail(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="School or organization" style={inputStyle} placeholder="School / Organization *" value={wSchool} onChange={e => setWSchool(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                      </div>
                    )}
                    {wizardStep === 3 && wizardPath === "flip" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <input aria-label="Show name" style={inputStyle} placeholder="Show Name *" value={wShowName} onChange={e => setWShowName(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="Number of movements" style={inputStyle} type="number" min={1} placeholder="Number of Movements * (e.g. 3)" value={wMovements} onChange={e => setWMovements(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="Total number of instrument parts" style={inputStyle} type="number" min={1} placeholder="Total Number of Instrument Parts *" value={wNumParts} onChange={e => setWNumParts(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <select aria-label="Current format" style={{ ...inputStyle, color: wCurrentFormat ? "#141414" : "#A6A5A0" }} value={wCurrentFormat} onChange={e => setWCurrentFormat(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")}>
                          <option value="" disabled>Current Format of Your Parts *</option>
                          <option value="8.5×11 PDF parts">8.5×11 PDF parts</option>
                          <option value="Concert score only (no individual parts)">Concert score only (no individual parts)</option>
                          <option value="No parts provided at all">No parts provided at all</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                    {wizardStep === 3 && wizardPath === "revoice" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        <input aria-label="Show name" style={inputStyle} placeholder="Show Name *" value={wShowName} onChange={e => setWShowName(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="Number of movements" style={inputStyle} type="number" min={1} placeholder="Number of Movements * (e.g. 3)" value={wMovements} onChange={e => setWMovements(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="Total number of instrument parts" style={inputStyle} type="number" min={1} placeholder="Total Number of Instrument Parts *" value={wNumParts} onChange={e => setWNumParts(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <textarea aria-label="Source pieces" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} rows={3} placeholder="Source Pieces * — List the pieces included in your show" value={wSources} onChange={e => setWSources(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                      </div>
                    )}
                    {wizardStep === 4 && wizardPath === "revoice" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, color: "#111111", marginBottom: 10 }}>Which parts need work? *</div>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <RadioCard selected={wPartsNeedWork === "all"} onClick={() => setWPartsNeedWork("all")} size="sm">All parts</RadioCard>
                            <RadioCard selected={wPartsNeedWork === "specific"} onClick={() => setWPartsNeedWork("specific")} size="sm">Specific instruments</RadioCard>
                          </div>
                        </div>
                        {wPartsNeedWork === "specific" && (
                          <input aria-label="Which instruments" style={inputStyle} placeholder="Which instruments? * (e.g. Trumpet 1, Alto Sax 2)" value={wSpecificInstruments} onChange={e => setWSpecificInstruments(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        )}
                        <textarea aria-label="Describe the issues" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} rows={4} placeholder="Describe the issues you're experiencing *" value={wIssuesDescription} onChange={e => setWIssuesDescription(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <div>
                          <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, color: "#111111", marginBottom: 10 }}>Is this a stock show or custom arrangement? *</div>
                          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <RadioCard selected={wShowType === "stock"} onClick={() => setWShowType("stock")} size="sm">Stock show <span style={{ fontWeight: 400, color: "#5A5A5A" }}>(JW Pepper / Hal Leonard)</span></RadioCard>
                            <RadioCard selected={wShowType === "custom"} onClick={() => setWShowType("custom")} size="sm">Custom arrangement</RadioCard>
                          </div>
                        </div>
                      </div>
                    )}
                    {isFilesStep && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <input aria-label="Google Drive link" style={inputStyle} type="url" placeholder="Google Drive Link to Your Parts (optional)" value={wPartsLink} onChange={e => setWPartsLink(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <input aria-label="Deadline" style={inputStyle} type="date" value={wDeadline} onChange={e => setWDeadline(e.target.value)} onFocus={e => (e.target.style.borderColor = "#1254D9")} onBlur={e => (e.target.style.borderColor = "#CFCEC9")} />
                        <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", padding: 16, border: "1px solid #DCDBD7", background: "#F7F6F4" }}>
                          <input type="checkbox" checked={wExpress} onChange={e => setWExpress(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1254D9", marginTop: 3, cursor: "pointer" }} />
                          <span style={{ fontFamily: "var(--font-inter)", fontSize: 15, color: "#2A2A2A", lineHeight: 1.5 }}>
                            <strong>Express Delivery:</strong> I need my parts delivered within 48 hours. <em>(Rush fee applied)</em>
                          </span>
                        </label>
                      </div>
                    )}
                    {isFinalStep && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <ReviewGroup title="How Can I Help?" rows={[{ label: "Service", value: wizardPath === "flip" ? "Flip Folder Conversion" : "Part Editing & Revoicing" }]} onEdit={() => goToStep(1)} />
                        <ReviewGroup title="About You" rows={[{ label: "Name", value: wName }, { label: "Email", value: wEmail }, { label: "School", value: wSchool }]} onEdit={() => goToStep(2)} />
                        <ReviewGroup title="Your Show" rows={[{ label: "Show Name", value: wShowName }, { label: "Movements", value: wMovements }, { label: "Parts Count", value: wNumParts }, ...(wizardPath === "flip" ? [{ label: "Current Format", value: wCurrentFormat }] : [{ label: "Source Pieces", value: wSources }])]} onEdit={() => goToStep(3)} />
                        {wizardPath === "revoice" && (
                          <ReviewGroup title="What Needs to Change?" rows={[{ label: "Parts", value: wPartsNeedWork === "all" ? "All parts" : "Specific instruments" }, ...(wPartsNeedWork === "specific" ? [{ label: "Instruments", value: wSpecificInstruments }] : []), { label: "Issues", value: wIssuesDescription }, { label: "Show Type", value: wShowType === "stock" ? "Stock show (JW Pepper / Hal Leonard)" : "Custom arrangement" }]} onEdit={() => goToStep(4)} />
                        )}
                        <ReviewGroup title="Files & Timeline" rows={[{ label: "Drive Link", value: wPartsLink }, { label: "Deadline", value: wDeadline }, { label: "Express", value: wExpress ? "Yes — 48-hour turnaround" : "No" }]} onEdit={() => goToStep(wizardPath === "flip" ? 4 : 5)} />
                      </div>
                    )}
                  </div>

                  {wizardError && (
                    <div style={{ marginTop: 16, background: "#FEF2F2", border: "1px solid #FECACA", padding: "12px 16px" }}>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500, color: "#CC3333" }}>{wizardError}</span>
                    </div>
                  )}

                  {isFinalStep && (
                    <p style={{ fontSize: 12, color: "#9A9A95", margin: "24px 0 0", lineHeight: 1.5 }}>
                      By submitting, you agree to the{" "}
                      <Link href="/terms" style={{ color: "#1254D9", textDecoration: "underline" }}>Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" style={{ color: "#1254D9", textDecoration: "underline" }}>Privacy Policy</Link>.
                    </p>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: isFinalStep ? 12 : 40, paddingTop: 24, borderTop: "1px solid #E4E3DE" }}>
                    {wizardStep > 1 ? (
                      <button
                        onClick={handleBack}
                        onMouseEnter={isMobile ? undefined : e => (e.currentTarget.style.borderColor = "#111111")}
                        onMouseLeave={isMobile ? undefined : e => (e.currentTarget.style.borderColor = "#DCDBD7")}
                        onTouchStart={() => setBackPressed(true)}
                        onTouchEnd={() => setBackPressed(false)}
                        onTouchCancel={() => setBackPressed(false)}
                        style={{ background: "transparent", color: "#111111", border: "1.5px solid #DCDBD7", padding: isMobile ? "14px 24px" : "12px 24px", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", cursor: "pointer", transition: "border-color 0.2s ease, transform 0.1s ease, opacity 0.1s ease", transform: isMobile && backPressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && backPressed ? 0.75 : 1 }}
                      >
                        Back
                      </button>
                    ) : <div style={{ width: 1 }} />}
                    <button
                      onClick={handleContinue} disabled={!valid}
                      onMouseEnter={isMobile ? undefined : e => { if (valid) { e.currentTarget.style.background = "#0E45B5"; e.currentTarget.style.borderColor = "#0E45B5"; } }}
                      onMouseLeave={isMobile ? undefined : e => { e.currentTarget.style.background = "#1254D9"; e.currentTarget.style.borderColor = "#1254D9"; }}
                      onTouchStart={() => { if (valid) setContinuePressed(true); }}
                      onTouchEnd={() => setContinuePressed(false)}
                      onTouchCancel={() => setContinuePressed(false)}
                      style={{ background: "#1254D9", color: "#fff", border: "1.5px solid #1254D9", padding: isMobile ? "14px 28px" : "12px 28px", fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 600, letterSpacing: ".6px", textTransform: "uppercase", cursor: valid ? "pointer" : "default", opacity: !valid ? 0.38 : isMobile && continuePressed ? 0.75 : 1, pointerEvents: valid ? "auto" : "none", transition: "background .15s, border-color .15s, transform 0.1s ease, opacity 0.1s ease", transform: isMobile && continuePressed ? "scale(0.96)" : "scale(1)" }}
                    >
                      {isFinalStep ? "Submit Quote" : "Continue"}
                    </button>
                  </div>
                </div>
                </FadeUp>
              </>
            )}
          </div>
        </div>
        {isMobile && <MobileContactStrip />}
        </>
      )}

      {/* ── Screen 3: Send an Inquiry ── */}
      {contactView === "inquiry" && (
        <>
          <InquiryScreen transitioning={transitioning} onBack={goToLanding} initialDone={inquiryInitDone} />
          {isMobile && <MobileContactStrip />}
        </>
      )}

      <style>{`
        @media (max-width: 768px) {
          .contact-left-panel { display: none !important; }
        }
      `}</style>
    </section>
  );
}
