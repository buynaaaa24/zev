"use client";

import { useEffect, useRef, useState } from "react";

export interface ScrollState {
  progress: number;   // 0–1 scroll position within the element
  entered: boolean;   // has it entered viewport
  y: number;          // raw scrollY
}

/**
 * Tracks scroll progress through a section element.
 * progress = 0 at element top entering viewport, 1 at bottom leaving.
 */
export function useSectionScroll() {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<ScrollState>({ progress: 0, entered: false, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const entered = rect.top < winH && rect.bottom > 0;
      // 0 when top enters bottom of screen, 1 when bottom exits top of screen
      const progress = Math.min(1, Math.max(0, (winH - rect.top) / (winH + rect.height)));
      setState({ progress, entered, y: window.scrollY });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { ref, ...state };
}

/**
 * Lightweight IntersectionObserver reveal hook.
 * Adds 'visible' class once element enters viewport.
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/**
 * Returns a value interpolated from `from` to `to` based on scroll progress,
 * clamped within [fromP, toP] progress range.
 */
export function lerp(from: number, to: number, progress: number, fromP = 0, toP = 1) {
  const t = Math.min(1, Math.max(0, (progress - fromP) / (toP - fromP)));
  return from + (to - from) * t;
}
