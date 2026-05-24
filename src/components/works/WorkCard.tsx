"use client";

import type { Work } from "@/types/work";

interface WorkCardProps {
  work: Work;
  onClick: () => void;
  forcedAspect: "16/9" | "9/16" | "fill";
}

export function WorkCard({ work, onClick, forcedAspect }: WorkCardProps) {
  const wrapperClass =
    forcedAspect === "fill"
      ? "w-full h-full"
      : forcedAspect === "16/9"
      ? "w-full aspect-video"
      : "w-full aspect-[9/16]";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`${wrapperClass} relative overflow-hidden cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-white`}
    >
      {/* Cover — video preview if available, otherwise image */}
      {work.previewVideo ? (
        <video
          src={work.previewVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <img
          src={work.cover}
          alt={work.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}

      {/* Hover overlay — pointer-events-none so it never blocks taps (Rule 4) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      />

      {/* Role — top-right, pointer-events-none */}
      <span
        className="absolute top-3 right-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)] opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        {work.role}
      </span>

      {/* Title — bottom-left, pointer-events-none */}
      <span
        className="absolute bottom-3 left-3 text-lg md:text-xl font-semibold text-white opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        {work.title}
      </span>

      {/* ProjectType — bottom-right, pointer-events-none */}
      <span
        className="absolute bottom-3 right-3 text-xs uppercase tracking-wider text-[var(--color-text-muted)] opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        {work.projectType}
      </span>
    </div>
  );
}
