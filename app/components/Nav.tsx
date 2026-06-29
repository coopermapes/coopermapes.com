"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { label: "Home",      href: "/" },
  { label: "Services",  href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On inner pages the nav is always solid; only transparent at home-page top
  const isHome = pathname === "/";
  const solid = !isHome || scrolled;

  return (
    <nav
      style={{ height: "98px", zIndex: 60 }}
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
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(30px,3vw,38px)",
            letterSpacing: "-0.5px",
            color: "#111111",
            textDecoration: "none",
          }}
          className="uppercase"
        >
          Cooper Mapes<span style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, position: "relative", top: "-1.8em", marginLeft: 3, letterSpacing: 0 }}>©</span>
        </Link>

        {/* Links */}
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
      </div>
    </nav>
  );
}
