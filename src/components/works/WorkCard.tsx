"use client";

import type { Work } from "@/types/work";

interface WorkCardProps {
  work: Work;
  onClick: () => void;
  forcedAspect: "16/9" | "9/16" | "fill";
}

export function WorkCard({ work, onClick, forcedAspect }: WorkCardProps) {
  const roleLabel = work.role.toLocaleLowerCase("ru-RU");
  const projectTypeLabel = work.projectType.toLocaleLowerCase("ru-RU");
  const hasHeadline = Boolean(work.headline);
  const headlineLabel = work.headline?.toLocaleUpperCase("ru-RU");
  const subtitleLabel = hasHeadline
    ? work.subtitle
    : work.subtitle?.toLocaleUpperCase("ru-RU");

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
          alt={work.subtitle ?? work.headline ?? ""}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      )}

      {/* Hover overlay — pointer-events-none so it never blocks taps (Rule 4) */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
      />

      {/* Top-right soft radial backdrop */}
      <div
        className="absolute top-0 right-0 pointer-events-none opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
        style={{
          width: "70%",
          height: "60%",
          background: "radial-gradient(ellipse at top right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Role — top-right, pointer-events-none */}
      <span
        className="absolute top-3 right-3 text-xs text-white opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ letterSpacing: "-0.035em" }}
      >
        {roleLabel}
      </span>

      {/* Title — bottom-left, pointer-events-none */}
      <div
        className="absolute bottom-3 left-3 flex flex-col text-xs text-white opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ letterSpacing: "-0.035em", lineHeight: 1.05, gap: 1 }}
      >
        {hasHeadline && (
          <span className="text-base md:text-lg" style={{ fontWeight: 700 }}>{headlineLabel}</span>
        )}
        {subtitleLabel && (
          <span
            className={hasHeadline ? undefined : "text-base md:text-lg"}
            style={{ fontWeight: hasHeadline ? 400 : 700 }}
          >
            {subtitleLabel}
          </span>
        )}
      </div>

      {/* Bottom-right soft radial backdrop */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
        style={{
          width: "70%",
          height: "60%",
          background: "radial-gradient(ellipse at bottom right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* ProjectType — bottom-right, pointer-events-none */}
      <span
        className="absolute bottom-3 right-3 text-xs text-white opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ letterSpacing: "-0.035em" }}
      >
        {projectTypeLabel}
      </span>
    </div>
  );
}
