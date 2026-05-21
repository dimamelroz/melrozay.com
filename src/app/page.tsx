"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { ScrollIndicator } from "@/components/hero/ScrollIndicator";

export default function HomePage() {
  const router = useRouter();

  const goToWorks = useCallback(() => {
    router.push("/works");
  }, [router]);

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
    <main className="relative w-screen h-screen overflow-hidden">
      <HeroVideo />
      <ScrollIndicator onClick={goToWorks} />
    </main>
  );
}
