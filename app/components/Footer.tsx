"use client";

import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import Image from "next/image";
import EmailLink from "./EmailLink";

const SOCIAL = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/coopermapesmusic/",
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
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FFFFFF"/>
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
      style={{ color: hov ? "#1254D9" : "#111111", transition: "color .2s ease", display: "flex", alignItems: "center" }}
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  const isMobile = useIsMobile();
  const bottomRowRef = useRef<HTMLDivElement>(null);
  // Desktop only: true when the row is wide enough to seat the logo between the
  // copyright text (left) and social/email (right) without crowding them.
  const [wide, setWide] = useState(false);

  useEffect(() => {
    if (isMobile) return;
    const row = bottomRowRef.current;
    if (!row) return;
    const measure = () => setWide(row.offsetWidth >= 1100);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [isMobile]);
  const inline = !isMobile && wide;
  const logo = (
    <Image
      src="/keynote-publishing.png"
      alt="Keynote Music Publishing"
      width={3862}
      height={918}
      sizes="234px"
      style={{ width: isMobile ? 180 : 234, height: "auto", display: "block" }}
    />
  );

  return (
    <footer style={{
      backgroundColor: "#EAEAEA",
      color: "#111111",
      padding: isMobile
        ? "clamp(32px,8vw,56px) clamp(20px,5vw,40px) 24px"
        : "clamp(40px,5vw,64px) clamp(24px,5vw,64px) 32px",
      marginTop: -2,
    }}>
      {/* Keynote Music Publishing logo — stacked above the row unless it fits inline */}
      {!inline && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: isMobile ? 32 : 40 }}>
          {logo}
        </div>
      )}

      {/* Bottom row */}
      <div ref={bottomRowRef} style={inline ? {
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 18,
        borderTop: "1px solid #DCDBD7",
        paddingTop: 24,
      } : {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 18,
        borderTop: "1px solid #DCDBD7",
        paddingTop: 24,
      }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? 6 : 14 }}>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: isMobile ? "0.5px" : "1.2px", lineHeight: 1.5,
            textTransform: "uppercase",
            color: "#3A3A3A",
            width: isMobile ? "100%" : undefined,
          }}>
            © Cooper Mapes 2026{" "}
            <span style={{ color: "#B6B5AD" }}>|</span>
            {" "}Arranger · Composer · Educator
          </span>
        </div>

        {inline && logo}

        <div style={{ display: "flex", gap: isMobile ? 0 : 18, alignItems: "center", width: isMobile ? "100%" : undefined, justifyContent: isMobile ? "space-between" : undefined, justifySelf: inline ? "end" : undefined }}>
          {SOCIAL.map(s => (
            <SocialLink key={s.key} href={s.href} label={s.label} icon={s.icon} />
          ))}
          <span style={{ color: "#B6B5AD" }}>|</span>
          <EmailLink
            color="#3A3A3A"
            hoverColor="#111111"
            style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 500 }}
          >
            contact@coopermapes.com
          </EmailLink>
        </div>

      </div>
    </footer>
  );
}
