import type { MetadataRoute } from "next";

// Policy (Cooper, 2026-07-11): everyone welcome, including AI training
// crawlers — EXCEPT training crawlers may not take the portfolio audio or
// the two self-contained tool apps. AI *search* crawlers (which cite/link
// the site in live answers) get everything.
const TRAINING_BOT_BLOCKLIST = [
  "/portfolio/audio/",
  "/tuning-tool.html",
  "/dci-historical-performance.html",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI search crawlers — full access; these produce cited answers.
      {
        userAgent: ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "DuckAssistBot"],
        allow: "/",
      },
      // AI training crawlers — allowed generally, blocked from audio + tools.
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Google-Extended",
          "CCBot",
          "Applebot-Extended",
          "meta-externalagent",
        ],
        allow: "/",
        disallow: TRAINING_BOT_BLOCKLIST,
      },
      // Everyone else (Googlebot, Bingbot, etc.) — full access.
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://coopermapes.com/sitemap.xml",
  };
}
