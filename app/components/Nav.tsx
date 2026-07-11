"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Button } from "./ui/button";

const LINKS = [
  { label: "Home",      href: "/" },
  { label: "Services",  href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Projects",  href: "/projects" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
];

// Matches the overlay's own opacity transition duration below — navigation
// waits for the overlay to fully fade out before the new page mounts, so its
// entrance animations never play underneath the still-closing menu.
const OVERLAY_CLOSE_MS = 75;

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingNavResolveRef = useRef<(() => void) | null>(null);

  // `router.push()` doesn't finish instantly — Next.js keeps the old page's
  // content mounted and visible until the new page is actually ready, so it
  // never has to show a blank screen mid-navigation. That's normally a good
  // thing, but it means the View Transition below can't just call router.push
  // and assume the swap already happened: `pathname` only updates once the
  // new route has actually committed, so that's the real "navigation is done"
  // signal — resolve the pending transition then, not the instant push() is called.
  useEffect(() => {
    if (pendingNavResolveRef.current) {
      pendingNavResolveRef.current();
      pendingNavResolveRef.current = null;
    }
  }, [pathname]);

  // Navigate from the mobile menu to `href`. If the menu isn't open (e.g.
  // tapping the wordmark on a normal page), there's nothing special to do —
  // let the link navigate immediately as usual.
  //
  // Where supported, the close + navigation is wrapped in the browser's
  // native View Transitions API. Without it, closing the menu and swapping
  // in the new page are two unrelated, separately-timed events — a hard cut
  // that reads as a stutter no matter how well the individual timings are
  // tuned. `startViewTransition` has the browser snapshot the screen before
  // and after the update and crossfade between them itself (composited, off
  // the main thread), so the handoff is smooth regardless of exactly how
  // long the route swap takes. Duration/easing are set in globals.css.
  // Falls back to the old fixed-delay approach on browsers without support
  // (e.g. Safari < 18) — see the Next.js view-transitions guide in
  // node_modules/next/dist/docs/01-app/02-guides/view-transitions.md.
  const navigateAfterClose = (e: React.MouseEvent, href: string) => {
    if (!menuOpen) return;
    e.preventDefault();
    if (pathname === href) { setMenuOpen(false); return; }

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(() => {
        setMenuOpen(false);
        router.push(href);
        // Tell the browser to hold off snapshotting "new" until the route
        // has actually swapped in — see the effect above. A timeout backstop
        // guarantees this can never hang if something prevents pathname from
        // ever updating (e.g. navigation gets cancelled).
        return new Promise<void>((resolve) => {
          pendingNavResolveRef.current = resolve;
          setTimeout(resolve, 600);
        });
      });
    } else {
      setMenuOpen(false);
      setTimeout(() => router.push(href), OVERLAY_CLOSE_MS);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Move focus to first overlay link when menu opens
  useEffect(() => {
    if (menuOpen && overlayRef.current) {
      const firstLink = overlayRef.current.querySelector<HTMLAnchorElement>("a");
      firstLink?.focus();
    }
  }, [menuOpen]);

  // Explicitly drop focus when the menu closes. `inert` is supposed to do
  // this automatically, but browser support for auto-blurring an inert
  // subtree is inconsistent — especially mid-transition, while the overlay
  // is still visually fading out. Without this, the just-focused link (Home,
  // since it's always focused first) can keep the browser's focus outline
  // and have it flash back into view later, seemingly at random.
  useEffect(() => {
    if (!menuOpen && overlayRef.current?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement | null)?.blur();
    }
  }, [menuOpen]);

  const isHome = pathname === "/";
  const solid = !isHome || scrolled || menuOpen || isMobile;

  return (
    <>
      <nav
        style={{ height: "98px", zIndex: 100 }}
        className={`fixed top-0 left-0 right-0 flex items-center transition-all duration-300 ${
          solid ? "bg-white/97 border-b border-[#E4E3DE]" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div
          className="flex items-center justify-between w-full"
          style={{ padding: "0 clamp(24px, 5vw, 64px)" }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            onClick={(e) => navigateAfterClose(e, "/")}
            style={{
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(24px,5vw,38px)",
              letterSpacing: "-0.5px",
              color: "#111111",
              textDecoration: "none",
            }}
            className="uppercase"
          >
            Cooper Mapes
            <span style={{
              fontFamily: "var(--font-inter)",
              fontSize: 13,
              fontWeight: 500,
              position: "relative",
              top: isMobile ? "-0.9em" : "-1.6em",
              marginLeft: 3,
              letterSpacing: 0,
            }}>©</span>
          </Link>

          {/* Desktop links */}
          {!isMobile && (
            <ul
              className="flex items-center list-none"
              style={{ gap: "36px" }}
              onMouseLeave={() => setHovered(null)}
            >
              {LINKS.map(({ label, href }) => {
                const isActive = pathname === href;
                const isDimmed = hovered !== null && hovered !== href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onMouseEnter={() => setHovered(href)}
                      aria-current={isActive ? "page" : undefined}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "17px",
                        fontWeight: 500,
                        textDecoration: "none",
                        color: isActive ? "#1254D9" : hovered === href ? "#1254D9" : "#111111",
                        borderBottom: isActive ? "2px solid #1254D9" : "2px solid transparent",
                        paddingBottom: "2px",
                        opacity: isDimmed ? 0.4 : 1,
                        transition: "color 0.2s ease, opacity 0.2s ease",
                        display: "block",
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Mobile hamburger button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              style={{ width: 44, height: 44 }}
            >
              <div style={{ position: "relative", width: 24, height: 24 }}>
                <List size={24} weight="regular" style={{
                  position: "absolute", inset: 0,
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                }} />
                <X size={24} weight="regular" style={{
                  position: "absolute", inset: 0,
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "rotate(0deg)" : "rotate(-45deg)",
                }} />
              </div>
            </Button>
          )}
        </div>
      </nav>

      {/* Full-screen mobile overlay — z-index 99, sits below nav bar (100) */}
      {isMobile && (
        <div
          ref={overlayRef}
          inert={!menuOpen}
          aria-hidden={!menuOpen}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "#111111",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            transition: `opacity ${OVERLAY_CLOSE_MS}ms cubic-bezier(.4,0,.2,1)`,
          }}
        >
          <ul style={{ listStyle: "none", textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
            {LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => navigateAfterClose(e, href)}
                    style={{
                      fontFamily: "var(--font-anton)",
                      fontSize: "clamp(40px,10vw,56px)",
                      fontWeight: 400,
                      textTransform: "uppercase",
                      letterSpacing: "-1px",
                      color: isActive ? "#1254D9" : "#ffffff",
                      textDecoration: "none",
                      display: "block",
                      padding: "10px 32px",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
