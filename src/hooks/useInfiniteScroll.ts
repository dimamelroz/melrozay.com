"use client";

import { useEffect, useMemo, useRef } from "react";

export function useInfiniteScroll<T>(items: T[]): T[] {
  const tripled = useMemo(
    () => [...items, ...items, ...items],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items.length]
  );

  const lastLengthRef = useRef(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (items.length === 0) return;

    // Scroll to middle third on mount or when item count changes
    if (lastLengthRef.current !== items.length) {
      lastLengthRef.current = items.length;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight;
          window.scrollTo({ top: Math.floor(docHeight / 3), behavior: "instant" as ScrollBehavior });
        });
      });
    }

    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const third = Math.floor(docHeight / 3);
        if (scrollY < third) {
          window.scrollTo({ top: scrollY + third, behavior: "instant" as ScrollBehavior });
        } else if (scrollY > third * 2) {
          window.scrollTo({ top: scrollY - third, behavior: "instant" as ScrollBehavior });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return tripled;
}
