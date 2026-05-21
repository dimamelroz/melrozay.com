"use client";

import { WorkCard } from "./WorkCard";
import { GAP_PX } from "@/lib/constants";
import type { Work } from "@/types/work";

interface WorksGridProps {
  works: Work[];
  onOpen: (work: Work) => void;
}

export function WorksGrid({ works, onOpen }: WorksGridProps) {
  return (
    <div className="works-grid" style={{ columnGap: `${GAP_PX}px` }}>
      <style>{`
        .works-grid { column-count: 1; }
        @media (min-width: 768px) { .works-grid { column-count: 2; } }
        @media (min-width: 1024px) { .works-grid { column-count: 3; } }
      `}</style>
      {works.map((work) => (
        <div key={work.id} style={{ breakInside: "avoid", marginBottom: `${GAP_PX}px`, width: "100%" }}>
          <WorkCard
            work={work}
            onClick={() => onOpen(work)}
            forcedAspect={work.orientation === "horizontal" ? "16/9" : "9/16"}
          />
        </div>
      ))}
    </div>
  );
}
