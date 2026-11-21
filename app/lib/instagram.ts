// Server-only: fetches Cooper's latest Instagram reels for the Projects page.
// INSTAGRAM_TOKEN and INSTAGRAM_USER_ID live in .env.local (and Netlify's environment settings).
// They are not NEXT_PUBLIC_, so they are never sent to the browser.

export type Reel = {
  id: string;
  permalink: string;
  thumbnail: string;
  caption: string; // text with the trailing hashtag block removed
  hashtags: string; // the trailing hashtag block ("#a #b #c"), "" if none
  likes: number;
  reposts: number;
  sends: number;
  comments: number;
  timestamp: string; // ISO date
};

const CAPTION_LIMIT = 130; // max characters of caption text shown on hover (beyond the first paragraph)
const FIRST_CAP = 150; // the first paragraph alone is trimmed to this

// Splits a caption into a short text and the block of hashtags at the very end. Hashtags in the middle
// of a sentence stay in the text. The overlay shows the top of the text and always reserves room
// for the hashtags below it.
function splitCaption(raw: string): { caption: string; hashtags: string } {
  const text = raw.trim();
  const m = text.match(/(?:^|\s)(?:#[^\s#]+\s*)+$/);
  const body = m && m.index !== undefined ? text.slice(0, m.index).trim() : text;
  // Simplified caption: whole paragraphs, in order, while the total stays within CAPTION_LIMIT
  // characters. The first paragraph always shows (trimmed at a word with "…" past FIRST_CAP).
  // Later paragraphs (credits, calls to action) that would push past the limit are dropped.
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  let first = paragraphs[0] ?? "";
  if (first.length > FIRST_CAP) first = first.slice(0, first.lastIndexOf(" ", FIRST_CAP)).trimEnd() + "…";
  const kept = [first];
  let length = first.length;
  for (const p of paragraphs.slice(1)) {
    if (length + 2 + p.length > CAPTION_LIMIT) break;
    kept.push(p);
    length += 2 + p.length;
  }
  return { caption: kept.join("\n\n"), hashtags: m ? m[0].trim().split(/\s+/).join(" ") : "" };
}

const GRAPH = "https://graph.facebook.com/v21.0";

// Returns up to `count` newest reels, or [] on any problem (missing/expired token, network error,
// Instagram outage). The Projects page hides the section when this is empty, so a dead token
// never breaks the page. The result is cached for an hour (Next's fetch cache).
export async function getLatestReels(count = 2): Promise<Reel[]> {
  const token = process.env.INSTAGRAM_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return [];

  try {
    const url =
      `${GRAPH}/${userId}/media` +
      `?fields=id,media_product_type,thumbnail_url,permalink,caption,like_count,reposts_count,shares_count,comments_count,timestamp` +
      `&limit=12&access_token=${encodeURIComponent(token)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { id: string; media_product_type?: string; thumbnail_url?: string; permalink?: string; caption?: string; like_count?: number; reposts_count?: number; shares_count?: number; comments_count?: number; timestamp?: string }[];
    };
    return (json.data ?? [])
      .filter((m) => m.media_product_type === "REELS" && m.thumbnail_url && m.permalink)
      .slice(0, count)
      .map((m) => ({
        id: m.id,
        permalink: m.permalink as string,
        thumbnail: m.thumbnail_url as string,
        ...splitCaption(m.caption ?? ""),
        likes: m.like_count ?? 0,
        reposts: m.reposts_count ?? 0,
        sends: m.shares_count ?? 0,
        comments: m.comments_count ?? 0,
        timestamp: m.timestamp ?? "",
      }));
  } catch {
    return [];
  }
}
