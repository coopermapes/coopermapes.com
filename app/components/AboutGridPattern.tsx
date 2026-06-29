"use client";

import { useId } from "react";

const BLOCK_PATH =
  "M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z";

const PATTERN_PATH =
  "M128 0 98.572 147.138A16 16 0 0 1 82.883 160H13.117a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-45.117 320H-116M64-160 34.572-12.862A16 16 0 0 1 18.883 0h-69.766a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-109.117 160H-180M192 160l-29.428 147.138A15.999 15.999 0 0 1 146.883 320H77.117a16 16 0 0 0-15.69 12.862L34.573 467.138A16 16 0 0 1 18.883 480H-52M-136 480h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1-18.883 320h69.766a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 109.117 160H192M-72 640h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 45.117 480h69.766a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A15.999 15.999 0 0 1 173.117 320H256M-200 320h58.883a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A16 16 0 0 1-82.883 160h69.766a16 16 0 0 0 15.69-12.862L29.427 12.862A16 16 0 0 1 45.117 0H128";

const STATIC_BLOCKS: [number, number][] = [
  [-5,0],[-2,0],[2,0],[6,0],
  [-4,1],[-1,1],[3,1],[7,1],
  [-6,2],[-3,2],[1,2],[5,2],
  [-5,3],[0,3],[4,3],[8,3],
  [-2,4],[3,4],[7,4],
];

export default function AboutGridPattern() {
  const rawId = useId();
  const id = "agp-" + rawId.replace(/:/g, "");

  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,1) 65%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,1) 65%)",
      }}
    >
      <rect width="100%" height="100%" fill={`url(#${id})`} strokeWidth="0" />
      <svg x="50%" y={0} strokeWidth="0" style={{ overflow: "visible" }}>
        {STATIC_BLOCKS.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            transform={`translate(${-32 * y + 96 * x} ${160 * y})`}
            d={BLOCK_PATH}
            fill="rgba(0,0,0,0.025)"
          />
        ))}
      </svg>
      <defs>
        <pattern
          id={id}
          width="96"
          height="480"
          x="50%"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(0 0)"
          fill="none"
          stroke="rgba(0,0,0,0.04)"
          strokeWidth="1"
        >
          <path d={PATTERN_PATH} />
        </pattern>
      </defs>
    </svg>
  );
}
