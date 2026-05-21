"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HeroVideo } from "@/components/hero/HeroVideo";
import { ScrollIndicator } from "@/components/hero/ScrollIndicator";
import { FaTelegramPlane, FaInstagram, FaVimeoV } from "react-icons/fa";

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
        {[
          { icon: <FaTelegramPlane size={22} />, label: "Telegram", href: "https://t.me/" },
          { icon: <FaInstagram size={22} />, label: "Instagram", href: "https://instagram.com/" },
          { icon: <FaVimeoV size={22} />, label: "Vimeo", href: "https://vimeo.com/" },
        ].map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            style={{
              color: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              transition: "color 150ms",
            }}
            className="hover:text-white"
          >
            {icon}
          </a>
        ))}
      </div>
    </main>
  );
}
