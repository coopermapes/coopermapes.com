"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Footer from "./Footer";

// Standalone bio-link pages (e.g. /links) render full-bleed with none of the
// site's Nav/Footer chrome — they're meant to be shared as a single isolated
// link (Instagram bio, etc.), not part of the normal site page flow.
const NO_CHROME_ROUTES = ["/links", "/links-experiment"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = NO_CHROME_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {!hideChrome && <Nav />}
      <main id="main-content">{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}
