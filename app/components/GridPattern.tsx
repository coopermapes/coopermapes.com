"use client";

import { useEffect, useId, useRef, useState, useCallback } from "react";

function AnimatedBlock({
  x, y, blockKey, onComplete, d,
}: {
  x: number; y: number; blockKey: number;
  onComplete: (key: number) => void; d: string;
}) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    const fadeIn  = setTimeout(() => setOpacity(1), 10);
    const fadeOut = setTimeout(() => setOpacity(0), 900);
    const remove  = setTimeout(() => onComplete(blockKey), 2200);
    return () => { clearTimeout(fadeIn); clearTimeout(fadeOut); clearTimeout(remove); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <path
      transform={`translate(${-32 * y + 96 * x} ${160 * y})`}
      d={d}
      fill="rgba(0,0,0,0.025)"
      style={{ opacity, transition: "opacity 0.7s ease" }}
    />
  );
}

const BLOCK_PATH =
  "M45.119 4.5a11.5 11.5 0 0 0-11.277 9.245l-25.6 128C6.82 148.861 12.262 155.5 19.52 155.5h63.366a11.5 11.5 0 0 0 11.277-9.245l25.6-128c1.423-7.116-4.02-13.755-11.277-13.755H45.119Z";

const PATTERN_PATH =
  "M128 0 98.572 147.138A16 16 0 0 1 82.883 160H13.117a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-45.117 320H-116M64-160 34.572-12.862A16 16 0 0 1 18.883 0h-69.766a16 16 0 0 0-15.69 12.862l-26.855 134.276A16 16 0 0 1-109.117 160H-180M192 160l-29.428 147.138A15.999 15.999 0 0 1 146.883 320H77.117a16 16 0 0 0-15.69 12.862L34.573 467.138A16 16 0 0 1 18.883 480H-52M-136 480h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1-18.883 320h69.766a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 109.117 160H192M-72 640h58.883a16 16 0 0 0 15.69-12.862l26.855-134.276A16 16 0 0 1 45.117 480h69.766a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A15.999 15.999 0 0 1 173.117 320H256M-200 320h58.883a15.999 15.999 0 0 0 15.689-12.862l26.856-134.276A16 16 0 0 1-82.883 160h69.766a16 16 0 0 0 15.69-12.862L29.427 12.862A16 16 0 0 1 45.117 0H128";

const STATIC_BLOCKS: [number, number][] = [
  // left side
  [-7,2],[-6,0],[-5,4],[-4,1],[-3,3],[-2,5],[-1,0],
  // center
  [0,2],[1,4],
  // right side
  [2,1],[3,5],[4,3],[5,0],[6,2],[7,5],[8,1],
];

type Block = [number, number, number];

export default function GridPattern({ yOffset = 0, interactive = true }: { yOffset?: number; interactive?: boolean }) {
  const rawId = useId();
  const id = "gp-" + rawId.replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const currentBlock = useRef<[number, number] | null>(null);
  const counter = useRef(0);
  const [hoveredBlocks, setHoveredBlocks] = useState<Block[]>([]);

  const removeBlock = useCallback((key: number) => {
    setHoveredBlocks((blocks) => blocks.filter((b) => b[2] !== key));
  }, []);

  useEffect(() => {
    if (!interactive) return;
    function onMouseMove(e: MouseEvent) {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      x = x - rect.width / 2 - 32;
      y = y - yOffset;
      x += Math.tan(32 / 160) * y;
      x = Math.floor(x / 96);
      y = Math.floor(y / 160);
      if (currentBlock.current && currentBlock.current[0] === x && currentBlock.current[1] === y) return;
      currentBlock.current = [x, y];
      setHoveredBlocks((blocks) => {
        const key = counter.current++;
        return [...blocks.filter((b) => !(b[0] === x && b[1] === y)), [x, y, key]];
      });
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [yOffset, interactive]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    >
      <rect width="100%" height="100%" fill={`url(#${id})`} strokeWidth="0" />
      <svg x="50%" y={yOffset} strokeWidth="0" style={{ overflow: "visible" }}>
        {STATIC_BLOCKS.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            transform={`translate(${-32 * y + 96 * x} ${160 * y})`}
            d={BLOCK_PATH}
            fill="rgba(0,0,0,0.025)"
          />
        ))}
        {hoveredBlocks.map(([x, y, key]) => (
          <AnimatedBlock key={key} x={x} y={y} blockKey={key} onComplete={removeBlock} d={BLOCK_PATH} />
        ))}
      </svg>
      <defs>
        <pattern
          id={id}
          width="96"
          height="480"
          x="50%"
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(0 ${yOffset})`}
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
