'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Loads the Three.js bundle as a separate chunk, only in the browser.
const CanvasBackground = dynamic(() => import('./Background'), { ssr: false });

/**
 * Defers mounting the starfield until the browser is idle, so the page text
 * renders and hydrates before any Three.js code is fetched or parsed. The
 * canvas then fades in via its own CSS animation.
 */
export default function LazyBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true));
      return () => window.cancelIdleCallback(id);
    }
    // Safari: no requestIdleCallback
    const id = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  return ready ? <CanvasBackground /> : null;
}
