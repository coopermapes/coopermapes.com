"use client";

import { useEffect, useRef, useState } from "react";

export const CONTACT_EMAIL = "contact@coopermapes.com";
export const CONTACT_PHONE_DISPLAY = "662-985-9780";
export const CONTACT_PHONE_TEL = "6629859780";

/**
 * Contact link with a clipboard fallback.
 *
 * For `openOnClick` links (email), the `mailto:` href still fires for
 * visitors with a mail client registered, and the value is also copied to
 * the clipboard as a fallback. For non-`openOnClick` links (phone), the
 * `tel:` navigation is skipped entirely — on desktop there's essentially
 * never a registered phone-dialer handler, so letting it fire just pops an
 * OS "how do you want to open this?" dialog. That dialog steals window
 * focus, and the Clipboard API silently refuses to write to the clipboard
 * once focus is lost — so letting the browser navigate was breaking the
 * copy outright. Copying always happens first, before any navigation is
 * attempted, so the copy is guaranteed to succeed either way.
 */
function CopyableLink({
  href,
  copyValue,
  ariaLabel,
  announcement,
  openOnClick = false,
  align = "center",
  color,
  hoverColor,
  style,
  children,
}: {
  href: string;
  copyValue: string;
  ariaLabel: string;
  announcement: string;
  openOnClick?: boolean;
  align?: "left" | "center";
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Always stop the browser's own navigation — see the comment above for why.
    e.preventDefault();

    navigator.clipboard?.writeText(copyValue).then(() => {
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});

    // The copy call above has already fired (and the page still has focus
    // at this point), so it's now safe to trigger navigation ourselves.
    if (openOnClick) window.location.href = href;
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={ariaLabel}
      style={{
        position: "relative",
        display: "inline-block",
        color: hov && hoverColor ? hoverColor : color,
        textDecoration: "none",
        transition: "color .2s ease",
        ...style,
      }}
    >
      {/* Kept in the layout (not display:none) so the link's width never
          shrinks to "Copied!" and shifts neighboring flex items. */}
      <span style={{ visibility: copied ? "hidden" : "visible" }}>{children}</span>
      {copied && (
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: align === "left" ? "flex-start" : "center" }}>
          Copied!
        </span>
      )}
      <span role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
        {copied ? announcement : ""}
      </span>
    </a>
  );
}

export default function EmailLink({
  color,
  hoverColor,
  align,
  style,
  children,
}: {
  color: string;
  hoverColor?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <CopyableLink
      href={`mailto:${CONTACT_EMAIL}`}
      copyValue={CONTACT_EMAIL}
      ariaLabel={`Email ${CONTACT_EMAIL}`}
      announcement="Email address copied to clipboard"
      openOnClick
      align={align}
      color={color}
      hoverColor={hoverColor}
      style={style}
    >
      {children}
    </CopyableLink>
  );
}

export function PhoneLink({
  color,
  hoverColor,
  align,
  style,
  children,
}: {
  color: string;
  hoverColor?: string;
  align?: "left" | "center";
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <CopyableLink
      href={`tel:${CONTACT_PHONE_TEL}`}
      copyValue={CONTACT_PHONE_DISPLAY}
      ariaLabel={`Call ${CONTACT_PHONE_DISPLAY}`}
      announcement="Phone number copied to clipboard"
      align={align}
      color={color}
      hoverColor={hoverColor}
      style={style}
    >
      {children}
    </CopyableLink>
  );
}
