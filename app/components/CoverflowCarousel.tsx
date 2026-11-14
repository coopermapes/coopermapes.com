"use client";

import * as React from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function CaptionFade({ captionKey, children }: { captionKey: number; children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    setVisible(false);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, [captionKey]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(6px)",
      transition: "opacity .3s ease, transform .3s ease",
    }}>
      {children}
    </div>
  );
}

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
  /** Vertical crop anchor, 0-100 (CSS object-position Y). Defaults to 50 (center). */
  objectPositionY?: number;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  /** Fires whenever the centred slide changes (drag, arrow, dot, or keyboard). */
  onSelectedChange?: (index: number) => void;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(220px, 28vw, 340px)",
  gap = 0.08,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Portfolio carousel",
  onSelectedChange,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. Stepping off `pos` instead would
      swallow a keypress that lands mid-flight, before the round-off moves. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);
  const [hoverArrow, setHoverArrow] = React.useState<"left" | "right" | null>(null);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const reportSelected = React.useCallback((index: number) => {
    setSelected(index);
    onSelectedChange?.(index);
  }, [onSelectedChange]);

  // Paint straight to the DOM. Sixty state updates a second would re-render
  // every card for numbers React never needs to see.
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Fold the distance into the shorter way round the ring. This is the
      // whole looping mechanism — no cloned nodes, no shuffling the DOM.
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      // Both the tilt and the recession ease off as cards travel out —
      // doubling the distance adds only about half again as much of each.
      // A linear ramp folds the second card shut; this keeps it readable.
      const ramp = Math.pow(distance, falloff);
      // Capped short of edge-on so a far card never turns its back.
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      // A card is teleported across the ring at exactly half a turn out, so it
      // has to be gone by then or the jump is visible.
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      reportSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        // Exponential ease-out, not a spring. Swap in a spring only
        // if the settle needs overshoot.
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint, reportSelected],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      // Take the shorter way round rather than unwinding the whole ring.
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    // Cards per second, for the throw.
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) reportSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    // Let a flick carry, but never more than two cards.
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // Card width drives pitch, depth and perspective, so it is the only thing
  // worth measuring — and only when the box actually changes.
  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      style={{ width: "100%", ["--cf-card" as string]: cardWidth } as React.CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div style={{ position: "relative" }}>
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          style={{
            cursor: "grab",
            overflow: "hidden",
            // Vertical padding keeps the drop shadows clear of the overflow clip.
            padding: "40px 0",
            outline: "none",
            perspective: `calc(var(--cf-card) * ${perspective})`,
            // Horizontal drag is ours; the page keeps vertical scrolling.
            touchAction: "pan-y",
          }}
        >
          <div
            style={{
              position: "relative",
              userSelect: "none",
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(node) => { cardRefs.current[index] = node; }}
                role={index !== selected ? "button" : "group"}
                tabIndex={-1}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
                onClick={() => { if (index !== selected) goTo(index); }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: "var(--cf-card)",
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  background: "#EAEAEA",
                  boxShadow: "0 24px 48px rgba(0,0,0,.16)",
                  willChange: "transform",
                  cursor: index === selected ? "default" : "pointer",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `50% ${slide.objectPositionY ?? 50}%`, userSelect: "none", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous work"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => nudge(-1)}
              onMouseEnter={() => setHoverArrow("left")}
              onMouseLeave={() => setHoverArrow(null)}
              style={{
                position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)",
                width: 48, height: 48, zIndex: 200,
                border: `1px solid ${hoverArrow === "left" ? "#111111" : "#DCDBD7"}`,
                background: "rgba(255,255,255,.9)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color .2s ease",
              }}
            >
              <CaretLeft size={18} color="#111111" weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Next work"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => nudge(1)}
              onMouseEnter={() => setHoverArrow("right")}
              onMouseLeave={() => setHoverArrow(null)}
              style={{
                position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)",
                width: 48, height: 48, zIndex: 200,
                border: `1px solid ${hoverArrow === "right" ? "#111111" : "#DCDBD7"}`,
                background: "rgba(255,255,255,.9)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                transition: "border-color .2s ease",
              }}
            >
              <CaretRight size={18} color="#111111" weight="bold" />
            </button>
          </>
        )}
      </div>

      {showCaption && active?.title && (
        <CaptionFade captionKey={selected}>
          <div style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 24px",
            textAlign: "center",
          }}>
            <p style={{ fontFamily: "var(--font-anton)", fontWeight: 400, fontSize: "clamp(22px,2.8vw,32px)", textTransform: "uppercase", letterSpacing: "-.5px", color: "#111111", margin: 0 }}>
              {active.title}
            </p>
            {active.subtitle && (
              <p style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, letterSpacing: ".8px", textTransform: "uppercase", color: "#5A5A5A", marginTop: 6 }}>
                {active.subtitle}
              </p>
            )}
            {active.meta && active.meta.length > 0 && (
              <dl style={{ marginTop: 20, width: "100%", maxWidth: 260 }}>
                {active.meta.map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #E4E3DE" }}>
                    <dt style={{ fontFamily: "var(--font-inter)", fontSize: 11, fontWeight: 500, letterSpacing: ".8px", textTransform: "uppercase", color: "#5A5A5A", margin: 0 }}>{row.label}</dt>
                    <dd style={{ fontFamily: "var(--font-inter)", fontSize: 13, fontWeight: 500, color: "#111111", margin: 0 }}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </CaptionFade>
      )}

      {showPagination && (
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to work ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              style={{
                width: 7, height: 7, borderRadius: "50%", border: "none",
                background: "#111111", cursor: "pointer", padding: 0,
                opacity: index === selected ? 1 : 0.25,
                transition: "opacity .2s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
