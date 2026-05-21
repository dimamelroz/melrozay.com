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
      <main style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: "var(--header-height)" }}>
        <div style={{ flex: "1 0 auto" }}>
          <WorksGrid works={filteredWorks} onOpen={setSelectedWork} />
        </div>
        <div style={{ minHeight: "clamp(80px, 14vw, 200px)" }}>
          {showMarquee && <MarqueeFooter />}
        </div>
      </main>
      <VideoLightbox work={selectedWork} onClose={handleClose} />
    </>
  );
}
