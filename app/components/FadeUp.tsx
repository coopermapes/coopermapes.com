"use client";

import { useEffect, useRef, useState } from "react";

// The one fade-up used for every reveal on the site (hero stagger, page titles,
// scroll reveals, the portfolio player). Replaces five hand-copied versions that
// had drifted apart (0.5s vs 0.6s, different observer thresholds, different timing
// on desktop vs mobile).
//
//   • 24px rise + opacity, 0.6s ease.
//   • Triggers when the element scrolls into view (so hero items, which are already
//     in view, start immediately), then waits `delay` ms.
//   • Waits for the images inside it to be loaded AND decoded before it starts
//     fading. Without this the fade runs over empty space and the image pops in
//     part-way through it. Capped at IMAGE_WAIT_CAP_MS so a slow or broken image
//     can never hide content. Add `data-fade-skip` to an <img> to not wait for it
//     (used for off-screen carousel covers).
//   • prefers-reduced-motion: shows immediately, no motion (see the data-fade rule in globals.css).
export const FADE_DURATION_MS = 600;
const FADE_DISTANCE_PX = 24;
const IMAGE_WAIT_CAP_MS = 1200;

function imagesReady(root: HTMLElement): Promise<void> {
  const waits = Array.from(root.querySelectorAll("img"))
    .filter((img) => !img.hasAttribute("data-fade-skip"))
    .map((img) => {
      const loaded =
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            });
      // decode() so the first painted frame isn't blocked on image decoding mid-fade
      return loaded.then(() => img.decode().catch(() => {}));
    });
  if (waits.length === 0) return Promise.resolve();
  return Promise.race([
    Promise.all(waits).then(() => {}),
    new Promise<void>((resolve) => setTimeout(resolve, IMAGE_WAIT_CAP_MS)),
  ]);
}

export function FadeUp({
  delay = 0,
  children,
  style,
}: {
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (reduced) { setVisible(true); return; }
        // Image loading runs alongside the stagger delay, so the fade starts at
        // max(delay, time-to-images-ready) rather than delay + image time.
        Promise.all([
          new Promise<void>((resolve) => setTimeout(resolve, delay)),
          imagesReady(el),
        ]).then(() => { if (!cancelled) setVisible(true); });
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      data-fade
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${FADE_DISTANCE_PX}px)`,
        transition: `opacity ${FADE_DURATION_MS}ms ease, transform ${FADE_DURATION_MS}ms ease`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
