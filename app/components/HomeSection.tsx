"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import GridPattern from "./GridPattern";
import { useIsMobile } from "../hooks/useIsMobile";

function FadeUp({ delay, children, style }: { delay: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    if (isMobile) {
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
    }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, isMobile]);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

function HeroCta({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={() => router.push("/portfolio")}
      onMouseEnter={isMobile ? undefined : (e) => { const b = e.currentTarget; b.style.background = "#0E45B5"; b.style.borderColor = "#0E45B5"; }}
      onMouseLeave={isMobile ? undefined : (e) => { const b = e.currentTarget; b.style.background = "#1254D9"; b.style.borderColor = "#1254D9"; }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        fontFamily: "var(--font-body)", fontSize: 18, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase",
        color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", lineHeight: 1, border: "1.5px solid #1254D9", padding: "15px 21px",
        background: "#1254D9", borderRadius: 0,
        transition: "background-color .2s ease, border-color .2s ease, transform 0.1s ease, opacity 0.1s ease",
        transform: isMobile && pressed ? "scale(0.96)" : "scale(1)",
        opacity: isMobile && pressed ? 0.75 : 1,
      }}
    >
      Explore My Works
    </button>
  );
}

export default function HomeSection() {
  const isMobile = useIsMobile();
  // Mobile only: the hero stretches so hero + footer exactly fill the viewport
  // (footer's bottom edge lands on the bottom of the screen, no black below it).
  // The footer's height depends on text wrapping, so it's measured, not hardcoded.
  const [footerH, setFooterH] = useState(0);
  // Mobile type scale is 16 / 18 / 20 — eyebrow is tertiary (16). Desktop stays fluid.
  const eyebrowSize = isMobile ? 16 : "clamp(16px,1.45vw,22px)";
  useEffect(() => {
    if (!isMobile) return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const measure = () => setFooterH(footer.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(footer);
    return () => ro.disconnect();
  }, [isMobile]);

  return (
    <section id="home">
      {/* ── Hero ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: isMobile ? `calc(100svh - ${footerH}px + 2px)` : "calc(100vh - 98px)",
        background: "#ffffff",
        paddingTop: isMobile ? 98 : 0,
      }}>
        <GridPattern interactive />

        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: isMobile
            ? "clamp(48px,14vw,72px) clamp(20px,5vw,40px)"
            : "clamp(48px,10vh,96px) clamp(24px,5vw,64px)",
          position: "relative",
          zIndex: 1,
        }}>
          {/* H1 */}
          <FadeUp delay={150}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: isMobile ? "min(clamp(27px,8.64vw,54px), calc((100vw - 2 * clamp(20px,5vw,40px)) / 10.781))" : "min(clamp(43.2px,8.64vw,115.2px), calc((100vw - 2 * clamp(24px,5vw,64px)) / 10.781))", lineHeight: ".84", letterSpacing: "0", textTransform: "uppercase", color: "#111111", margin: 0 }}>
              {/* Wordmark image, sized in em off the h1's own font-size (same method as the
                  page-title logos). The small letters' caps are 607px of the 861px-tall image
                  → image is 1.1035em tall and 9.703em wide; the big C and M rise above the
                  cap line. marginTop (-0.3192em) puts the image's baseline where the text
                  glyphs' baseline sat in this 0.84 line box, and marginBottom keeps the box
                  0.84em tall so the spacing below is unchanged. The font-size above is capped
                  so the 9.703em-wide image always fits between the hero's side padding.
                  Sizes are 90% of the original (10% smaller than first set); 10.781 = 9.703 / 0.9. */}
              <Image
                src="/name-wordmark.png"
                alt="Cooper Mapes"
                width={7571}
                height={861}
                priority
                sizes="(max-width: 768px) 100vw, 1250px"
                style={{ display: "block", height: "1.1035em", width: "auto", margin: "-0.3192em 0 0.0557em" }}
              />
            </h1>
          </FadeUp>

          {/* Eyebrow */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 22 }}>
            <FadeUp delay={550} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: eyebrowSize, fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase", color: "#1254D9" }}>Arranger</span>
            </FadeUp>
            <FadeUp delay={550} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: eyebrowSize, fontWeight: 500, color: "#1254D9", opacity: 0.5 }}> · </span>
            </FadeUp>
            <FadeUp delay={700} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: eyebrowSize, fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase", color: "#1254D9" }}>Composer</span>
            </FadeUp>
            <FadeUp delay={700} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: eyebrowSize, fontWeight: 500, color: "#1254D9", opacity: 0.5 }}> · </span>
            </FadeUp>
            <FadeUp delay={850} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-body)", fontSize: eyebrowSize, fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase", color: "#1254D9" }}>Educator</span>
            </FadeUp>
          </div>

          {/* CTA */}
          <FadeUp delay={1050} style={{ marginTop: 36 }}>
            <HeroCta isMobile={isMobile} />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
