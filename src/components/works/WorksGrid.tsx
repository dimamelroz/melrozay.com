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
  @keyframes work-fade-in-a {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes work-fade-in-b {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .work-item {
    opacity: 1;
  }
`;

interface WorksGridProps {
  works: Work[];
  onOpen: (work: Work) => void;
  activeFilter?: "all" | "commercial" | "music-video";
  animationKey?: string;
}

export function WorksGrid({ works, onOpen, activeFilter = "all", animationKey }: WorksGridProps) {
  // The first render uses a CSS fallback grid so desktop never starts as one huge mobile column.
  const [columns, setColumns] = useState<1 | 2 | 3>(1);
  const [rowHeightPx, setRowHeightPx] = useState(0);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleWorks =
    activeFilter === "all"
      ? works
      : works.filter((work) => work.filterGroup === activeFilter);
  const visibleIds = new Set(visibleWorks.map((work) => work.id));
  const animationName = animationCycle % 2 === 0 ? "work-fade-in-a" : "work-fade-in-b";

  useEffect(() => {
    setAnimationCycle((cycle) => cycle + 1);
  }, [animationKey]);

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

  if (!hasMeasured) {
    return (
      <div
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
        {visibleWorks.map((work, index) => (
          <div
            key={work.id}
            className="work-item"
            style={{
              animationName,
              animationDuration: "0.45s",
              animationTimingFunction: "ease",
              animationFillMode: "forwards",
              animationDelay: `${Math.min(index, 12) * 0.05}s`,
            }}
          >
            <WorkCard
              work={work}
              onClick={work.fullVideo ? () => onOpen(work) : undefined}
              forcedAspect={work.orientation === "horizontal" ? "16/9" : "9/16"}
            />
          </div>
        ))}
      </div>
    );
  }

  // Mobile: pure CSS, no JS measurement dependency
  if (columns === 1) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: `${GAP_PX}px` }}>
        <style>{ANIM_STYLE}</style>
        {works.map((work) => {
          const index = visibleWorks.findIndex((visibleWork) => visibleWork.id === work.id);
          const isVisible = visibleIds.has(work.id);
          return (
          <div
            key={work.id}
            className="work-item"
            style={
              isVisible
                ? {
                    animationName,
                    animationDuration: "0.45s",
                    animationTimingFunction: "ease",
                    animationFillMode: "forwards",
                    animationDelay: `${Math.min(index, 12) * 0.05}s`,
                  }
                : {
                    position: "absolute",
                    width: 1,
                    height: 1,
                    opacity: 0,
                    pointerEvents: "none",
                    transform: "translateX(-9999px)",
                    overflow: "hidden",
                  }
            }
          >
            <WorkCard
              work={work}
              onClick={work.fullVideo ? () => onOpen(work) : undefined}
              forcedAspect={work.orientation === "horizontal" ? "16/9" : "9/16"}
            />
          </div>
          );
        })}
      </div>
    );
  }

  // Desktop/tablet: CSS Grid with masonry packing
  const items = computeLayout(visibleWorks, columns as 2 | 3);
  const itemMap = new Map(items.map((item) => [item.work.id, item]));

  // Sort by gridRow then gridColumn so DOM order = visual row order → correct stagger
  const sortedWorks = [...works].sort((a, b) => {
    const itemA = itemMap.get(a.id);
    const itemB = itemMap.get(b.id);
    if (!itemA && !itemB) return 0;
    if (!itemA) return 1;
    if (!itemB) return -1;
    return itemA.gridRow !== itemB.gridRow
      ? itemA.gridRow - itemB.gridRow
      : itemA.gridColumn - itemB.gridColumn;
  });

  const getDesktopItemStyle = (work: Work) => {
    const item = itemMap.get(work.id);
    if (!item) {
      return {
        position: "absolute" as const,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none" as const,
        transform: "translateX(-9999px)",
        overflow: "hidden",
      };
    }

    return {
      gridColumn: item.gridColumn,
      gridRow: `${item.gridRow} / span ${item.rowSpan}`,
      // Cards before rowHeight is measured: use natural aspect so they're visible
      aspectRatio: rowHeightPx > 0 ? undefined : (work.orientation === "horizontal" ? "16/9" : "9/16"),
      animationName,
      animationDuration: "0.45s",
      animationTimingFunction: "ease",
      animationFillMode: "forwards",
      animationDelay: `${Math.min(item.gridRow - 1, 8) * 0.12 + (item.gridColumn - 1) * 0.06}s`,
    };
  };

  const getForcedAspect = (work: Work) =>
    rowHeightPx > 0 && itemMap.has(work.id)
      ? "fill"
      : (work.orientation === "horizontal" ? "16/9" : "9/16");

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
      <style>{ANIM_STYLE}</style>
      {sortedWorks.map((work) => (
        <div
          key={work.id}
          className="work-item"
          style={getDesktopItemStyle(work)}
        >
          <WorkCard
            work={work}
            onClick={work.fullVideo ? () => onOpen(work) : undefined}
            forcedAspect={getForcedAspect(work)}
          />
        </div>
      ))}
    </div>
  );
}
