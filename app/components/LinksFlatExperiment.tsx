"use client";

// EXPERIMENT ONLY — not wired into the real /links route. Renders the flat
// Canva export as a full-screen background image, scaled to fill any
// viewport, with no real link elements. Purpose: let Cooper see how the
// single-flat-image approach looks before deciding whether to pursue it —
// see conversation 2026-08-23 for why this isn't the recommended approach
// for the shipped page (no real click targets, misaligns across device
// aspect ratios, no accessible text).
export default function LinksFlatExperiment() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        backgroundColor: "#0A0A0A",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Native 1080x1920 export, capped so it never grows wider than its
          own real size — black shows on either side once the viewport is
          wider than the image, instead of stretching/cropping to fill it. */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          aspectRatio: "1080 / 1920",
          backgroundImage: "url(/link-flat-experiment.png)",
          backgroundSize: "contain",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
