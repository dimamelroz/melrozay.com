"use client";

import { useEffect, useRef, useState } from "react";
import { WorkCard } from "./WorkCard";
import { GAP_PX } from "@/lib/constants";
import type { Work } from "@/types/work";

interface LayoutItem {
  work: Work;
  gridColumn: number;
  gridRow: number;
  rowSpan: 1 | 2;
}

function computeLayout(works: Work[], columns: 2 | 3): LayoutItem[] {
  const result: LayoutItem[] = [];
  const colHeight = new Array(columns).fill(0);

  for (const work of works) {
    const rowSpan: 1 | 2 = work.orientation === "vertical" ? 2 : 1;
    let bestCol = 0;
    for (let c = 1; c < columns; c++) {
      if (colHeight[c] < colHeight[bestCol]) bestCol = c;
    }
    result.push({
      work,
      gridColumn: bestCol + 1,
      gridRow: colHeight[bestCol] + 1,
      rowSpan,
    });
    colHeight[bestCol] += rowSpan;
  }

  return result;
}

const ANIM_STYLE = `
  @keyframes work-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .work-item {
    opacity: 0;
    animation: work-fade-in 0.45s ease forwards;
  }
`;

interface WorksGridProps {
  works: Work[];
  onOpen: (work: Work) => void;
}

export function WorksGrid({ works, onOpen }: WorksGridProps) {
  // Default 1 — safe for mobile SSR/hydration; corrected to 2/3 by effect on desktop
  const [columns, setColumns] = useState<1 | 2 | 3>(1);
  const [rowHeightPx, setRowHeightPx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLayout = () => {
      const vw = window.innerWidth;
      const cols: 1 | 2 | 3 = vw < 768 ? 1 : vw < 1024 ? 2 : 3;
      setColumns(cols);
      if (cols > 1) {
        const el = containerRef.current;
        const containerWidth = el ? el.getBoundingClientRect().width : vw;
        const cellWidth = (containerWidth - (cols - 1) * GAP_PX) / cols;
        setRowHeightPx((cellWidth * 9) / 16);
      }
    };
    updateLayout();
    const raf = requestAnimationFrame(updateLayout);
    window.addEventListener("resize", updateLayout);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  const gridKey = works.map((w) => w.id).join(",");

  // Mobile: pure CSS, no JS measurement dependency
  if (columns === 1) {
    return (
      <div key={gridKey} style={{ display: "flex", flexDirection: "column", gap: `${GAP_PX}px` }}>
        <style>{ANIM_STYLE}</style>
        {works.map((work, index) => (
          <div
            key={`${gridKey}-${work.id}`}
            className="work-item"
            style={{ animationDelay: `${Math.min(index, 12) * 0.05}s` }}
          >
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

  // Desktop/tablet: CSS Grid with masonry packing
  const items = computeLayout(works, columns as 2 | 3);

  // Sort by gridRow then gridColumn so DOM order = visual row order → correct stagger
  const sortedItems = [...items].sort((a, b) =>
    a.gridRow !== b.gridRow ? a.gridRow - b.gridRow : a.gridColumn - b.gridColumn
  );

  return (
    <div
      key={gridKey}
      ref={containerRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: rowHeightPx > 0 ? `${rowHeightPx}px` : undefined,
        gap: `${GAP_PX}px`,
      }}
    >
      <style>{ANIM_STYLE}</style>
      {sortedItems.map((item) => (
        <div
          key={`${gridKey}-${item.work.id}`}
          className="work-item"
          style={{
            gridColumn: item.gridColumn,
            gridRow: `${item.gridRow} / span ${item.rowSpan}`,
            // Cards before rowHeight is measured: use natural aspect so they're visible
            aspectRatio: rowHeightPx > 0 ? undefined : (item.work.orientation === "horizontal" ? "16/9" : "9/16"),
            animationDelay: `${Math.min(item.gridRow - 1, 8) * 0.12 + (item.gridColumn - 1) * 0.06}s`,
          }}
        >
          <WorkCard
            work={item.work}
            onClick={() => onOpen(item.work)}
            forcedAspect={rowHeightPx > 0 ? "fill" : (item.work.orientation === "horizontal" ? "16/9" : "9/16")}
          />
        </div>
      ))}
    </div>
  );
}
