"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { ScrollIndicator } from "@/components/hero/ScrollIndicator";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useFilter } from "@/context/FilterContext";

export default function HomePage() {
  const router = useRouter();
  const { setActiveFilter } = useFilter();
  const [leaving, setLeaving] = useState(false);
  const [homeViewportHeight, setHomeViewportHeight] = useState("100svh");
  const [homeBottomOffset, setHomeBottomOffset] = useState(
    "max(32px, calc(env(safe-area-inset-bottom) + 24px))"
  );

  const goToWorks = useCallback(() => {
    if (leaving) return;
    setActiveFilter("all");
    setLeaving(true);
    setTimeout(() => router.push("/works"), 500);
  }, [router, leaving, setActiveFilter]);

  useEffect(() => {
    setActiveFilter("all");
  }, [setActiveFilter]);

  useEffect(() => {
    const updateHomeViewport = () => {
      if (window.innerWidth > 767) {
        setHomeViewportHeight("100svh");
        setHomeBottomOffset("max(32px, calc(env(safe-area-inset-bottom) + 24px))");
        return;
      }

      const visibleHeight = window.visualViewport?.height ?? window.innerHeight;
      setHomeViewportHeight(`${Math.round(visibleHeight)}px`);
      setHomeBottomOffset("max(14px, calc(env(safe-area-inset-bottom) + 10px))");
    };
    const visualViewport = window.visualViewport;

    updateHomeViewport();
    window.addEventListener("resize", updateHomeViewport);
    window.addEventListener("orientationchange", updateHomeViewport);
    visualViewport?.addEventListener("resize", updateHomeViewport);
    visualViewport?.addEventListener("scroll", updateHomeViewport);

    return () => {
      window.removeEventListener("resize", updateHomeViewport);
      window.removeEventListener("orientationchange", updateHomeViewport);
      visualViewport?.removeEventListener("resize", updateHomeViewport);
      visualViewport?.removeEventListener("scroll", updateHomeViewport);
    };
  }, []);

  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (deltaY > 80) goToWorks();
    };
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) goToWorks();
    };

    // Touch events on document (Rule 7)
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true, once: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [goToWorks]);

  return (
    <motion.main
      className="home-screen relative w-screen overflow-hidden"
      style={{
        "--home-bottom-offset": homeBottomOffset,
        height: homeViewportHeight,
        minHeight: homeViewportHeight,
      } as CSSProperties}
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeroVideo />
      <ScrollIndicator onClick={goToWorks} />
      <div
        className="home-social-links"
        style={{
          position: "absolute",
          bottom: "var(--home-bottom-offset)",
          right: "clamp(16px, 3vw, 24px)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          zIndex: 20,
          pointerEvents: "auto",
        }}
      >
        <SocialLinks size={22} gap={20} tone="home" />
      </div>
      <style>{`
        .home-screen {
          --home-bottom-offset: max(32px, calc(env(safe-area-inset-bottom) + 24px));
        }
      `}</style>
    </motion.main>
  );
}
