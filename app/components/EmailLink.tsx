"use client";

import { useEffect, useRef, useState } from "react";

export const CONTACT_EMAIL = "contact@coopermapes.com";

/**
 * Email link with a clipboard fallback.
 *
 * The `mailto:` href still works for visitors who have a mail client
 * registered. For everyone else (a click that would otherwise do nothing),
 * the address is copied to the clipboard and a brief "Copied!" confirmation
 * is shown. The click is never prevented, so both behaviors can happen.
 */
export default function EmailLink({
  color,
  hoverColor,
  style,
  children,
}: {
  color: string;
  hoverColor?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [hov, setHov] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear a pending "Copied!" reset if the component unmounts mid-timeout
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const handleClick = () => {
    // Best-effort copy; if it fails, the mailto still proceeds.
    navigator.clipboard?.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  };

  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      onClick={handleClick}
      onMouseEnter={hoverColor ? () => setHov(true) : undefined}
      onMouseLeave={hoverColor ? () => setHov(false) : undefined}
      aria-label={`Email ${CONTACT_EMAIL}`}
      style={{
        color: hov && hoverColor ? hoverColor : color,
        textDecoration: "none",
        transition: "color .2s ease",
        ...style,
      }}
    >
      {copied ? "Copied!" : children}
      <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </a>
  );
}
