"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useIsMobile } from "../hooks/useIsMobile";
import { CoverflowCarousel } from "./CoverflowCarousel";
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
  { slot: "pf-spire",     title: "Eternal Spire",     type: "Marching Band",  year: "2026", length: "7:03", image: "/portfolio/images/pf-spire.jpeg",     audio: "/portfolio/audio/eternal-spire.mp3",    posY: 50 },
  { slot: "pf-escher",    title: "Escher Sketch",     type: "Marching Band",  year: "2025", length: "6:21", image: "/portfolio/images/pf-escher.jpeg",    audio: "/portfolio/audio/escher-sketch.mp3",    posY: 2  },
  { slot: "pf-calmstorm", title: "In Calm and Storm", type: "Drum Corps",     year: "2026", length: "3:33", image: "/portfolio/images/pf-calmstorm.jpeg", audio: "/portfolio/audio/in-calm-and-storm.mp3", posY: 50 },
  { slot: "pf-ramayana",  title: "Ramayana",          type: "Drum Corps",     year: "2025", length: "2:00", image: "/portfolio/images/pf-ramayana.jpeg",  audio: "/portfolio/audio/ramayana.mp3",          posY: 16 },
  { slot: "pf-ignite",    title: "Ignite",            type: "Indoor Winds",   year: "2024", length: "0:56", image: "/portfolio/images/pf-ignite.jpeg",    audio: "/portfolio/audio/ignite-mvmt-i.mp3",    posY: 50 },
  { slot: "pf-grace",     title: "Amazing Grace",     type: "Brass Ensemble", year: "2024", length: "1:51", image: "/portfolio/images/pf-grace.jpeg",     audio: "/portfolio/audio/amazing-grace.mp3",    posY: 50 },
  { slot: "pf-gospel",    title: "Gospel",            type: "Flow Chorale",   year: "2025", length: "0:44", image: "/portfolio/images/pf-gospel.jpeg",    audio: "/portfolio/audio/gospel.mp3",            posY: 50 },
  { slot: "pf-horkstow",  title: "Horkstow Grange",   type: "Flow Chorale",   year: "2026", length: "0:37", image: "/portfolio/images/pf-horkstow.jpeg",  audio: "/portfolio/audio/horkstow-grange.mp3",  posY: 50 },
  { slot: "pf-jurassic",  title: "Jurassic Park",     type: "Flow Chorale",   year: "2026", length: "1:20", image: "/portfolio/images/pf-jurassic.jpeg",  audio: "/portfolio/audio/jurassic-park.mp3",    posY: 48 },
  { slot: "pf-joy",       title: "Joy to the World",  type: "Parade Tune",    year: "2024", length: "0:57", image: "/portfolio/images/pf-joy.jpeg",       audio: "/portfolio/audio/joy-to-the-world.mp3", posY: 78 },
];

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
        waveColor: "#CFCEC9",
        progressColor: "#0B3A9A",
        cursorWidth: 0,
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 52,
        normalize: true,
        interact: true,
      });
      wsRef.current = ws;
      ws.on("ready",       () => { if (!destroyed) { setWsReady(true); ws.setTime(0); } });
      ws.on("finish",      () => { if (!destroyed) { setPlaying(false); setElapsed(0); } });
      ws.on("timeupdate",  (t: number) => { if (!destroyed) setElapsed(t); });
      ws.load(WORKS[0].audio).catch((e: Error) => { if (e?.name !== "AbortError") console.error(e); });
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
      ws.load(WORKS[pfIndex].audio).catch((e: Error) => { if (e?.name !== "AbortError") console.error(e); });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pfIndex]);

  function handlePlayPause() {
    if (!wsReady) return;
    if (playing) { fadeOut(() => setPlaying(false)); }
    else { fadeIn(); setPlaying(true); }
  }

  const work = WORKS[pfIndex];

  const slides = WORKS.map(w => ({
    src: w.image,
    alt: w.title,
    title: w.title,
    meta: [
      { label: "Type",   value: w.type },
      { label: "Year",   value: w.year },
      { label: "Length", value: w.length },
    ],
    objectPositionY: w.posY,
  }));

  return (
    <section id="portfolio" style={{ background: "#ffffff", paddingTop: "98px" }}>
      <div style={{
        maxWidth: 1320,
        margin: "0 auto",
        padding: isMobile
          ? "clamp(32px,8vw,56px) clamp(16px,4vw,32px) clamp(32px,6vw,56px)"
          : "clamp(48px,6vw,96px) clamp(24px,5vw,64px) clamp(48px,5vw,64px)",
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #DCDBD7", paddingBottom: 22 }}>
          <ScrollFadeUp delay={150}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(44px,6.5vw,80px)", lineHeight: .92, letterSpacing: "0", textTransform: "uppercase", color: "#111111", margin: 0, textAlign: "center" }}>
              {/* Wordmark image, sized in em off the h1's own font-size so its cap height
                  matches the other page titles (same method as the Projects logo): caps are
                  607/635 of the image height → 0.8139em tall, and the 0.0207em top offset
                  seats its baseline where the text glyphs would sit in a 0.92 line box.
                  On phones the full one-line width (10.35em) is wider than the screen, so
                  width is capped to the available space and the height follows. */}
              <Image
                src="/selected-works-logo.png"
                alt="Selected Works"
                width={8072}
                height={635}
                priority
                sizes="(max-width: 768px) 100vw, 830px"
                style={{
                  display: "block",
                  width: "min(10.347em, calc(100vw - 2 * clamp(16px, 4vw, 32px)))",
                  height: "auto",
                  margin: "0.0207em 0 0.0854em",
                }}
              />
            </h1>
          </ScrollFadeUp>
        </div>

        {/* ── Carousel ── */}
        <ScrollFadeUp delay={0}>
          <div style={{ marginTop: 28 }}>
            <CoverflowCarousel
              slides={slides}
              onSelectedChange={setPfIndex}
            />
          </div>
        </ScrollFadeUp>

        {/* ── Audio player ── */}
        <CaptionAnimate initialDelay={400}>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
            <div style={{
              width: "100%",
              maxWidth: 420,
              background: "transparent",
              padding: "14px 16px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}>
              {/* Top row: circle button + track info + timestamp */}
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  onClick={handlePlayPause}
                  aria-label={playing ? "Pause" : "Play"}
                  onTouchStart={() => setPlayPressed(true)}
                  onTouchEnd={() => setPlayPressed(false)}
                  onTouchCancel={() => setPlayPressed(false)}
                  style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${wsReady ? "#111111" : "rgba(0,0,0,0.2)"}`, background: "transparent", cursor: wsReady ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color .3s ease, transform 0.1s ease, opacity 0.1s ease", transform: isMobile && playPressed ? "scale(0.96)" : "scale(1)", opacity: isMobile && playPressed ? 0.75 : 1 }}
                >
                  {playing
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill={wsReady ? "#111111" : "#B6B5AD"}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill={wsReady ? "#111111" : "#B6B5AD"} style={{ marginLeft: 2 }}><polygon points="5,3 19,12 5,21"/></svg>}
                </button>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600, letterSpacing: ".5px", textTransform: "uppercase", color: wsReady ? "#111111" : "#9A9A95", transition: "color .3s ease", lineHeight: 1.2 }}>
                      {work.title}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, color: "#5A5A5A", transition: "color .3s ease", marginTop: 3, lineHeight: 1.2 }}>
                      {wsReady ? "Cooper Mapes" : "Loading…"}
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500, color: "#5A5A5A", letterSpacing: ".5px", flexShrink: 0 }}>
                    {Math.floor(elapsed / 60)}:{String(Math.floor(elapsed % 60)).padStart(2, "0")} / {work.length}
                  </div>
                </div>
              </div>
              {/* Waveform — always in DOM so WaveSurfer keeps its container */}
              <div ref={waveRef} style={{ width: "100%", opacity: wsReady ? 1 : 0.15, transition: "opacity .4s ease" }} />
            </div>
          </div>
        </CaptionAnimate>

      </div>
    </section>
  );
}
