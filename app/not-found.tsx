import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      style={{
        paddingTop: "98px",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "98px 24px 80px",
        background: "#FFFFFF",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-anton)",
          fontWeight: 400,
          textTransform: "uppercase",
          fontSize: "clamp(64px, 12vw, 140px)",
          lineHeight: 1,
          color: "#111111",
        }}
      >
        404
      </div>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          fontSize: 16,
          color: "#4A4A4A",
          marginTop: 20,
          maxWidth: 420,
        }}
      >
        This page doesn&apos;t exist. It may have moved, or the address was
        mistyped.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 600,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#FFFFFF",
          background: "#111111",
          padding: "16px 32px",
          marginTop: 36,
          display: "inline-block",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
