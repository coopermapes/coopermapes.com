"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import type WaveSurfer from "wavesurfer.js";

function ScrollFadeUp({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect(); } },
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

function CaptionAnimate({ initialDelay, children }: { initialDelay: number; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setVisible(true); return; }
    const t = setTimeout(() => setVisible(true), initialDelay);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(.22,.61,.36,1)",
    }}>
      {children}
    </div>
  );
}

// ── Works data ────────────────────────────────────────────────────────────────
const WORKS = [
  { slot: "pf-spire",     index: "(01)", title: "Coming Soon",       meta: "Olive Branch HS · 2026",                                badges: [], image: "/portfolio/images/pf-spire.jpeg",     audio: "/portfolio/audio/eternal-spire.mp3",    locked: true, posY: 50 },
  { slot: "pf-escher",    index: "(02)", title: "Escher Sketch",     meta: "Olive Branch HS · 2025",                                badges: [{ src: "/boa-regional-2025.png", alt: "BOA Regional 2025" }, { src: "/mhsaa-state-2025.png", alt: "MHSAA State 2025" }], image: "/portfolio/images/pf-escher.jpeg",    audio: "/portfolio/audio/escher-sketch.mp3",    posY: 2  },
  { slot: "pf-calmstorm", index: "(03)", title: "In Calm and Storm", meta: "For Drum Corps · Mvmt. I & III sampled",                badges: [], image: "/portfolio/images/pf-calmstorm.jpeg", audio: "/portfolio/audio/in-calm-and-storm.mp3", posY: 50 },
  { slot: "pf-ramayana",  index: "(04)", title: "Ramayana",          meta: "For Drum Corps · Mvmt. I sampled · Perc. Simon Edwards", badges: [], image: "/portfolio/images/pf-ramayana.jpeg",  audio: "/portfolio/audio/ramayana.mp3",          posY: 16 },
  { slot: "pf-ignite",    index: "(05)", title: "Ignite",            meta: "For Indoor Winds · Mvmt. I sampled",                   badges: [], image: "/portfolio/images/pf-ignite.jpeg",    audio: "/portfolio/audio/ignite-mvmt-i.mp3",    posY: 50 },
  { slot: "pf-grace",     index: "(06)", title: "Amazing Grace",     meta: "For Brass Ensemble · Hernando HS · 2024",              badges: [], image: "/portfolio/images/pf-grace.jpeg",     audio: "/portfolio/audio/amazing-grace.mp3",    posY: 50 },
  { slot: "pf-gospel",    index: "(07)", title: "Gospel",            meta: "Flow Chorale · Olive Branch HS · 2025",                badges: [], image: "/portfolio/images/pf-gospel.jpeg",    audio: "/portfolio/audio/gospel.mp3",            posY: 50 },
  { slot: "pf-horkstow",  index: "(08)", title: "Horkstow Grange",   meta: "Flow Chorale · Olive Branch HS · 2026",                badges: [], image: "/portfolio/images/pf-horkstow.jpeg",  audio: "/portfolio/audio/horkstow-grange.mp3",  posY: 50 },
  { slot: "pf-jurassic",  index: "(09)", title: "Jurassic Park",     meta: "Flow Chorale",                                         badges: [], image: "/portfolio/images/pf-jurassic.jpeg",  audio: "/portfolio/audio/jurassic-park.mp3",    posY: 48 },
  { slot: "pf-joy",       index: "(10)", title: "Joy to the World",  meta: "Parade Tune",                                          badges: [], image: "/portfolio/images/pf-joy.jpeg",       audio: "/portfolio/audio/joy-to-the-world.mp3", posY: 78 },
];
const N = WORKS.length;

// ── Image slot ────────────────────────────────────────────────────────────────
function PortfolioImageSlot({ image, title, locked, objectPositionY = 50, height = 380 }: { image: string; title: string; locked?: boolean; objectPositionY?: number; height?: number | string }) {
  return (
    <div style={{ position: "relative", width: "100%", height, background: "#141413", overflow: "hidden" }}>
      {locked ? (
        <div
          role="img"
          aria-label={title}
          style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: `50% ${objectPositionY}%`,
            filter: "blur(18px) brightness(0.5)",
            transform: "scale(1.08)",
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${objectPositionY}%` }}
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PortfolioSection() {
  const [pfIndex,  setPfIndex]  = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [wsReady,  setWsReady]  = useState(false);
  const [elapsed,  setElapsed]  = useState(0);
  const [playPressed, setPlayPressed] = useState(false);

  const waveRef    = useRef<HTMLDivElement>(null);
  const wsRef      = useRef<WaveSurfer | null>(null);
  const fadeRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMobile = useIsMobile();

  function stopFade() { if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null; } }

  function fadeOut(cb?: () => void) {
    const ws = wsRef.current;
    if (!ws || !ws.isPlaying()) { cb?.(); return; }
    stopFade();
    fadeRef.current = setInterval(() => {
      const v = ws.getVolume();
      if (v > 0.05) { ws.setVolume(Math.max(0, v - 0.05)); }
      else { ws.setVolume(0); ws.pause(); stopFade(); cb?.(); }
    }, 37);
  }

  function fadeIn() {
    const ws = wsRef.current;
    if (!ws) return;
    ws.setVolume(0);
    ws.play().catch(() => {});
    stopFade();
    fadeRef.current = setInterval(() => {
      const v = ws.getVolume();
      if (v < 0.95) { ws.setVolume(Math.min(1, v + 0.05)); }
      else { ws.setVolume(1); stopFade(); }
    }, 37);
  }

  // ── WaveSurfer init ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!waveRef.current) return;
    let destroyed = false;
    (async () => {
      const { default: WaveSurfer } = await import("wavesurfer.js");
      if (destroyed || !waveRef.current) return;
      const ws = WaveSurfer.create({
        container: waveRef.current,
        waveColor: "rgba(255,255,255,0.22)",
        progressColor: "#5B7BD6",
        cursorWidth: 0,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 52,
        normalize: true,
        interact: true,
      });
      wsRef.current = ws;
      ws.on("ready",       () => { if (!destroyed) setWsReady(true); });
      ws.on("finish",      () => { if (!destroyed) { setPlaying(false); setElapsed(0); } });
      ws.on("timeupdate",  (t: number) => { if (!destroyed) setElapsed(t); });
      if (!WORKS[0].locked) ws.load(WORKS[0].audio).catch((e: Error) => { if (e?.name !== "AbortError") console.error(e); });
    })();
    return () => { destroyed = true; stopFade(); wsRef.current?.destroy(); wsRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load new track when carousel changes
  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;
    fadeOut(() => {
      setPlaying(false);
      setWsReady(false);
      setElapsed(0);
      if (!WORKS[pfIndex].locked) ws.load(WORKS[pfIndex].audio).catch((e: Error) => { if (e?.name !== "AbortError") console.error(e); });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfIndex]);

  function handlePlayPause() {
    if (!wsReady) return;
    if (playing) { fadeOut(() => setPlaying(false)); }
    else { fadeIn(); setPlaying(true); }
  }

  // ── Carousel navigation ───────────────────────────────────────────────────
  const navigate = (dir: 1 | -1) => {
    fadeOut(() => { setPlaying(false); });
    setPfIndex(i => (i + dir + N) % N);
  };

  const work    = WORKS[pfIndex];
  const counter = `${String(pfIndex + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;

  return (
    <section id="portfolio" style={{ background: "#020201", paddingTop: "98px" }}>
      <div style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: isMobile
          ? "clamp(32px,8vw,56px) clamp(16px,4vw,32px) clamp(32px,6vw,56px)"
          : "clamp(48px,6vw,96px) clamp(24px,5vw,64px) clamp(48px,5vw,64px)",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 18, borderBottom: "1px solid #242422", paddingBottom: 22 }}>
          <ScrollFadeUp delay={150}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <h1 style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(34px,5vw,72px)", lineHeight: .9, letterSpacing: "-2px", textTransform: "uppercase", color: "#FFFFFF", margin: 0 }}>
                Selected Works
              </h1>
              <span style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 500, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9A9A95" }}>(Portfolio)</span>
            </div>
          </ScrollFadeUp>
          <ScrollFadeUp delay={150}>
            <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, fontWeight: 500, letterSpacing: "1.6px", textTransform: "uppercase", color: "#9A9A95" }}>{counter}</span>
          </ScrollFadeUp>
        </div>

        {/* ── Caption + audio ── */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, marginTop: 28, minHeight: 96 }}>
          <div style={{ flex: "1 1 360px" }}>
            <CaptionAnimate initialDelay={500}>
              <div style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(22px,2.6vw,34px)", color: "#1254D9", letterSpacing: "-1px" }}>{work.index}</div>
            </CaptionAnimate>
            <CaptionAnimate initialDelay={650}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, height: "clamp(28px,4vw,56px)" }}>
                <div style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(28px,4vw,56px)", textTransform: "uppercase", color: "#FFFFFF", letterSpacing: "-1px", lineHeight: 1, flexShrink: 0 }}>{work.title}</div>
                {work.badges.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    {work.badges.map((b, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={b.src} src={b.src} alt={b.alt} style={{ height: 90, width: "auto", display: "block", marginLeft: i > 0 ? -18 : 0 }} />
                    ))}
                  </div>
                )}
              </div>
            </CaptionAnimate>
            <CaptionAnimate initialDelay={800}>
              <div style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, letterSpacing: "1.2px", textTransform: "uppercase", color: "#9A9A95", marginTop: 12 }}>{work.meta}</div>
            </CaptionAnimate>
          </div>

          {/* Audio player */}
          <div style={{
            flex: isMobile ? "0 0 100%" : "0 0 auto",
            minWidth: isMobile ? 0 : 280,
          }}>
          <CaptionAnimate initialDelay={1050}>
            <div style={{
              width: "100%",
              background: "#0E0E0D",
              border: "1px solid #242422",
              padding: "14px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
              {/* Top row: circle button + track info + timestamp */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {work.locked ? (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="0"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                ) : (
                  <button
                    onClick={handlePlayPause}
                    aria-label={playing ? "Pause" : "Play"}
                    onTouchStart={() => setPlayPressed(true)}
                    onTouchEnd={() => setPlayPressed(false)}
                    onTouchCancel={() => setPlayPressed(false)}
                    style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${wsReady ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}`, background: "transparent", cursor: wsReady ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color .3s ease, transform 0.1s ease, opacity 0.1s ease", transform: isMobile && playPressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && playPressed ? 0.75 : 1 }}
                  >
                    {playing
                      ? <svg width="13" height="13" viewBox="0 0 24 24" fill={wsReady ? "#fff" : "#555"}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill={wsReady ? "#fff" : "#555"} style={{ marginLeft: 2 }}><polygon points="5,3 19,12 5,21"/></svg>}
                  </button>
                )}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 12, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: work.locked ? "#444" : wsReady ? "#FFFFFF" : "#444", transition: "color .3s ease", lineHeight: 1.2 }}>
                      {work.locked ? "Audio Unavailable" : work.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, color: work.locked ? "#333" : wsReady ? "rgba(255,255,255,0.45)" : "#333", transition: "color .3s ease", marginTop: 3, lineHeight: 1.2 }}>
                      {work.locked ? "Coming Soon" : wsReady ? "Cooper Mapes" : "Loading…"}
                    </div>
                  </div>
                  {!work.locked && (
                    <div style={{ fontFamily: "var(--font-inter)", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: ".5px", flexShrink: 0 }}>
                      {Math.floor(elapsed / 60)}:{String(Math.floor(elapsed % 60)).padStart(2, "0")}
                    </div>
                  )}
                </div>
              </div>
              {/* Waveform — always in DOM so WaveSurfer keeps its container */}
              <div ref={waveRef} style={{ width: "100%", opacity: work.locked ? 0.06 : wsReady ? 1 : 0.15, transition: "opacity .4s ease" }} />
            </div>
          </CaptionAnimate>
          </div>
        </div>

        {/* ── Carousel ── */}
        <ScrollFadeUp delay={0}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              width: "100%",
              height: isMobile ? "clamp(510px,135vw,540px)" : "clamp(520px,46vw,660px)",
              marginTop: 8,
            }}
          >
            {WORKS.map((w, i) => {
              const rawOffset = ((i - pfIndex) % N + N) % N;
              const d = rawOffset <= N / 2 ? rawOffset : rawOffset - N;
              const isCenter = d === 0;
              const visible  = Math.abs(d) <= 3;
              const cardW    = 320;
              const step     = cardW + 28;
              const absD     = Math.abs(d);
              const opacity  = isCenter ? 1 : absD === 1 ? 0.45 : absD === 2 ? 0.2 : 0;
              const blur     = isCenter ? 0 : absD === 1 ? 0.5 : absD === 2 ? 3 : 7;

              return (
                <div
                  key={w.slot}
                  role={!isCenter && visible ? "button" : undefined}
                  tabIndex={!isCenter && visible ? 0 : undefined}
                  aria-label={!isCenter && visible ? `Navigate to ${w.title}` : undefined}
                  onClick={() => { if (!isCenter) setPfIndex(i); }}
                  onKeyDown={!isCenter && visible ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPfIndex(i); } } : undefined}
                  style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: cardW,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: isCenter ? 3 : visible ? 2 : 1,
                    pointerEvents: visible ? "auto" : "none",
                    cursor: isCenter ? "default" : "pointer",
                    transform: `translateX(calc(-50% + ${d * step}px)) translateY(-50%)`,
                    transition: "transform .55s cubic-bezier(.22,.61,.36,1), opacity .55s ease, filter .55s ease",
                  }}
                >
                  <div style={{
                    transform: isCenter ? "scale(1.06)" : "scale(0.82)",
                    transformOrigin: "center center",
                    transition: "transform .55s cubic-bezier(.22,.61,.36,1)",
                    border: "1px solid #242422",
                    background: "#0A0A09",
                  }}>
                    <PortfolioImageSlot image={w.image} title={w.title} locked={w.locked} objectPositionY={w.posY} />

                    <div style={{
                      overflow: "hidden",
                      maxHeight: isCenter ? 120 : 0,
                      opacity: isCenter ? 1 : 0,
                      transition: "max-height .55s cubic-bezier(.22,.61,.36,1), opacity .45s ease",
                      borderTop: isCenter ? "1px solid #242422" : "none",
                    }}>
                      <div style={{ padding: "14px 18px 18px", textAlign: "center" }}>
                        <div style={{
                          fontFamily: "var(--font-anton)", fontWeight: 400,
                          fontSize: "clamp(22px,3vw,38px)", textTransform: "uppercase",
                          color: "#FFFFFF", letterSpacing: "-1px", lineHeight: 1,
                          transform: isCenter ? "translateY(0)" : "translateY(20px)",
                          transition: "transform .55s cubic-bezier(.22,.61,.36,1)",
                        }}>
                          {w.title}
                        </div>
                        <div style={{
                          fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500,
                          letterSpacing: "1.2px", textTransform: "uppercase", color: "#9A9A95", marginTop: 5,
                        }}>
                          {w.meta}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <ArrowBtn direction="left"  onClick={() => navigate(-1)} isMobile={isMobile} />
            <ArrowBtn direction="right" onClick={() => navigate(1)} isMobile={isMobile} />
          </div>
        </ScrollFadeUp>

      </div>
    </section>
  );
}

function ArrowBtn({ direction, onClick, isMobile }: { direction: "left" | "right"; onClick: () => void; isMobile: boolean }) {
  const [hov, setHov] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous work" : "Next work"}
      onPointerDown={e => e.stopPropagation()}
      onMouseEnter={isMobile ? undefined : () => setHov(true)}
      onMouseLeave={isMobile ? undefined : () => setHov(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        position: "absolute", top: "50%",
        transform: `translateY(-50%) ${isMobile && pressed ? "scale(0.96)" : "scale(1)"}`,
        [direction === "left" ? "left" : "right"]: 12,
        width: 48, height: 48, zIndex: 10,
        border: `1px solid ${hov && !isMobile ? "#4A4A4A" : "#2E2E2C"}`,
        background: hov && !isMobile ? "rgba(22,22,21,.95)" : "rgba(2,2,1,.72)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background .2s, border-color .2s, opacity 0.1s ease",
        opacity: isMobile && pressed ? 0.75 : 1,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </button>
  );
}
