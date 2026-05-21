"use client";

import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (locked) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [locked]);
}
