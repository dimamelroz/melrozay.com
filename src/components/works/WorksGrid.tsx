"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  // The first render uses a CSS fallback grid so desktop never starts as one huge mobile column.
  const [columns, setColumns] = useState<1 | 2 | 3>(1);
  const [rowHeightPx, setRowHeightPx] = useState(0);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [videoLoadState, setVideoLoadState] = useState({ key: "", limit: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const gridKey = works.map((w) => w.id).join(",");
  const videoLoadLimit = videoLoadState.key === gridKey ? videoLoadState.limit : 0;

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
      } else {
        setRowHeightPx(0);
      }
      setHasMeasured(true);
    };
    updateLayout();
    const raf = requestAnimationFrame(updateLayout);
    window.addEventListener("resize", updateLayout);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateLayout);
    };
  }, []);

  useEffect(() => {
    if (!hasMeasured) return;

    const concurrency = columns === 1 ? 2 : 3;
    setVideoLoadState({ key: gridKey, limit: Math.min(concurrency, works.length) });
  }, [columns, gridKey, hasMeasured, works.length]);

  useEffect(() => {
    if (!hasMeasured || videoLoadLimit >= works.length) return;

    const delay = columns === 1 ? 900 : 650;
    const timer = window.setTimeout(() => {
      setVideoLoadState((current) => ({
        key: gridKey,
        limit: Math.min((current.key === gridKey ? current.limit : 0) + 1, works.length),
      }));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [columns, hasMeasured, videoLoadLimit, works.length]);

  const handleVideoLoadSettled = useCallback(() => {
    setVideoLoadState((current) => ({
      key: gridKey,
      limit: Math.min((current.key === gridKey ? current.limit : 0) + 1, works.length),
    }));
  }, [gridKey, works.length]);

  if (!hasMeasured) {
    return (
      <div
        key={gridKey}
        className="works-grid-fallback"
        style={{
          display: "grid",
          gap: `${GAP_PX}px`,
        }}
      >
        <style>{`${ANIM_STYLE}
          .works-grid-fallback { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          @media (max-width: 1023px) {
            .works-grid-fallback { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          }
          @media (max-width: 767px) {
            .works-grid-fallback { grid-template-columns: 1fr; }
          }
        `}</style>
        {works.map((work, index) => (
          <div
            key={work.id}
            className="work-item"
            style={{ animationDelay: `${Math.min(index, 12) * 0.05}s` }}
          >
            <WorkCard
              work={work}
              onClick={work.fullVideo ? () => onOpen(work) : undefined}
              forcedAspect={work.orientation === "horizontal" ? "16/9" : "9/16"}
              loadVideo={false}
            />
          </div>
        ))}
      </div>
    );
  }

  // Mobile: pure CSS, no JS measurement dependency
  if (columns === 1) {
    return (
      <div key={gridKey} style={{ display: "flex", flexDirection: "column", gap: `${GAP_PX}px` }}>
        <style>{ANIM_STYLE}</style>
        {works.map((work, index) => (
          <div
            key={work.id}
            className="work-item"
            style={{ animationDelay: `${Math.min(index, 12) * 0.05}s` }}
          >
            <WorkCard
              work={work}
              onClick={work.fullVideo ? () => onOpen(work) : undefined}
              forcedAspect={work.orientation === "horizontal" ? "16/9" : "9/16"}
              loadVideo={index < videoLoadLimit}
              onVideoLoadSettled={handleVideoLoadSettled}
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
      {sortedItems.map((item, index) => (
        <div
          key={item.work.id}
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
            onClick={item.work.fullVideo ? () => onOpen(item.work) : undefined}
            forcedAspect={rowHeightPx > 0 ? "fill" : (item.work.orientation === "horizontal" ? "16/9" : "9/16")}
            loadVideo={index < videoLoadLimit}
            onVideoLoadSettled={handleVideoLoadSettled}
          />
        </div>
      ))}
    </div>
  );
}
