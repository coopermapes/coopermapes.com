"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useIsMobile } from "../hooks/useIsMobile";
import { Button } from "./ui/button";

const LINKS = [
  { label: "Home",      href: "/" },
  { label: "Services",  href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

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
            onClick={() => setMenuOpen(false)}
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
              top: "-0.9em",
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
            transition: "opacity 0.32s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <ul style={{ listStyle: "none", textAlign: "center", display: "flex", flexDirection: "column", gap: 4 }}>
            {LINKS.map(({ label, href }, i) => {
              const isActive = pathname === href;
              return (
                <li key={href} style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                  transition: menuOpen
                    ? `opacity 0.32s ease ${i * 48 + 80}ms, transform 0.32s cubic-bezier(.4,0,.2,1) ${i * 48 + 80}ms`
                    : "none",
                }}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
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
