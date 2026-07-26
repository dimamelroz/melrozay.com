"use client";

import { useEffect, useRef, useState } from "react";
import { playPreviewVideo, wakePreviewVideos } from "@/lib/previewVideos";
import type { Work } from "@/types/work";

interface WorkCardProps {
  work: Work;
  onClick?: () => void;
  forcedAspect: "16/9" | "9/16" | "fill";
}

export function WorkCard({ work, onClick, forcedAspect }: WorkCardProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const canOpen = Boolean(onClick && work.fullVideo);
  const roleLabel = work.role.toLocaleLowerCase("ru-RU");
  const projectTypeLabel = work.projectType.toLocaleLowerCase("ru-RU");
  const hasHeadline = Boolean(work.headline);
  const headlineLabel = work.headline?.toLocaleUpperCase("ru-RU");
  const subtitleLabel = hasHeadline
    ? work.subtitle
    : work.subtitle?.toLocaleUpperCase("ru-RU");
  const previewVideoSrc = work.previewVideo
    ? `${work.previewVideo}?v=noaudio-2`
    : undefined;
  const posterSrc = work.previewVideo
    ? `/posters/${work.previewVideo.split("/").pop()}.jpg`
    : work.cover;

  const wrapperClass =
    forcedAspect === "fill"
      ? "w-full h-full"
      : forcedAspect === "16/9"
      ? "w-full aspect-video"
      : "w-full aspect-[9/16]";
  const mediaStyle = {
    position: "absolute",
    inset: -1,
    width: "calc(100% + 2px)",
    height: "calc(100% + 2px)",
    objectFit: "cover",
  } as const;

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!videoReady && video && video.currentTime > 0.05) {
      video.currentTime = 0;
    }
    setVideoReady(true);
    if (video) playPreviewVideo(video);
  };

  useEffect(() => {
    setVideoReady(false);
  }, [previewVideoSrc, shouldLoadVideo]);

  useEffect(() => {
    if (!previewVideoSrc) return;

    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") {
      setShouldLoadVideo(true);
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldLoadVideo(entry.isIntersecting);
      },
      { rootMargin: isMobile ? "1800px 0px" : "600px 0px" }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [previewVideoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const playPreview = () => {
      playPreviewVideo(video);
    };

    playPreview();
    video.addEventListener("loadedmetadata", playPreview);
    video.addEventListener("canplay", playPreview);
    window.addEventListener("pageshow", playPreview);
    document.addEventListener("visibilitychange", playPreview);

    return () => {
      video.removeEventListener("loadedmetadata", playPreview);
      video.removeEventListener("canplay", playPreview);
      window.removeEventListener("pageshow", playPreview);
      document.removeEventListener("visibilitychange", playPreview);
      video.pause();
    };
  }, [shouldLoadVideo, work.previewVideo]);

  return (
    <div
      ref={wrapperRef}
      role={canOpen ? "button" : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onClick={canOpen ? onClick : undefined}
      onKeyDown={(e) => {
        if (!canOpen) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          wakePreviewVideos();
          onClick?.();
        }
      }}
      onPointerDownCapture={wakePreviewVideos}
      onTouchStartCapture={wakePreviewVideos}
      className={`${wrapperClass} relative overflow-hidden bg-black ${canOpen ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-white" : "cursor-default"} group`}
    >
      <img
        src={posterSrc}
        alt={work.subtitle ?? work.headline ?? ""}
        loading="eager"
        decoding="async"
        style={mediaStyle}
      />

      {previewVideoSrc && shouldLoadVideo && (
        <video
          ref={videoRef}
          src={previewVideoSrc}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          preload="auto"
          poster={posterSrc}
          data-preview-video="true"
          disablePictureInPicture
          onLoadedData={handleVideoReady}
          onCanPlay={handleVideoReady}
          className="transition-opacity duration-500"
          style={{
            ...mediaStyle,
            opacity: videoReady ? 1 : 0,
          }}
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
        className="absolute top-4 right-4 md:top-3 md:right-3 text-xs text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ letterSpacing: "-0.035em" }}
      >
        {roleLabel}
      </span>

      {/* Title — bottom-left, pointer-events-none */}
      <div
        className="absolute bottom-4 left-4 md:bottom-3 md:left-3 flex flex-col text-xs text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
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
        className="absolute bottom-4 right-4 md:bottom-3 md:right-3 text-xs text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ letterSpacing: "-0.035em" }}
      >
        {projectTypeLabel}
      </span>
    </div>
  );
}
