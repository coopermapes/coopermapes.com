"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const SOCIAL = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/coopermapes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.5"/>
      </svg>
    ),
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/ctmapes/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/coopermapes/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@coopermapes/videos?sub_confirmation=1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#020201"/>
      </svg>
    ),
  },
];

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ color: hov ? "#5B7BD6" : "#FFFFFF", transition: "color .2s ease", display: "flex", alignItems: "center" }}
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  const [emailHov, setEmailHov] = useState(false);
  const isMobile = useIsMobile();
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLSpanElement>(null);
  const [copyrightFontSize, setCopyrightFontSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isMobile) return;
    const fit = () => {
      const row = bottomRowRef.current;
      const el = copyrightRef.current;
      if (!row || !el) return;
      const w = row.offsetWidth;
      el.style.whiteSpace = "nowrap";
      let lo = 6, hi = 40;
      while (hi - lo > 0.25) {
        const mid = (lo + hi) / 2;
        el.style.fontSize = mid + "px";
        if (el.scrollWidth <= w) lo = mid; else hi = mid;
      }
      setCopyrightFontSize(lo + "px");
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (bottomRowRef.current) ro.observe(bottomRowRef.current);
    return () => ro.disconnect();
  }, [isMobile]);

  return (
    <footer style={{
      background: "#020201",
      color: "#FFFFFF",
      padding: isMobile
        ? "clamp(32px,8vw,56px) clamp(20px,5vw,40px) 24px"
        : "clamp(40px,5vw,64px) clamp(24px,5vw,64px) 32px",
      marginTop: -2,
    }}>
      {/* Wordmark */}
      <Link
        href="/"
        style={{ textDecoration: "none", display: isMobile ? "block" : "inline-block" }}
      >
        <div style={{
          fontFamily: "var(--font-anton)",
          fontWeight: 400,
          fontSize: isMobile ? "clamp(52px,13vw,128px)" : "clamp(44px,9vw,128px)",
          lineHeight: 0.85,
          letterSpacing: isMobile ? "0px" : "-3px",
          textTransform: "uppercase",
          color: "#FFFFFF",
          whiteSpace: isMobile ? "normal" : "nowrap",
        }}>
          Cooper Mapes
          <span style={{
            fontFamily: "var(--font-inter)",
            fontSize: ".16em",
            fontWeight: 500,
            top: "-4.5em",
            position: "relative",
            letterSpacing: 0,
          }}>
            ©2026
          </span>
        </div>
      </Link>

      {/* Bottom row */}
      <div ref={bottomRowRef} style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 18,
        marginTop: isMobile ? "clamp(16px,4vw,24px)" : "clamp(36px,5vw,56px)",
        borderTop: "1px solid #242422",
        paddingTop: 24,
      }}>
        <span ref={copyrightRef} style={{
          fontFamily: "var(--font-inter)",
          fontSize: isMobile ? (copyrightFontSize ?? 10) : 12,
          fontWeight: 500,
          letterSpacing: isMobile ? "0.5px" : "1.2px",
          textTransform: "uppercase",
          color: "#A0A09B",
          whiteSpace: isMobile ? "nowrap" : undefined,
          width: isMobile ? "100%" : undefined,
        }}>
          © Cooper Mapes 2026{" "}
          <span style={{ color: "#3A3A3A" }}>|</span>
          {" "}Arranger · Composer · Educator
        </span>

        <div style={{ display: "flex", gap: isMobile ? 0 : 18, alignItems: "center", width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "space-between" : undefined }}>
          {SOCIAL.map(s => (
            <SocialLink key={s.key} href={s.href} label={s.label} icon={s.icon} />
          ))}
          <span style={{ color: "#3A3A3A" }}>|</span>
          <a
            href="mailto:contact@coopermapes.com"
            onMouseEnter={() => setEmailHov(true)}
            onMouseLeave={() => setEmailHov(false)}
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              fontWeight: 500,
              color: emailHov ? "#FFFFFF" : "#A0A09B",
              textDecoration: "none",
              transition: "color .2s ease",
            }}
          >
            contact@coopermapes.com
          </a>
        </div>
      </div>
    </footer>
  );
}
