"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AboutGridPattern from "./AboutGridPattern";
import { useIsMobile } from "../hooks/useIsMobile";
import { FadeUp } from "./FadeUp";

const LOGOS = [
  {
    src: "/University_of_Memphis_seal.svg.png",
    w: 960, h: 1377,
    alt: "University of Memphis",
    label: "University of Memphis",
    // Desktop hover overlay only: the overlay is as narrow as the logo (104px), so it gets the short name.
    // Mobile (full-width panel) and the screen-reader label use the full name.
    shortLabel: "U of M",
    // Desktop hover overlay width in px. The Memphis seal is only 104px wide, far too narrow for its two
    // degree lines; the overlay stretches to the right (over the gap / the next logo) so each line fits on one row.
    overlayWidth: 240,
    lines: [
      { text: "M.M. in Music Composition", year: "2023–2025" },
      { text: "DMA in Music Composition", year: "2025–present" },
    ],
  },
  {
    src: "/Ole-Miss-Logo-PNG-File.png",
    w: 833, h: 833,
    alt: "University of Mississippi",
    label: "University of Mississippi",
    lines: [
      { text: "B.A. in Music", year: "2021–2023" },
    ],
  },
  {
    src: "/hb-logo.png",
    w: 500, h: 400,
    alt: "Hernando HS Band",
    label: "Hernando HS Band",
    lines: [
      { text: "Member", year: "2015–2019" },
      { text: "Adjunct Staff", year: "2019–present" },
    ],
  },
];

// The label + degree lines shown for a logo. Desktop: inside the hover overlay on the logo itself.
// Mobile: in the shared panel under the logo row (the logos are too small to hold this text).
function LogoDetails({ label, lines }: { label: string; lines: typeof LOGOS[0]["lines"] }) {
  return (
    <>
      <div style={{
        fontFamily: "var(--font-body)",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "1px",
        textTransform: "uppercase",
        color: "#1254D9",
        marginBottom: 6,
      }}>
        {label}
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.5, color: "#111111", marginBottom: i === lines.length - 1 ? 0 : 6 }}>
          <div>{l.text}</div>
          <div style={{ color: "#6A6A6A" }}>{l.year}</div>
        </div>
      ))}
    </>
  );
}

function LogoItem({ src, w, h, alt, label, shortLabel, overlayWidth, lines, active, dimmed, fadedByNeighbor, onHover, onActivate }: typeof LOGOS[0] & { shortLabel?: string; overlayWidth?: number; active: boolean; dimmed: boolean; fadedByNeighbor: boolean; onHover: (hovering: boolean) => void; onActivate: () => void }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const ariaLabel = `${label}: ${lines.map(l => `${l.text} ${l.year}`).join(", ")}`;
  // Desktop: hovering swaps the logo for an overlay of its details. Mobile: no overlay (the text
  // overflowed the small logo box) — the active logo stays full-strength, the others dim, and the
  // details show in the panel under the row.
  const isRevealed = !isMobile && hovered;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isMobile ? active : undefined}
      style={{ position: "relative", zIndex: isRevealed ? 2 : undefined, cursor: "pointer", display: "flex", alignItems: "center", transition: "transform 0.1s ease, opacity 0.1s ease", transform: isMobile && pressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && pressed ? 0.75 : 1 }}
      onMouseEnter={isMobile ? undefined : () => { setHovered(true); onHover(true); }}
      onMouseLeave={isMobile ? undefined : () => { setHovered(false); onHover(false); }}
      onFocus={isMobile ? undefined : () => { setHovered(true); onHover(true); }}
      onBlur={isMobile ? undefined : () => { setHovered(false); onHover(false); }}
      onClick={isMobile ? onActivate : undefined}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); } }}
    >
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes="175px"
        style={{
          height: "clamp(80px,23vw,175px)",
          width: "auto",
          display: "block",
          transition: "opacity .35s ease",
          opacity: isMobile ? (dimmed ? 0.35 : 1) : (isRevealed || fadedByNeighbor ? 0.1 : 1),
        }}
      />
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            ...(overlayWidth ? { width: overlayWidth } : { right: 0 }),
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
          <LogoDetails label={shortLabel ?? label} lines={lines} />
        </div>
      )}
    </div>
  );
}

export default function AboutSection() {
  const isMobile = useIsMobile();
  const [activeLogo, setActiveLogo] = useState<string | null>(null);
  // Desktop only: which logo is being hovered. A logo with a wide overlay (Memphis) covers its
  // neighbour, so while it is hovered the other logos fade to the same ghost level instead of
  // peeking out around the card.
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
  const hoveredHasWideOverlay = hoveredLogo !== null && !!LOGOS.find(l => l.src === hoveredLogo)?.overlayWidth;

  // Mobile details panel: collapsed (0px, takes no space) until a logo is tapped, then animates
  // to the height of that logo's text. Each logo's details are stacked absolutely inside the
  // panel so their natural heights can be measured; the panel's height follows the active one
  // (and re-measures if the text re-wraps, e.g. on rotation).
  const detailRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelH, setPanelH] = useState(0);
  useEffect(() => {
    const el = activeLogo ? detailRefs.current[activeLogo] : null;
    if (!el) return;
    const ro = new ResizeObserver(() => setPanelH(el.offsetHeight));
    ro.observe(el); // fires once immediately with the initial size
    // Once it has finished opening, make sure the text isn't sitting below the fold.
    const t = setTimeout(() => panelRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 400);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [activeLogo]);

  const handleActivate = (src: string) => {
    setActiveLogo(prev => prev === src ? null : src);
  };
  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "calc(100vh - 98px)", background: "#FFFFFF" }}>
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
        <FadeUp delay={0} style={{
          flex: isMobile ? "0 0 auto" : "0 0 35%",
          width: isMobile ? "100%" : undefined,
          minWidth: isMobile ? 0 : 280,
          position: "relative",
          overflow: "hidden",
          minHeight: isMobile ? "clamp(280px,70vw,420px)" : 540,
          order: isMobile ? 0 : undefined,
        }}>
          {isMobile ? (
            // Mobile: in-flow image at its natural 3:4 ratio, so the box is as tall as the whole
            // photo (390x520 on a phone). `fill` would collapse the box to the 280px minHeight and
            // crop the photo to about half its height.
            <Image
              src="/grad.jpg"
              alt="Cooper Mapes"
              width={1200}
              height={1600}
              priority
              sizes="100vw"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          ) : (
            // Desktop: the box is stretched to the text column's height, so the photo fills it and
            // crops to fit (focal point 60% / 22%).
            <Image
              src="/grad.jpg"
              alt="Cooper Mapes"
              fill
              priority
              sizes="35vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "60% 22%",
                display: "block",
              }}
            />
          )}
        </FadeUp>

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
          <FadeUp delay={isMobile ? 100 : 150}>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(44px,6.5vw,80px)",
              lineHeight: 0.92,
              letterSpacing: "0",
              textTransform: "uppercase",
              color: "#111111",
              margin: 0,
            }}>
              {/* Wordmark image sized in em off the h1's font-size (same method as the
                  Projects logo): caps are 606/637 of the image height → 0.8178em tall,
                  and the 0.0078em top offset seats the baseline where the text glyphs
                  would sit in a 0.92 line box. */}
              <Image
                src="/about-logo.png"
                alt="About"
                width={3058}
                height={637}
                priority
                sizes="320px"
                style={{ display: "block", height: "0.8178em", width: "auto", margin: "0.0078em 0 0.0944em" }}
              />
            </h1>
          </FadeUp>

          <FadeUp delay={isMobile ? 150 : 500}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 20, color: "#3A3A3A", lineHeight: 1.8, marginTop: 28, textAlign: "left", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
              At the age of 12, I downloaded MuseScore&apos;s notation software for the first time. From this, I have developed my arranging skills and have gained a deep-seated passion for music for over a decade.
            </p>
          </FadeUp>
          <FadeUp delay={isMobile ? 200 : 650}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 20, color: "#3A3A3A", lineHeight: 1.8, marginTop: 18, textAlign: "left", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
              My name is Cooper Mapes; I am a freelance musician, specializing in marching band arranging and software-based music engraving.
            </p>
          </FadeUp>
          <FadeUp delay={isMobile ? 250 : 800}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 20, color: "#3A3A3A", lineHeight: 1.8, marginTop: 18, textAlign: "left", textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
              I hold a Bachelor of Arts in Music from the University of Mississippi and a Master of Music in Composition from the University of Memphis. I am currently furthering my education at U of M, pursuing a Doctor of Musical Arts in Music Composition.
            </p>
          </FadeUp>

          {/* Logo row */}
          <FadeUp delay={isMobile ? 350 : 1100}>
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
                <LogoItem key={logo.src} {...logo} active={activeLogo === logo.src} dimmed={activeLogo !== null && activeLogo !== logo.src} fadedByNeighbor={hoveredHasWideOverlay && hoveredLogo !== logo.src} onHover={(h) => setHoveredLogo(h ? logo.src : (prev) => (prev === logo.src ? null : prev))} onActivate={() => handleActivate(logo.src)} />
              ))}
            </div>

            {/* Mobile: details for the tapped logo. Collapsed to nothing until a logo is tapped (no
                placeholder, no reserved space); tapping the same logo again closes it. The logos carry
                the full text in their aria-labels, so this is hidden from screen readers to avoid
                reading it twice. */}
            {isMobile && (
              <div
                ref={panelRef}
                aria-hidden="true"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: activeLogo ? panelH : 0,
                  transition: "height .35s ease",
                }}
              >
                {LOGOS.map(logo => (
                  <div
                    key={logo.src}
                    ref={(el) => { detailRefs.current[logo.src] = el; }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      paddingTop: 24,
                      textAlign: "center",
                      opacity: activeLogo === logo.src ? 1 : 0,
                      transition: "opacity .35s ease",
                    }}
                  >
                    <LogoDetails label={logo.label} lines={logo.lines} />
                  </div>
                ))}
              </div>
            )}
          </FadeUp>
        </div>

        {/* Right — Stats */}
        <div style={{
          flex: isMobile ? "0 0 auto" : "0 0 22%",
          width: isMobile ? "100%" : undefined,
          order: isMobile ? 2 : undefined,
        }} />

      </div>
    </div>
  );
}
