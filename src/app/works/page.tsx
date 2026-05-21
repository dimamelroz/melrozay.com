"use client";

import { useState, useCallback } from "react";
import { WorksGrid } from "@/components/works/WorksGrid";
import { VideoLightbox } from "@/components/works/VideoLightbox";
import { WORKS } from "@/data/works";
import { useFilter } from "@/context/FilterContext";
import type { Work } from "@/types/work";

export default function WorksPage() {
  const { activeFilter } = useFilter();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  const filteredWorks =
    activeFilter === "all"
      ? WORKS
      : WORKS.filter((w) => w.filterGroup === activeFilter);

  const handleClose = useCallback(() => setSelectedWork(null), []);

  return (
    <>
      <main style={{ paddingTop: "var(--header-height)", minHeight: "100vh" }}>
        <WorksGrid works={filteredWorks} onOpen={setSelectedWork} />
      </main>
      <VideoLightbox work={selectedWork} onClose={handleClose} />
    </>
  );
}
