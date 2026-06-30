"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GridPattern from "./GridPattern";
import { useIsMobile } from "../hooks/useIsMobile";

function FadeUp({ delay, children, style }: { delay: number; children: React.ReactNode; style?: React.CSSProperties }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

function ScrollFadeUp({ delay = 0, distance = 24, scale = false, rootMargin = "0px 0px -80px 0px", children, style }: {
  delay?: number; distance?: number; scale?: boolean; rootMargin?: string;
  children: React.ReactNode; style?: React.CSSProperties;
}) {
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
      { threshold: 0.1, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, rootMargin]);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0) scale(1)" : `translateY(${distance}px) scale(${scale ? 0.97 : 1})`,
      transition: "opacity 0.6s ease, transform 0.6s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

function BeforeAfterSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const beforeClipRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const positionRef = useRef(50);

  const setPosition = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    positionRef.current = clamped;
    if (afterRef.current) afterRef.current.style.clipPath = `inset(0 0 0 ${clamped}%)`;
    if (beforeClipRef.current) beforeClipRef.current.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    if (handleRef.current) handleRef.current.style.left = `${clamped}%`;
    if (sliderRef.current) sliderRef.current.setAttribute("aria-valuenow", String(Math.round(clamped)));
  };

  const getPct = (e: PointerEvent) => {
    const rect = sliderRef.current!.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };

  useEffect(() => {
    setPosition(50);
    const el = sliderRef.current;
    if (!el) return;

    const onDown = (e: PointerEvent) => { dragging.current = true; el.setPointerCapture(e.pointerId); setPosition(getPct(e)); };
    const onMove = (e: PointerEvent) => { if (dragging.current) setPosition(getPct(e)); };
    const onUp   = () => { dragging.current = false; };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup",   onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup",   onUp);
    };
  }, []);

  return (
    <div
      ref={sliderRef}
      role="slider"
      tabIndex={0}
      aria-label="Before and after score comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={50}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); setPosition(positionRef.current + 5); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); setPosition(positionRef.current - 5); }
      }}
      style={{ position: "relative", width: "100%", aspectRatio: "3/2", overflow: "hidden", background: "#fff", cursor: "ew-resize", userSelect: "none", touchAction: "pan-y", border: "1px solid #2A2A2A" }}
    >
      {/* Before (base layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/before.jpg" alt="Original score" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />

      {/* After (clipped) */}
      <div ref={afterRef} style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 0 50%)", background: "#fff" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/after.jpg" alt="Engraved score" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", display: "block" }} />
        <span style={{ position: "absolute", bottom: 16, right: 16, background: "#1254D9", color: "#fff", fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".6px", padding: "8px 12px", borderRadius: 0, pointerEvents: "none" }}>After</span>
      </div>

      {/* Before label overlay */}
      <div ref={beforeClipRef} style={{ position: "absolute", inset: 0, clipPath: "inset(0 50% 0 0)", pointerEvents: "none" }}>
        <span style={{ position: "absolute", bottom: 16, left: 16, background: "#2A2A2A", color: "#fff", fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".6px", padding: "8px 12px", borderRadius: 0 }}>Before</span>
      </div>
      <div ref={handleRef} style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 2, background: "#fff", transform: "translateX(-1px)", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 46, height: 46, borderRadius: "50%", background: "#1254D9", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px rgba(255,255,255,.85)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 6 4 12 9 18" />
            <polyline points="15 6 20 12 15 18" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function CtaButton({ onClick, isMobile }: { onClick: (e: React.MouseEvent) => void; isMobile: boolean }) {
  const sweepRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pressed, setPressed] = useState(false);

  const onEnter = () => {
    if (sweepRef.current) sweepRef.current.style.transform = "scaleY(1)";
    if (btnRef.current) {
      btnRef.current.style.color = "#ffffff";
      btnRef.current.style.borderColor = "#1254D9";
      btnRef.current.style.boxShadow = "0 8px 20px rgba(18,84,217,.22)";
    }
  };
  const onLeave = () => {
    if (sweepRef.current) sweepRef.current.style.transform = "scaleY(0)";
    if (btnRef.current) {
      btnRef.current.style.color = "#111111";
      btnRef.current.style.borderColor = "#111111";
      btnRef.current.style.boxShadow = "0 4px 16px rgba(0,0,0,.08)";
    }
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseEnter={isMobile ? undefined : onEnter}
      onMouseLeave={isMobile ? undefined : onLeave}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        position: "relative", overflow: "hidden",
        fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 600, letterSpacing: "1.6px", textTransform: "uppercase",
        color: "#111111", marginTop: 36, display: "inline-flex", alignItems: "center", justifyContent: "center",
        gap: 10, cursor: "pointer", width: "fit-content", lineHeight: 1,
        border: "1.5px solid #111111", padding: "16px 32px", background: "#ffffff",
        boxShadow: "0 4px 16px rgba(0,0,0,.08)",
        transition: "color .32s ease, border-color .32s ease, box-shadow .32s ease, transform 0.1s ease, opacity 0.1s ease",
        transform: isMobile && pressed ? "scale(0.96)" : "scale(1)",
        opacity: isMobile && pressed ? 0.75 : 1,
      }}
    >
      {!isMobile && <span ref={sweepRef} style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%", background: "#1254D9", transform: "scaleY(0)", transformOrigin: "top", transition: "transform .32s cubic-bezier(.4,0,.2,1)", pointerEvents: "none", zIndex: 0 }} />}
      <span style={{ position: "relative", zIndex: 1 }}>See A Before &amp; After</span>
    </button>
  );
}

export default function HomeSection() {
  const fixRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isMobile = useIsMobile();
  const topLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const copyDivRef = useRef<HTMLDivElement>(null);
  const [topFontSize, setTopFontSize] = useState<string | undefined>(undefined);
  const [bottomFontSize, setBottomFontSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isMobile) return;
    const fit = () => {
      const container = copyDivRef.current;
      const top = topLineRef.current;
      const bottom = bottomLineRef.current;
      if (!container || !top || !bottom) return;
      const w = container.offsetWidth;

      // Fit top line
      top.style.whiteSpace = "nowrap";
      let lo = 8, hi = 80;
      while (hi - lo > 0.25) {
        const mid = (lo + hi) / 2;
        top.style.fontSize = mid + "px";
        if (top.scrollWidth <= w) lo = mid; else hi = mid;
      }
      const topPx = lo;
      setTopFontSize(topPx + "px");

      // Fit bottom line to same container width
      bottom.style.whiteSpace = "nowrap";
      lo = 8; hi = 180;
      while (hi - lo > 0.25) {
        const mid = (lo + hi) / 2;
        bottom.style.fontSize = mid + "px";
        if (bottom.scrollWidth <= w) lo = mid; else hi = mid;
      }
      setBottomFontSize(lo + "px");
    };

    fit();
    const ro = new ResizeObserver(fit);
    if (copyDivRef.current) ro.observe(copyDivRef.current);
    return () => ro.disconnect();
  }, [isMobile]);

  const scrollToFix = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!fixRef.current) return;
    const top = fixRef.current.getBoundingClientRect().top + window.scrollY - 98;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const goTo = (path: string) => () => {
    router.push(path);
  };

  const [pressedServices, setPressedServices] = useState(false);
  const [pressedContact, setPressedContact] = useState(false);

  return (
    <section id="home">
      {/* ── Panel 1: Hero ── */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: isMobile ? "column" : "row-reverse",
        minHeight: isMobile ? "auto" : "calc(100vh - 98px)",
        background: "#ffffff",
        paddingTop: isMobile ? 98 : 0,
      }}>
        <GridPattern interactive />

        {/* Text column */}
        <div style={{
          flex: isMobile ? "0 0 auto" : "1 1 460px",
          width: isMobile ? "100%" : undefined,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: isMobile
            ? "clamp(36px,8vw,52px) clamp(20px,5vw,40px) clamp(32px,8vw,48px)"
            : "clamp(24px,calc(27vh - 36px),384px) clamp(24px,5vw,64px) clamp(48px,6vw,96px)",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 22 }}>
            <FadeUp delay={550} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(13px,1.45vw,18px)", fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase", color: "#1254D9" }}>Arranger</span>
            </FadeUp>
            <FadeUp delay={550} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(13px,1.45vw,18px)", fontWeight: 500, color: "#1254D9", opacity: 0.5 }}> · </span>
            </FadeUp>
            <FadeUp delay={700} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(13px,1.45vw,18px)", fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase", color: "#1254D9" }}>Composer</span>
            </FadeUp>
            <FadeUp delay={700} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(13px,1.45vw,18px)", fontWeight: 500, color: "#1254D9", opacity: 0.5 }}> · </span>
            </FadeUp>
            <FadeUp delay={850} style={{ display: "inline-block" }}>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(13px,1.45vw,18px)", fontWeight: 500, letterSpacing: ".5px", textTransform: "uppercase", color: "#1254D9" }}>Educator</span>
            </FadeUp>
          </div>

          {/* H1 */}
          <FadeUp delay={150}>
            <h1 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(62px,9.6vw,128px)", lineHeight: ".84", letterSpacing: "-2px", textTransform: "uppercase", color: "#111111", margin: 0 }}>
              Cooper<br />Mapes
              <span style={{ fontFamily: "var(--font-inter)", fontSize: ".18em", fontWeight: 500, letterSpacing: 0, position: "relative", top: "-4.0em", marginLeft: "0.05em" }}>©</span>
            </h1>
          </FadeUp>

          {/* Subtitle */}
          <FadeUp delay={1050}>
            <p style={{
              fontSize: isMobile ? "clamp(16px,4.2vw,21px)" : "clamp(18px,1.55vw,21px)",
              lineHeight: 1.5,
              fontWeight: 600,
              color: "#3A3A3A",
              margin: "26px 0 0",
              maxWidth: isMobile ? "100%" : 440,
              textAlign: "left",
            }}>
              Music editing, engraving, and arranging<br />for performing ensembles.
            </p>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={1200}>
            <CtaButton onClick={scrollToFix} isMobile={isMobile} />
          </FadeUp>
        </div>

        {/* Photo column */}
        <FadeUp delay={0} style={{
          flex: isMobile ? "0 0 auto" : "1 1 460px",
          width: isMobile ? "100%" : undefined,
          alignSelf: "stretch",
          overflow: "hidden",
          minHeight: isMobile ? "clamp(280px,80vw,420px)" : 440,
          background: "#EAEAEA",
          position: "relative",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/teaching.jpg"
            alt="Cooper Mapes on the field"
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 22%", display: "block" }}
          />
        </FadeUp>
      </div>

      {/* ── Panel 2: Before/After (dark) ── */}
      <div ref={fixRef} style={{
        background: "#020201",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: isMobile ? "clamp(28px,7vw,48px)" : "clamp(40px,5vw,72px)",
        padding: isMobile
          ? "clamp(40px,9vw,64px) clamp(20px,5vw,40px) clamp(32px,7vw,52px)"
          : "clamp(64px,7vw,96px) clamp(24px,5vw,64px) clamp(32px,3.5vw,52px)",
      }}>
        {/* Slider */}
        <div style={{ flex: isMobile ? "0 0 100%" : "1 1 440px", width: isMobile ? "100%" : undefined }}>
          <ScrollFadeUp delay={0} scale>
            <BeforeAfterSlider />
          </ScrollFadeUp>
        </div>

        {/* Copy */}
        <div ref={copyDivRef} style={{ flex: isMobile ? "0 0 100%" : "1 1 380px", width: isMobile ? "100%" : undefined }}>
          <ScrollFadeUp delay={0}>
            <span ref={topLineRef} style={{
              display: "block",
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              textTransform: "uppercase",
              color: "#ffffff",
              fontSize: isMobile ? (topFontSize ?? "clamp(14px,4.6vw,26px)") : "clamp(20px,2.86vw,38px)",
              lineHeight: 1.04,
              letterSpacing: ".2px",
              whiteSpace: isMobile ? "nowrap" : "nowrap",
            }}>
              Your sheet music is not cutting it.
            </span>
          </ScrollFadeUp>
          <ScrollFadeUp delay={150} distance={32}>
            <span ref={bottomLineRef} style={{
              display: "block",
              fontFamily: "var(--font-anton)",
              fontWeight: 400,
              textTransform: "uppercase",
              color: "#1254D9",
              fontSize: isMobile ? (bottomFontSize ?? "clamp(36px,11.8vw,68px)") : "clamp(54px,7.9vw,106px)",
              lineHeight: ".88",
              letterSpacing: "-2px",
              marginTop: 10,
            }}>
              I can fix that
            </span>
          </ScrollFadeUp>
          <ScrollFadeUp delay={350}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#B4B4B0", margin: "24px 0 0", maxWidth: 470, textAlign: "left" }}>
              The harder your music is to <em>read,</em> the harder it is to <em>teach.</em>
            </p>
          </ScrollFadeUp>
          <ScrollFadeUp delay={450}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#B4B4B0", margin: "8px 0 0", maxWidth: 470, textAlign: "left" }}>
              <em>Don&apos;t settle</em> for unorganized music.
            </p>
          </ScrollFadeUp>
          <ScrollFadeUp delay={550}>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "#B4B4B0", margin: "8px 0 0", maxWidth: 470, textAlign: "left" }}>
              The key to legible scores and parts is a <em>click away.</em>
            </p>
          </ScrollFadeUp>
          <ScrollFadeUp delay={700} rootMargin="0px 0px 200px 0px">
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: isMobile ? "column" : "row",
              gap: 14,
              marginTop: 30,
            }}>
              <button
                onClick={goTo("/services")}
                onMouseEnter={isMobile ? undefined : (e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffffff"; }}
                onMouseLeave={isMobile ? undefined : (e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,.35)"; }}
                onTouchStart={() => setPressedServices(true)}
                onTouchEnd={() => setPressedServices(false)}
                onTouchCancel={() => setPressedServices(false)}
                style={{ background: "transparent", color: "#ffffff", border: "1.5px solid rgba(255,255,255,.35)", padding: "16px 24px", fontSize: 13, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", cursor: "pointer", transition: "border-color .2s ease, transform 0.1s ease, opacity 0.1s ease", fontFamily: "var(--font-inter)", borderRadius: 0, width: isMobile ? "100%" : undefined, transform: isMobile && pressedServices ? "scale(0.96)" : "scale(1)", opacity: isMobile && pressedServices ? 0.75 : 1 }}
              >
                More About What I Do
              </button>
              <button
                onClick={goTo("/contact")}
                onMouseEnter={isMobile ? undefined : (e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#0E45B5"; b.style.borderColor = "#0E45B5"; }}
                onMouseLeave={isMobile ? undefined : (e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#1254D9"; b.style.borderColor = "#1254D9"; }}
                onTouchStart={() => setPressedContact(true)}
                onTouchEnd={() => setPressedContact(false)}
                onTouchCancel={() => setPressedContact(false)}
                style={{ background: "#1254D9", color: "#fff", border: "1.5px solid #1254D9", padding: "16px 24px", fontSize: 13, fontWeight: 600, letterSpacing: ".8px", textTransform: "uppercase", cursor: "pointer", transition: "background-color .2s ease, border-color .2s ease, transform 0.1s ease, opacity 0.1s ease", fontFamily: "var(--font-inter)", borderRadius: 0, width: isMobile ? "100%" : undefined, transform: isMobile && pressedContact ? "scale(0.96)" : "scale(1)", opacity: isMobile && pressedContact ? 0.75 : 1 }}
              >
                Get In Touch
              </button>
            </div>
          </ScrollFadeUp>
        </div>
      </div>
    </section>
  );
}
