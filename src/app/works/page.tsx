"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { WorksGrid } from "@/components/works/WorksGrid";
import { VideoLightbox } from "@/components/works/VideoLightbox";
import { MarqueeFooter } from "@/components/works/MarqueeFooter";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { WORKS } from "@/data/works";
import { useFilter } from "@/context/FilterContext";
import { wakePreviewVideos } from "@/lib/previewVideos";
import type { Work } from "@/types/work";

export default function WorksPage() {
  const { activeFilter } = useFilter();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [showMarquee, setShowMarquee] = useState(false);

  const filteredWorks = useMemo(
    () =>
      activeFilter === "all"
        ? WORKS
        : WORKS.filter((w) => w.filterGroup === activeFilter),
    [activeFilter]
  );

  const handleClose = useCallback(() => {
    wakePreviewVideos();
    setSelectedWork(null);
  }, []);

  useEffect(() => {
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setShowMarquee(true));
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);

  useEffect(() => {
    const wake = () => wakePreviewVideos();
    const captureOptions = { capture: true, passive: true };

    wake();
    window.addEventListener("pageshow", wake);
    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("touchstart", wake, captureOptions);
    document.addEventListener("pointerdown", wake, captureOptions);
    document.addEventListener("visibilitychange", wake);

    return () => {
      window.removeEventListener("pageshow", wake);
      window.removeEventListener("scroll", wake);
      document.removeEventListener("touchstart", wake, captureOptions);
      document.removeEventListener("pointerdown", wake, captureOptions);
      document.removeEventListener("visibilitychange", wake);
    };
  }, [filteredWorks]);

  return (
    <>
      <style>{`
        @keyframes works-slide-up {
          from { transform: translateY(300px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .works-enter {
          animation: works-slide-up 1.5s ease both;
        }
        .works-mobile-top-mask {
          display: none;
        }
        video[data-preview-video]::-webkit-media-controls {
          display: none !important;
        }
        video[data-preview-video]::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
          opacity: 0;
          pointer-events: none;
        }
        @media (max-width: 767px) {
          .works-mobile-top-mask {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 136px;
            z-index: 80;
            pointer-events: none;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.72) 0%,
              rgba(0, 0, 0, 0.48) 42%,
              rgba(0, 0, 0, 0.18) 76%,
              rgba(0, 0, 0, 0) 100%
            );
          }
          .works-footer-meta {
            align-items: center !important;
            bottom: 16px !important;
          }
          .works-footer-links {
            gap: 20px !important;
          }
        }
      `}</style>
      <div className="works-mobile-top-mask" />
      <main className="works-enter" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: "var(--header-height)" }}>
        <div style={{ flex: "1 0 auto" }}>
          <WorksGrid works={filteredWorks} onOpen={setSelectedWork} />
        </div>
        <div style={{ position: "relative", minHeight: "clamp(80px, 14vw, 200px)" }}>
          {showMarquee && <MarqueeFooter />}
          <div
            className="works-footer-meta"
            style={{
              position: "absolute",
              left: "clamp(16px, 3vw, 40px)",
              right: "clamp(16px, 3vw, 40px)",
              bottom: "clamp(12px, 2vw, 24px)",
              zIndex: 2,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 24,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.45)",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              ручная работа нейросети
            </span>
            <div
              className="works-footer-links"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                pointerEvents: "auto",
              }}
            >
              <SocialLinks size={22} gap={20} tone="works" />
            </div>
          </div>
        </div>
      </main>
      <VideoLightbox work={selectedWork} onClose={handleClose} />
    </>
  );
}
