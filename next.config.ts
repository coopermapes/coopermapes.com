import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only serves the qualities listed here (default [75]); anything else is coerced.
    // 60 is used for the portfolio carousel covers (small cards, photo-heavy artwork).
    qualities: [60, 75],
  },
};

export default nextConfig;
