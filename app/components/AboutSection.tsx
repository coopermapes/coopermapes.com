"use client";

import { useEffect, useRef, useState } from "react";
import AboutGridPattern from "./AboutGridPattern";
import { useIsMobile } from "../hooks/useIsMobile";

function ScrollFadeUp({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
      isMobile
        ? { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
        : { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, isMobile]);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

const LOGOS = [
  {
    src: "/University_of_Memphis_seal.svg.png",
    alt: "University of Memphis",
    label: "U of Memphis",
    lines: [
      { text: "M.M. Music Composition", year: "2023–2025" },
      { text: "DMA Music Composition", year: "2025–present" },
    ],
  },
  {
    src: "/Ole-Miss-Logo-PNG-File.png",
    alt: "Ole Miss",
    label: "Ole Miss",
    lines: [
      { text: "B.A. in Music", year: "2021–2023" },
    ],
  },
  {
    src: "/hb-logo.png",
    alt: "Hernando HS Band",
    label: "Hernando HS Band",
    lines: [
      { text: "Member", year: "2015–2019" },
      { text: "Adjunct Staff", year: "2019–present" },
    ],
  },
];

function LogoItem({ src, alt, label, lines, active, onActivate }: typeof LOGOS[0] & { active: boolean; onActivate: () => void }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const ariaLabel = `${label}: ${lines.map(l => `${l.text} ${l.year}`).join(", ")}`;
  const isRevealed = isMobile ? active : hovered;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center", transition: "transform 0.1s ease, opacity 0.1s ease", transform: isMobile && pressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && pressed ? 0.75 : 1 }}
      onMouseEnter={isMobile ? undefined : () => setHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setHovered(false)}
      onFocus={isMobile ? undefined : () => setHovered(true)}
      onBlur={isMobile ? undefined : () => setHovered(false)}
      onClick={isMobile ? onActivate : undefined}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); } }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          height: "clamp(80px,23vw,175px)",
          width: "auto",
          display: "block",
          transition: "opacity .35s ease",
          opacity: isRevealed ? 0.1 : 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          minWidth: isMobile ? "clamp(110px,30vw,140px)" : undefined,
          background: "rgba(255,255,255,0.95)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 10,
          opacity: isRevealed ? 1 : 0,
          transition: "opacity .35s ease",
          pointerEvents: "none",
        }}
      >
        <div style={{
          fontFamily: "var(--font-inter)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#1254D9",
          marginBottom: 6,
        }}>
          {label}
        </div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: "var(--font-inter)", fontSize: 13, lineHeight: 1.5, color: "#111111" }}>
            {l.text}{" "}
            <span style={{ color: "#6A6A6A" }}>{l.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const isMobile = useIsMobile();
  const [activeLogo, setActiveLogo] = useState<string | null>(null);

  const handleActivate = (src: string) => {
    setActiveLogo(prev => prev === src ? null : src);
  };
  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 98px)" }}>
      {!isMobile && <AboutGridPattern />}

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexWrap: "wrap",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "stretch",
        minHeight: "calc(100vh - 98px)",
      }}>

        {/* Left — Photo */}
        <ScrollFadeUp delay={0} style={{
          flex: isMobile ? "0 0 auto" : "0 0 35%",
          width: isMobile ? "100%" : undefined,
          minWidth: isMobile ? 0 : 280,
          position: "relative",
          overflow: "hidden",
          minHeight: isMobile ? "clamp(280px,70vw,420px)" : 540,
          order: isMobile ? 0 : undefined,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/grad.jpg"
            alt="Cooper Mapes"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "60% 22%",
              display: "block",
            }}
          />
        </ScrollFadeUp>

        {/* Middle — Bio */}
        <div style={{
          flex: isMobile ? "0 0 auto" : 1,
          width: isMobile ? "100%" : undefined,
          padding: isMobile
            ? "clamp(28px,7vw,48px) clamp(20px,5vw,40px)"
            : "clamp(48px,6vw,80px) clamp(24px,3vw,48px) clamp(48px,6vw,80px) clamp(40px,5vw,80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          order: isMobile ? 1 : undefined,
        }}>
          <ScrollFadeUp delay={isMobile ? 100 : 150}>
            <h1 style={{
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              fontSize: isMobile ? "clamp(36px,9vw,56px)" : "clamp(44px,5.5vw,82px)",
              lineHeight: 0.92,
              letterSpacing: "-1.5px",
              textTransform: "uppercase",
              color: "#111111",
              margin: 0,
            }}>
              About
            </h1>
          </ScrollFadeUp>

          <ScrollFadeUp delay={isMobile ? 150 : 500}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#3A3A3A", lineHeight: 1.8, marginTop: 28, textAlign: "left", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
              At the age of 12 I downloaded MuseScore&apos;s notation software for the first time. What has come from that is over a decade of developing my arranging skills and forming a deep-seated passion for music.
            </p>
          </ScrollFadeUp>
          <ScrollFadeUp delay={isMobile ? 200 : 650}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#3A3A3A", lineHeight: 1.8, marginTop: 18, textAlign: "left", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
              My name is Cooper Mapes and I am a marching band arranger.
            </p>
          </ScrollFadeUp>
          <ScrollFadeUp delay={isMobile ? 250 : 800}>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 17, color: "#3A3A3A", lineHeight: 1.8, marginTop: 18, textAlign: "left", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
              Whether you&apos;re a first-time marching director looking for basic resources, or part of an established program seeking in-depth show analysis, my services can help your band take the next step as an ensemble.
            </p>
          </ScrollFadeUp>

          {/* Logo row */}
          <ScrollFadeUp delay={isMobile ? 300 : 950}>
            <div style={{
              marginTop: 40,
              paddingTop: 32,
              borderTop: "1px solid #E4E3DE",
              display: "flex",
              gap: "clamp(12px,2vw,28px)",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}>
              {LOGOS.map(logo => (
                <LogoItem key={logo.src} {...logo} active={activeLogo === logo.src} onActivate={() => handleActivate(logo.src)} />
              ))}
            </div>
          </ScrollFadeUp>
        </div>

        {/* Right — Stats */}
        <div style={{
          flex: isMobile ? "0 0 auto" : "0 0 22%",
          width: isMobile ? "100%" : undefined,
          padding: isMobile
            ? "clamp(20px,5vw,36px) clamp(20px,5vw,40px) clamp(32px,7vw,52px)"
            : "clamp(80px,10.4vw,150px) clamp(20px,2.2vw,36px) clamp(48px,5vw,72px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          order: isMobile ? 2 : undefined,
          background: isMobile ? "#F7F6F4" : undefined,
        }}>
          {[
            { label: "Years Arranging with Music Notation Software", value: "13", initialDelay: isMobile ? 0 : 1050 },
            { label: "Years Teaching Competitive Marching Band", value: "7", initialDelay: isMobile ? 100 : 1150 },
            { label: "Years of Collegiate Music Experience", value: "7", initialDelay: isMobile ? 200 : 1250 },
          ].map((stat, i, arr) => (
            <ScrollFadeUp key={i} delay={stat.initialDelay}>
            <div
              style={{
                padding: isMobile ? "clamp(12px,3vw,20px) 0" : "clamp(22px,2.8vw,36px) 0",
                borderBottom: i < arr.length - 1 ? "1px solid #E4E3DE" : "none",
              }}
            >
              <div style={{
                fontFamily: "var(--font-inter)",
                fontSize: isMobile ? 12 : 16,
                fontWeight: 600,
                letterSpacing: isMobile ? "1px" : "2px",
                textTransform: "uppercase",
                color: "#6F6F6A",
                marginBottom: isMobile ? 12 : 20,
                lineHeight: 1.4,
                maxWidth: isMobile ? "155px" : undefined,
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: "var(--font-anton)",
                fontWeight: 400,
                fontSize: "clamp(48px,4.5vw,72px)",
                lineHeight: 0.88,
                letterSpacing: "-2px",
                color: "#111111",
              }}>
                {stat.value}
              </div>
            </div>
            </ScrollFadeUp>
          ))}
        </div>

      </div>
    </div>
  );
}
