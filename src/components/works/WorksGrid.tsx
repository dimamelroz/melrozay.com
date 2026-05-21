"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { WorkCard } from "./WorkCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GAP_PX } from "@/lib/constants";
import type { Work } from "@/types/work";

interface LayoutItem {
  work: Work;
  gridColumn: number;
  gridRow: number;
  rowSpan: 1 | 2;
}

function computeLayout(works: Work[], columns: 2 | 3): LayoutItem[] {
  const horizontals = works.filter((w) => w.orientation === "horizontal");
  const verticals = works.filter((w) => w.orientation === "vertical");
  const result: LayoutItem[] = [];
  let row = 1;
  let hIdx = 0;
  let vIdx = 0;

  if (columns === 3) {
    while (hIdx < horizontals.length || vIdx < verticals.length) {
      const hLeft = horizontals.length - hIdx;
      const vLeft = verticals.length - vIdx;

      if (vLeft > 0 && hLeft >= 4) {
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 2, gridRow: row, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row + 1, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 2, gridRow: row + 1, rowSpan: 1 });
        result.push({ work: verticals[vIdx++], gridColumn: 3, gridRow: row, rowSpan: 2 });
        row += 2;
      } else if (hLeft >= 3) {
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 2, gridRow: row, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 3, gridRow: row, rowSpan: 1 });
        row += 1;
      } else if (vLeft > 0) {
        result.push({ work: verticals[vIdx++], gridColumn: 3, gridRow: row, rowSpan: 2 });
        const positions = [
          { col: 1, rowOffset: 0 },
          { col: 2, rowOffset: 0 },
          { col: 1, rowOffset: 1 },
          { col: 2, rowOffset: 1 },
        ];
        for (let i = 0; i < Math.min(hLeft, 4); i++) {
          result.push({
            work: horizontals[hIdx++],
            gridColumn: positions[i].col,
            gridRow: row + positions[i].rowOffset,
            rowSpan: 1,
          });
        }
        row += 2;
      } else {
        let col = 1;
        while (hIdx < horizontals.length && col <= 3) {
          result.push({ work: horizontals[hIdx++], gridColumn: col, gridRow: row, rowSpan: 1 });
          col += 1;
        }
        row += 1;
      }
    }
  } else {
    // columns === 2
    while (hIdx < horizontals.length || vIdx < verticals.length) {
      const hLeft = horizontals.length - hIdx;
      const vLeft = verticals.length - vIdx;
      if (vLeft > 0 && hLeft >= 2) {
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row + 1, rowSpan: 1 });
        result.push({ work: verticals[vIdx++], gridColumn: 2, gridRow: row, rowSpan: 2 });
        row += 2;
      } else if (hLeft >= 2) {
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row, rowSpan: 1 });
        result.push({ work: horizontals[hIdx++], gridColumn: 2, gridRow: row, rowSpan: 1 });
        row += 1;
      } else if (vLeft > 0) {
        result.push({ work: verticals[vIdx++], gridColumn: 2, gridRow: row, rowSpan: 2 });
        for (let i = 0; i < Math.min(hLeft, 2); i++) {
          result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row + i, rowSpan: 1 });
        }
        row += 2;
      } else {
        result.push({ work: horizontals[hIdx++], gridColumn: 1, gridRow: row, rowSpan: 1 });
        row += 1;
      }
    }
  }
  return result;
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

  // Set up infinite scroll scroll-teleportation
  useInfiniteScroll(works);

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

  // Compute single-copy layout, then triple with row offsets
  const tripledLayout = useMemo(() => {
    if (columns === 1 || works.length === 0) return [];
    const singleLayout = computeLayout(works, columns as 2 | 3);
    if (singleLayout.length === 0) return [];
    const maxRow = Math.max(...singleLayout.map((i) => i.gridRow + (i.rowSpan - 1)));
    return [
      ...singleLayout.map((item) => ({ ...item, copyIdx: 0 })),
      ...singleLayout.map((item) => ({ ...item, gridRow: item.gridRow + maxRow, copyIdx: 1 })),
      ...singleLayout.map((item) => ({ ...item, gridRow: item.gridRow + maxRow * 2, copyIdx: 2 })),
    ];
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
      {tripledLayout.map((item) => (
        <div
          key={`${item.work.id}-${item.copyIdx}`}
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
