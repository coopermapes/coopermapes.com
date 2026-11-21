"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ChatCircle, Repeat, PaperPlaneTilt } from "@phosphor-icons/react";
import { useIsMobile } from "../hooks/useIsMobile";
import { FadeUp } from "./FadeUp";
import PageGridPattern from "./PageGridPattern";
import type { Reel } from "../lib/instagram";

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
        fontSize: isMobile ? 18 : 16,
        fontWeight: 600,
        letterSpacing: ".8px",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background-color .2s ease, border-color .2s ease, transform 0.1s ease, opacity 0.1s ease",
        fontFamily: "var(--font-body)",
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
      fontFamily: "var(--font-body)",
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: ".2px",
      padding: "3px 12px 5px", // text sits 1px higher: measured on screen, equal padding put the text ~0.8px low (ink gap above 10.8px vs below 9.2px)
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

// lift (image projects, desktop only): on hover the frame rises 4px with a soft shadow and a slightly
// darker border, the same effect as the Portfolio title-page cards. Videos don't lift.
function ProjectMedia({ children, lift }: { children: React.ReactNode; lift?: boolean }) {
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState(false);
  const lifted = !!lift && !isMobile && hovered;
  return (
    <div
      onMouseEnter={lift && !isMobile ? () => setHovered(true) : undefined}
      onMouseLeave={lift && !isMobile ? () => setHovered(false) : undefined}
      style={{
        width: "100%", background: "#FFFFFF", border: `1px solid ${lifted ? "#BDBCB6" : "#DCDBD7"}`, overflow: "hidden",
        transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        transform: lifted ? "translateY(-4px)" : "none",
        boxShadow: lifted ? "0 10px 24px rgba(0,0,0,0.10)" : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      {children}
    </div>
  );
}

// Renders at the image's own native aspect ratio (width/height passed in) —
// no fixed box, no object-fit: cover, so nothing is ever cropped.
function ProjectImage({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, 600px"
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );
}

// One reel card: 9:16 thumbnail in the same thin frame, lifts on hover (desktop), opens the reel on Instagram.
function ReelCard({ reel, isMobile }: { reel: Reel; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const lifted = !isMobile && hovered;
  return (
    <a
      href={reel.permalink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={reel.caption ? `Watch on Instagram: ${reel.caption.slice(0, 80)}` : "Watch this reel on Instagram"}
      onMouseEnter={isMobile ? undefined : () => setHovered(true)}
      onMouseLeave={isMobile ? undefined : () => setHovered(false)}
      style={{ display: "block", color: "inherit", textDecoration: "none", minWidth: 0 }}
    >
      <div style={{
        position: "relative", aspectRatio: "9 / 16", overflow: "hidden", background: "#FFFFFF",
        border: `1px solid ${lifted ? "#BDBCB6" : "#DCDBD7"}`, boxSizing: "border-box",
        transition: "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
        transform: lifted ? "translateY(-4px)" : "none",
        boxShadow: lifted ? "0 10px 24px rgba(0,0,0,0.10)" : "0 0 0 rgba(0,0,0,0)",
      }}>
        <Image src={reel.thumbnail} alt="" fill sizes="(max-width: 768px) 45vw, 260px" style={{ objectFit: "cover" }} />
        {/* Desktop hover: post info over the thumbnail, like an Instagram post (handle, caption,
            likes, comments, date). Hidden on phones, where there is no hover; a tap opens the reel. */}
        {!isMobile && (
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12,
            padding: 16, background: "rgba(10,10,10,0.72)", color: "#FFFFFF",
            opacity: lifted ? 1 : 0, transition: "opacity .25s ease", pointerEvents: "none",
          }}>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600 }}>coopermapesmusic</div>
            {/* Caption sits centered in the space between the handle and the hashtags. */}
            <div style={{ flex: "1 1 0", minHeight: 0, display: "flex", alignItems: "center" }}>
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.45, color: "rgba(255,255,255,0.92)", textAlign: "left",
                whiteSpace: "pre-line", display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {reel.caption}
              </div>
            </div>
            {reel.hashtags && (
              <div style={{
                fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.45, color: "rgba(255,255,255,0.7)",
                display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere",
              }}>
                {reel.hashtags}
              </div>
            )}
            <div style={{ fontFamily: "var(--font-body)", fontSize: 16 }}>
              {/* Order: likes, comments, reposts, sends. Wraps to a second line when a card is too narrow. */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", columnGap: 14, rowGap: 6 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Heart size={20} weight="fill" aria-hidden /> {reel.likes.toLocaleString("en-US")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <ChatCircle size={20} weight="fill" aria-hidden /> {reel.comments.toLocaleString("en-US")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Repeat size={20} weight="bold" aria-hidden /> {reel.reposts.toLocaleString("en-US")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <PaperPlaneTilt size={20} weight="fill" aria-hidden /> {reel.sends.toLocaleString("en-US")}
                </span>
              </div>
              {reel.timestamp && (
                <div style={{ marginTop: 8, color: "rgba(255,255,255,0.7)" }}>
                  {new Date(reel.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </a>
  );
}

function ReelsGrid({ reels }: { reels: Reel[] }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${reels.length}, minmax(0, 1fr))`, gap: isMobile ? 12 : 24, maxWidth: isMobile ? undefined : 540, margin: "0 auto" }}>
      {reels.map((r) => <ReelCard key={r.id} reel={r} isMobile={isMobile} />)}
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
  lift?: boolean; // image projects: frame lifts on hover (desktop)
  bare?: boolean; // render media without the shared bordered frame (the reels cards frame themselves)
};

// Grey tiles for this page's background grid (column, row). Each page has its own layout.
const PROJECTS_TILES: [number, number][] = [
  [-7,0],[-4,0],[0,0],[7,0],[-5,2],[-2,3],[-1,1],[2,2],[5,1],[6,3],
  [-6,4],[1,4],[8,4],[-3,5],[3,5],[-7,6],[-1,7],[4,7],[7,8],[-4,9],[2,10],[-6,11],[5,12],
];

export default function ProjectsSection({ reels = [] }: { reels?: Reel[] }) {
  const isMobile = useIsMobile();

  const projects: Project[] = [
    {
      number: "01",
      title: "Drum Corps Transcription & Analysis",
      description:
        "A series of YouTube videos where I break down brass writing from some of my favorite drum corps productions. Every score is transcribed by hand, analyzed with music theory, and annotated to bring the intent of each piece to the surface.",
      tags: ["YouTube", "Music Theory", "Analysis"],
      buttonLabel: "See All My Videos",
      buttonHref: "https://www.youtube.com/@coopermapes",
      media: (
        <VideoEmbed
          src="https://www.youtube.com/embed/6_1Da4P4kVY"
          title="Drum Corps Transcription & Analysis"
        />
      ),
    },
    {
      number: "02",
      lift: true,
      title: "Diatonic Tuning Tool",
      description:
        "An interactive tuning cheat sheet I built to show the just-intonation cent adjustments for every diatonic chord tone in all 24 major and minor keys. Directors and players alike can look up exactly how sharp or flat a given chord tone should be tuned relative to equal temperament, rather than guessing by ear alone.",
      tags: ["Web Tool", "Intonation", "HTML/JS"],
      buttonLabel: "Try The Tool",
      buttonHref: "/tuning-tool.html",
      media: (
        <ProjectImage
          src="/tuning-tool-screenshot.png"
          alt="Diatonic Tuning Tool interface showing just-intonation cent deviations for chord tones in the key of A#/Bb Major"
          width={2590}
          height={1872}
        />
      ),
    },
    {
      number: "03",
      lift: true,
      title: "Drum Corps Historical Scores Graph",
      description:
        "An interactive chart plotting five decades of drum corps Finals scores for seven of the activity's top corps. Overlay two corps head-to-head, flip between score and placement, measure the gap to each year's champion, or open the correlation matrix to see which corps' scores trend together.",
      tags: ["Data Viz", "Statistics", "Web Tool"],
      buttonLabel: "Check The Scores",
      buttonHref: "/dci-historical-performance.html",
      media: (
        <ProjectImage
          src="/dci-chart-screenshot.png"
          alt="Drum Corps Historical Scores Graph showing Blue Devils Finals scores from 1973 to 2025 with medal stars and a Carolina Crown head-to-head overlay"
          width={2590}
          height={1872}
        />
      ),
    },
    {
      number: "04",
      lift: true,
      title: "Theoretically 01",
      description:
        "An ear-training game I built to stay on top of chord recognition, styled after late-'90s music software with a vintage '01 tag (my birth year). Three modes: chord trainer, note guesser, and rhythm identifier.",
      tags: ["Ear Training", "Daily Puzzle", "Web Game"],
      buttonLabel: "Visit Theoretically 01",
      buttonHref: "https://theoretically.io/",
      media: (
        <ProjectImage
          src="/theoretically-screenshot.png"
          alt="Theoretically 01 chord trainer styled as a retro desktop application, showing a solved daily chord puzzle"
          width={2590}
          height={1872}
        />
      ),
    },
  ];

  // Newest rows first: the live Instagram reels row sits above the built projects. It is omitted
  // when there are no reels (missing/expired token), and the rows below keep alternating sides.
  const reelsProject: Project | null = reels.length
    ? {
        number: "00",
        title: "Social Media",
        description: "I post music content on my Instagram: @coopermapesmusic. I cover various topics such as the marching arts, music theory, and composition. If you would like to check out my posts and follow me, click the link below.",
        tags: ["Marching Arts", "Music Theory", "Composition"],
        buttonLabel: "Follow My Instagram",
        buttonHref: "https://www.instagram.com/coopermapesmusic/",
        media: <ReelsGrid reels={reels} />,
        bare: true,
      }
    : null;
  const allProjects: Project[] = reelsProject ? [reelsProject, ...projects] : projects;

  return (
    <section id="projects" style={{ background: "#ffffff", paddingTop: "98px", position: "relative", overflow: "hidden" }}>
      {!isMobile && <PageGridPattern blocks={PROJECTS_TILES} />}

      {/* ── Section header ── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1180,
        margin: "0 auto",
        padding: isMobile
          ? "clamp(40px,9vw,64px) clamp(20px,5vw,40px) clamp(20px,5vw,36px)"
          : "clamp(64px,7vw,96px) clamp(24px,5vw,64px) clamp(24px,3vw,48px)",
      }}>
        <FadeUp>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: isMobile ? "clamp(40px,10vw,60px)" : "clamp(44px,6.5vw,80px)",
            lineHeight: ".92",
            letterSpacing: "0",
            textTransform: "uppercase",
            margin: 0,
          }}>
            {/* Wordmark image sized in em off the h1's own font-size so its cap
                height matches the text h1s on the other pages (Alfa Slab One cap
                height = 0.778em; the logo's caps are 606/635 of its height →
                0.8153em tall). The 0.0104em top offset lines its cap line and
                baseline up with where the text glyphs would sit in a 0.92 line box. */}
            <Image
              src="/projects-logo.png"
              alt="Projects"
              width={4582}
              height={635}
              priority
              sizes="480px"
              style={{ display: "block", height: "0.8153em", width: "auto", margin: "0.0104em 0 0.0943em" }}
            />
          </h1>
          <p style={{ fontSize: isMobile ? 20 : 22, lineHeight: 1.65, color: "#5A5A5A", margin: "20px 0 0", maxWidth: 620, textAlign: "left" }}>
            All my passion projects in one place.
          </p>
        </FadeUp>
      </div>

      {/* ── Project rows ── */}
      {/* White panel behind all the project rows so the background grid doesn't run behind the
          text or screenshots. Same width as the rows (1180) so it lines up with their dividers. */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1180, margin: "0 auto", background: "#FFFFFF" }}>
        {allProjects.map((project, i) => (
          <div key={project.number} style={{ position: "relative", zIndex: 1 }}>
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
                <FadeUp>
                  {project.bare ? project.media : (
                    <ProjectMedia lift={project.lift}>
                      {project.media}
                    </ProjectMedia>
                  )}
                </FadeUp>
              </div>
              <div style={{ flex: isMobile ? "0 0 auto" : "1 1 380px", width: isMobile ? "100%" : undefined }}>
                <FadeUp delay={150}>
                  <h2 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: isMobile ? "clamp(26px,7vw,40px)" : "clamp(30px,3.6vw,46px)",
                    lineHeight: 1.02,
                    letterSpacing: "0",
                    textTransform: "uppercase",
                    margin: 0,
                  }}>
                    {project.title}
                  </h2>
                  <p style={{ fontSize: 18, lineHeight: 1.65, color: "#4A4A4A", margin: "20px 0 0", maxWidth: 430, textAlign: "left" }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                    {project.tags.map((tag) => <TagPill key={tag} label={tag} />)}
                  </div>
                  <DividerRule />
                  <div style={{ marginTop: 16 }}>
                    <ProjectButton href={project.buttonHref} label={project.buttonLabel} />
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
