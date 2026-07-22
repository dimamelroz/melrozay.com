"use client";

import { useCallback, useEffect, useState } from "react";
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
      className="relative w-screen h-screen overflow-hidden"
      animate={leaving ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeroVideo />
      <ScrollIndicator onClick={goToWorks} />
      <div
        style={{
          position: "absolute",
          bottom: "clamp(16px, 3vw, 24px)",
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
    </motion.main>
  );
}
