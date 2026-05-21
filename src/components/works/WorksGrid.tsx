"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WorkCard } from "./WorkCard";
import { GAP_PX } from "@/lib/constants";
import type { Work } from "@/types/work";

interface LayoutItem {
  work: Work;
  gridColumn: number;
  gridRow: number;
  rowSpan: 1 | 2;
}

function computeLayout(works: Work[], columns: 2 | 3): { items: LayoutItem[]; blockRows: number } {
  const result: LayoutItem[] = [];
  // colHeight[i] = rows consumed in column i (0-indexed columns)
  const colHeight = new Array(columns).fill(0);

  for (const work of works) {
    const rowSpan: 1 | 2 = work.orientation === "vertical" ? 2 : 1;

    // Find the column with the smallest height (leftmost on tie)
    let bestCol = 0;
    for (let c = 1; c < columns; c++) {
      if (colHeight[c] < colHeight[bestCol]) bestCol = c;
    }

    result.push({
      work,
      gridColumn: bestCol + 1,       // CSS grid is 1-indexed
      gridRow: colHeight[bestCol] + 1,
      rowSpan,
    });

    colHeight[bestCol] += rowSpan;
  }

  const blockRows = Math.max(...colHeight);
  return { items: result, blockRows };
}

interface WorksGridProps {
  works: Work[];
  onOpen: (work: Work) => void;
}

export function WorksGrid({ works, onOpen }: WorksGridProps) {
  // Default to 3 columns to avoid 1-column flash on desktop (Rule 6)
  const [columns, setColumns] = useState<1 | 2 | 3>(3);
  const [rowHeightPx, setRowHeightPx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Column count from viewport width; row height from container width (decoupled)
  useEffect(() => {
    const updateLayout = () => {
      const el = containerRef.current;
      if (!el) return;
      const vw = window.innerWidth;
      const cols: 1 | 2 | 3 = vw < 768 ? 1 : vw < 1024 ? 2 : 3;
      setColumns(cols);
      if (cols > 1) {
        const containerWidth = el.getBoundingClientRect().width;
        const cellWidth = (containerWidth - (cols - 1) * GAP_PX) / cols;
        setRowHeightPx((cellWidth * 9) / 16);
      }
    };

    // Initial measurement on next tick to ensure layout is ready
    const raf = requestAnimationFrame(updateLayout);
    window.addEventListener("resize", updateLayout);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  const layout = useMemo(() => {
    if (columns === 1 || works.length === 0) return [];
    const { items } = computeLayout(works, columns as 2 | 3);
    return items;
  }, [works, columns]);

  // Mobile: 1-column stack in source order, no infinite scroll
  if (columns === 1) {
    return (
      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: `${GAP_PX}px` }}>
        {works.map((work) => (
          <WorkCard
            key={work.id}
            work={work}
            onClick={() => onOpen(work)}
            forcedAspect={work.orientation === "horizontal" ? "16/9" : "9/16"}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: rowHeightPx > 0 ? `${rowHeightPx}px` : undefined,
        gap: `${GAP_PX}px`,
      }}
    >
      {layout.map((item) => (
        <div
          key={item.work.id}
          style={{
            gridColumn: item.gridColumn,
            gridRow: `${item.gridRow} / span ${item.rowSpan}`,
          }}
        >
          <WorkCard
            work={item.work}
            onClick={() => onOpen(item.work)}
            forcedAspect="fill"
          />
        </div>
      ))}
    </div>
  );
}
