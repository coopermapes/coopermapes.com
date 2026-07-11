"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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

// Matches HomeSection's solid primary CTA exactly (size, hover, touch-press).
function ProjectButton({ href, label }: { href: string; label: string }) {
  const isMobile = useIsMobile();
  const [pressed, setPressed] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={isMobile ? undefined : (e) => { const b = e.currentTarget as HTMLAnchorElement; b.style.background = "#0E45B5"; b.style.borderColor = "#0E45B5"; }}
      onMouseLeave={isMobile ? undefined : (e) => { const b = e.currentTarget as HTMLAnchorElement; b.style.background = "#1254D9"; b.style.borderColor = "#1254D9"; }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      style={{
        background: "#1254D9",
        color: "#fff",
        border: "1.5px solid #1254D9",
        padding: "16px 24px",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: ".8px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background-color .2s ease, border-color .2s ease, transform 0.1s ease, opacity 0.1s ease",
        fontFamily: "var(--font-inter)",
        borderRadius: 0,
        display: "inline-block",
        textDecoration: "none",
        transform: isMobile && pressed ? "scale(0.96)" : "scale(1)",
        opacity: isMobile && pressed ? 0.75 : 1,
      }}
    >
      {label}
      <span style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}>
        {" "}(opens in new tab)
      </span>
    </a>
  );
}

function TagPill({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      background: "#EAEAEA",
      color: "#4A4A4A",
      fontFamily: "var(--font-inter)",
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: ".2px",
      padding: "4px 12px",
      borderRadius: 999,
    }}>
      {label}
    </span>
  );
}

// Short solid dash + long faint line, echoing a divider rule before the CTA.
function DividerRule() {
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: 28 }}>
      <div style={{ width: 24, height: 2, background: "#111111", flexShrink: 0 }} />
      <div style={{ flex: 1, height: 1, background: "#00000014", marginLeft: 8 }} />
    </div>
  );
}

function ProjectMedia({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", background: "#FFFFFF", border: "1px solid #DCDBD7", overflow: "hidden" }}>
      {children}
    </div>
  );
}

// Renders at the image's own native aspect ratio (width/height passed in) —
// no fixed box, no object-fit: cover, so nothing is ever cropped.
function ZoomImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={isMobile ? undefined : () => setHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setHovered(false)}
      style={{ overflow: "hidden" }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(.22, .61, .36, 1)",
        }}
      />
    </div>
  );
}

function VideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

type Project = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  buttonLabel: string;
  buttonHref: string;
  media: React.ReactNode;
};

export default function ProjectsSection() {
  const isMobile = useIsMobile();

  const projects: Project[] = [
    {
      number: "01",
      title: "Diatonic Tuning Tool",
      description:
        "An interactive tuning cheat sheet I built to show the just-intonation cent adjustments for every diatonic chord tone in all 24 major and minor keys. Directors and players alike can look up exactly how sharp or flat a given chord tone should be tuned relative to equal temperament, rather than guessing by ear alone.",
      tags: ["Web Tool", "Intonation", "HTML/JS"],
      buttonLabel: "Try The Tool",
      buttonHref: "/tuning-tool.html",
      media: (
        <ZoomImage
          src="/tuning-tool-screenshot.png"
          alt="Diatonic Tuning Tool interface showing just-intonation cent deviations for chord tones in the key of A#/Bb Major"
          width={2590}
          height={1872}
        />
      ),
    },
    {
      number: "02",
      title: "DCI Transcription & Analysis",
      description:
        "A series of YouTube videos where I break down brass writing from some of my favorite DCI productions. Every score is transcribed by hand, analyzed with music theory, and annotated to bring the intent of each piece to the surface.",
      tags: ["YouTube", "Music Theory", "Analysis"],
      buttonLabel: "See All My Videos",
      buttonHref: "https://www.youtube.com/@coopermapes",
      media: (
        <VideoEmbed
          src="https://www.youtube.com/embed/GOI8BsAJWhE"
          title="DCI Transcription & Analysis"
        />
      ),
    },
    {
      number: "03",
      title: "DCI Historical Scores Graph",
      description:
        "An interactive chart plotting five decades of DCI Finals scores for seven of the activity's top corps. Overlay two corps head-to-head, flip between score and placement, measure the gap to each year's champion, or open the correlation matrix to see which corps' scores trend together.",
      tags: ["Data Viz", "Statistics", "Web Tool"],
      buttonLabel: "Check The Scores",
      buttonHref: "/dci-historical-performance.html",
      media: (
        <ZoomImage
          src="/dci-chart-screenshot.png"
          alt="DCI Historical Scores Graph showing Blue Devils Finals scores from 1973 to 2025 with medal stars and a Carolina Crown head-to-head overlay"
          width={2590}
          height={1872}
        />
      ),
    },
    {
      number: "04",
      title: "Theoretically 01",
      description:
        "An ear-training game I built to stay on top of chord recognition, styled after late-'90s music software with a vintage '01 tag (my birth year). Three modes: chord trainer, note guesser, and rhythm identifier. It's like Wordle and music theory spontaneously combined.",
      tags: ["Ear Training", "Daily Puzzle", "Web Game"],
      buttonLabel: "Visit Theoretically 01",
      buttonHref: "https://theoretically.io/",
      media: (
        <ZoomImage
          src="/theoretically-screenshot.png"
          alt="Theoretically 01 chord trainer styled as a retro desktop application, showing a solved daily chord puzzle"
          width={2590}
          height={1872}
        />
      ),
    },
  ];

  return (
    <section id="projects" style={{ background: "#ffffff", paddingTop: "98px" }}>

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
            Projects
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#5A5A5A", margin: "20px 0 0", maxWidth: 620, textAlign: "left" }}>
            All my passion projects in one place.
          </p>
        </ScrollFadeUp>
      </div>

      {/* ── Project rows ── */}
      {projects.map((project, i) => (
        <div key={project.number} style={{ background: "#FFFFFF" }}>
          <div style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: isMobile ? "0 clamp(20px,5vw,40px)" : "0 clamp(24px,5vw,64px)",
          }}>
            <div style={{ borderTop: "1px solid #E2E1DC" }} />
          </div>
          <div style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: isMobile
              ? "clamp(32px,8vw,56px) clamp(20px,5vw,40px)"
              : "clamp(48px,5.5vw,96px) clamp(24px,5vw,64px)",
            display: "flex",
            flexDirection: isMobile ? "column" : (i % 2 === 1 ? "row-reverse" : "row"),
            flexWrap: "wrap",
            gap: isMobile ? "clamp(24px,6vw,40px)" : "clamp(40px,5vw,72px)",
          }}>
            <div style={{ flex: isMobile ? "0 0 auto" : "1.15 1 460px", width: isMobile ? "100%" : undefined }}>
              <ScrollFadeUp>
                <ProjectMedia>
                  {project.media}
                </ProjectMedia>
              </ScrollFadeUp>
            </div>
            <div style={{ flex: isMobile ? "0 0 auto" : "1 1 380px", width: isMobile ? "100%" : undefined }}>
              <ScrollFadeUp delay={150}>
                <div aria-hidden="true" style={{
                  fontFamily: "var(--font-anton)",
                  fontSize: 15,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}>
                  <span style={{ color: "#B6B5AD" }}>/ </span>
                  <span style={{ color: "#111111" }}>{project.number}</span>
                </div>
                <h2 style={{
                  fontFamily: "var(--font-anton)",
                  fontWeight: 400,
                  fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)",
                  lineHeight: 1.02,
                  letterSpacing: "-.5px",
                  textTransform: "uppercase",
                  margin: 0,
                }}>
                  {project.title}
                </h2>
                <p style={{ fontSize: 16, lineHeight: 1.65, color: "#4A4A4A", margin: "20px 0 0", maxWidth: 430, textAlign: "left" }}>
                  {project.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                  {project.tags.map((tag) => <TagPill key={tag} label={tag} />)}
                </div>
                <DividerRule />
                <div style={{ marginTop: 16 }}>
                  <ProjectButton href={project.buttonHref} label={project.buttonLabel} />
                </div>
              </ScrollFadeUp>
            </div>
          </div>
        </div>
      ))}

    </section>
  );
}
