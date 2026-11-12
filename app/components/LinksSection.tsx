"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Final values from Cooper (2026-08-23): blue is the site's existing accent
// blue (VISUAL_STANDARDS.md — CTAs/links).
const COLORS = {
  black: "#0A0A0A",
  blue: "#1254D9",
};

// Single source of truth for the profile circle's diameter — the overlap
// (negative margin) is derived from this with calc() rather than a second
// hand-typed clamp, so the ring's vertical center always lands exactly on
// the header divider line. A drift between the two here is what caused the
// visible seam/notch where the line met the ring (see conversation
// 2026-08-23) — the negative margin was a few px short of true half-diameter.
const PROFILE_SIZE = "clamp(140px, 36vw, 190px)";

// Buttons are exact PNG exports from Cooper's Canva design (753x209,
// transparent background) rather than coded pill+icon+text — see
// conversation 2026-08-23. Each still renders inside a real, correctly
// sized <a>/<Link> so click targets scale normally; aria-label covers the
// text that's now baked into the image instead of real DOM text.
const LINKS = [
  { key: "website", label: "Website", href: "/", internal: true, image: "/link-btn-website.png" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@coopermapes", internal: false, image: "/link-btn-youtube.png" },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/coopermapesmusic/", internal: false, image: "/link-btn-instagram.png" },
  { key: "contact", label: "Contact Me", href: "/contact", internal: true, image: "/link-btn-contact.png" },
];

const BUTTON_IMAGE_WIDTH = 753;
const BUTTON_IMAGE_HEIGHT = 209;

function LinkButton({ href, internal, image, label }: { href: string; internal: boolean; image: string; label: string }) {
  const [hover, setHover] = useState(false);

  const style: React.CSSProperties = {
    display: "block",
    width: "100%",
    filter: hover ? "brightness(1.08)" : "brightness(1)",
    transform: hover ? "translateY(-2px)" : "translateY(0)",
    transition: "transform .15s ease, filter .15s ease",
  };

  const img = (
    <Image
      src={image}
      alt=""
      width={BUTTON_IMAGE_WIDTH}
      height={BUTTON_IMAGE_HEIGHT}
      style={{ width: "100%", height: "auto", display: "block" }}
    />
  );

  if (internal) {
    return (
      <Link
        href={href}
        aria-label={label}
        style={style}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {img}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {img}
    </a>
  );
}

export default function LinksSection() {
  // Force the html/body background to match this page's black while mounted
  // — otherwise iOS overscroll bounce briefly reveals the site-wide white
  // background this page deliberately isn't using. Reverted on unmount so
  // the rest of the site is unaffected.
  useEffect(() => {
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    const prevBodyBg = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = COLORS.black;
    document.body.style.backgroundColor = COLORS.black;
    return () => {
      document.documentElement.style.backgroundColor = prevHtmlBg;
      document.body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: COLORS.black,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Card width matches the source design's 1080-wide canvas proportion.
          Widened from 480 to 640 (2026-08-23) so the page reads larger on
          desktop, now that the texture crop below is correctly proportioned
          — black still fills the sides beyond this on wide viewports. Height
          is intrinsic to content, not forced to the full 1920 canvas height
          — a fixed aspect-ratio here left dead empty space below the buttons
          the reference mockup never has, since the mockup's card height is
          content-driven too. */}
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          position: "relative",
          backgroundColor: COLORS.black,
        }}
      >
        {/* Header photo */}
        <div style={{ position: "relative", width: "100%", aspectRatio: "2.05 / 1", overflow: "hidden" }}>
          <Image src="/links-header.jpg" alt="" fill priority style={{ objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: COLORS.blue }} />
        </div>

        {/* Everything below the header — texture only covers this block, not
            the header photo above, since in the source design the texture is
            never visible there (the photo/profile are opaque). The texture
            source was re-cropped to this block's true design aspect ratio
            (1080 x 1428.4, measured directly off the header's bottom edge in
            the master 1080-wide canvas) instead of the original 600x1200
            export's mismatched 1:2 aspect, which is what caused the earlier
            over-aggressive crop/stretch from `cover`. */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url(/links-bg-texture-cropped.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
              opacity: 0.5,
            }}
          />

          {/* Profile photo, overlapping the header/body boundary */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              marginTop: `calc(-0.5 * ${PROFILE_SIZE})`,
            }}
          >
            <div
              style={{
                width: PROFILE_SIZE,
                height: PROFILE_SIZE,
                borderRadius: "50%",
                border: `4px solid ${COLORS.blue}`,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
              }}
            >
              <Image src="/links-profile.jpg" alt="Cooper Mapes" fill style={{ objectFit: "cover" }} />
            </div>
          </div>

        {/* Name, subtitle, buttons */}
        <div style={{ position: "relative", padding: "20px 28px 56px", textAlign: "center" }}>
          {/* Real, visually-hidden heading — the name/subtitle above are now
              a flattened PNG export (Cooper's exact Canva text treatment),
              so this is what screen readers and search engines see instead
              of raster pixels. */}
          <h1
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0,0,0,0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            Cooper Mapes — Arranger | Composer | Educator
          </h1>
          {/* Width is the header text PNG's own tight-crop width relative to
              the 1080px source canvas (864/1080 = 80%) — same native-ratio
              approach as the button sizing above. */}
          <Image
            src="/link-header-text.png"
            alt=""
            width={864}
            height={300}
            style={{ width: "80%", height: "auto", margin: "8px auto 24px", display: "block" }}
            priority
          />

          {/* Width is the button PNGs' exact native proportion within the
              1080px-wide source canvas (753/1080 = 69.7%) — not an eyeballed
              value. Filling the full section width stretched buttons larger
              than their real design size, which also inflated their height
              since the PNG aspect ratio is fixed. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "69.7%", margin: "0 auto" }}>
            {LINKS.map((l) => (
              <LinkButton key={l.key} href={l.href} internal={l.internal} image={l.image} label={l.label} />
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
