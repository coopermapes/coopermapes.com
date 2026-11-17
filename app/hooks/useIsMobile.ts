"use client";

import { useSyncExternalStore } from "react";

// Snapshot values: 0 = desktop, 1 = mobile, 2 = "not measured yet" (server render and the
// hydration pass, where the viewport is unknown).
const UNKNOWN = 2;

function makeStore(breakpoint: number) {
  const query = `(max-width: ${breakpoint}px)`;
  return {
    subscribe(onChange: () => void) {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    getSnapshot: () => (window.matchMedia(query).matches ? 1 : 0),
    getServerSnapshot: () => UNKNOWN,
  };
}

const stores = new Map<number, ReturnType<typeof makeStore>>();
function storeFor(breakpoint: number) {
  let s = stores.get(breakpoint);
  if (!s) { s = makeStore(breakpoint); stores.set(breakpoint, s); }
  return s;
}

// `ready` is false until the screen width has actually been measured. The server can't know
// the viewport, so it always renders the desktop markup; on a phone that wrong layout would
// paint (nav links, desktop footer) until hydration swaps it. Chrome that isn't faded in
// (Nav, Footer) hides itself while !ready so the first thing a visitor sees is the correct
// layout, never the desktop one.
export function useIsMobileReady(breakpoint = 768): { isMobile: boolean; ready: boolean } {
  const store = storeFor(breakpoint);
  const v = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { isMobile: v === 1, ready: v !== UNKNOWN };
}

// SSR-safe: false on the server and during hydration, then the real value.
export function useIsMobile(breakpoint = 768): boolean {
  return useIsMobileReady(breakpoint).isMobile;
}
