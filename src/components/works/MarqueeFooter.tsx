"use client";

import { useRef, useEffect, useState } from "react";

const UNIT_COUNT = 6;
const SPEED = 60; // pixels per second

function MarqueeUnit() {
  return (
    <>
      <span style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Dima Melroz</span>
      <svg
        viewBox="0 0 245 150"
        aria-hidden="true"
        style={{ height: "0.75em", width: "auto", flexShrink: 0, margin: "0 0.35em" }}
      >
        <ellipse cx="70" cy="75" rx="46" ry="70" fill="none" stroke="#8a8a8a" strokeWidth="8" />
        <ellipse cx="165" cy="75" rx="46" ry="70" fill="none" stroke="#8a8a8a" strokeWidth="8" />
        <text x="70" y="95" textAnchor="middle" fontSize="58" fontWeight="700" fill="#8a8a8a" transform="scale(1, 1.35)" style={{ transformOrigin: "70px 75px" }}>D</text>
        <text x="165" y="95" textAnchor="middle" fontSize="58" fontWeight="700" fill="#8a8a8a" transform="scale(1, 1.35)" style={{ transformOrigin: "165px 75px" }}>M</text>
      </svg>
    </>
  );
}

function MarqueeGroup({ innerRef }: { innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={innerRef} style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
      {Array.from({ length: UNIT_COUNT }).map((_, i) => (
        <MarqueeUnit key={i} />
      ))}
    </div>
  );
}

export function MarqueeFooter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    let offset = 0;
    let last = performance.now();
    let groupWidth = 0;

    const measure = () => {
      groupWidth = groupRef.current ? groupRef.current.offsetWidth : 0;
    };
    measure();
    window.addEventListener("resize", measure);

    // Apply initial transform before starting the loop so there's never an untransformed frame
    if (trackRef.current) {
      trackRef.current.style.transform = "translate3d(0,0,0)";
    }
    setReady(true);

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (groupWidth > 0) {
        offset += SPEED * dt;
        if (offset >= groupWidth) offset -= groupWidth;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div style={{ width: "100%", overflow: "hidden", paddingTop: "2rem", paddingBottom: "2rem", pointerEvents: "none" }}>
      <div
        ref={trackRef}
        style={{
          display: "inline-flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          fontSize: "clamp(60px, 12vw, 160px)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: "white",
          willChange: "transform",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        <MarqueeGroup innerRef={groupRef} />
        <MarqueeGroup />
      </div>
    </div>
  );
}
