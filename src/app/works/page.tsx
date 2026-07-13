"use client";

import { useState, useCallback, useEffect } from "react";
import { WorksGrid } from "@/components/works/WorksGrid";
import { VideoLightbox } from "@/components/works/VideoLightbox";
import { MarqueeFooter } from "@/components/works/MarqueeFooter";
import { WORKS } from "@/data/works";
import { useFilter } from "@/context/FilterContext";
import type { Work } from "@/types/work";

export default function WorksPage() {
  const { activeFilter } = useFilter();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [showMarquee, setShowMarquee] = useState(false);

  const filteredWorks =
    activeFilter === "all"
      ? WORKS
      : WORKS.filter((w) => w.filterGroup === activeFilter);

  const handleClose = useCallback(() => setSelectedWork(null), []);

  useEffect(() => {
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setShowMarquee(true));
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
  }, []);

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
      `}</style>
      <main className="works-enter" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: "var(--header-height)" }}>
        <div style={{ flex: "1 0 auto" }}>
          <WorksGrid works={filteredWorks} onOpen={setSelectedWork} />
        </div>
        <div style={{ position: "relative", minHeight: "clamp(80px, 14vw, 200px)" }}>
          {showMarquee && <MarqueeFooter />}
          <div
            style={{
              position: "absolute",
              right: "clamp(16px, 3vw, 40px)",
              bottom: "clamp(12px, 2vw, 24px)",
              zIndex: 2,
              color: "rgba(255,255,255,0.45)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            ручная работа нейросети
          </div>
        </div>
      </main>
      <VideoLightbox work={selectedWork} onClose={handleClose} />
    </>
  );
}
