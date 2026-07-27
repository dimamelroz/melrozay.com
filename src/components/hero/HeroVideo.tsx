"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrcRef = useRef<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showPlayHint, setShowPlayHint] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const desktopPosterSrc = "/posters/showreel4-handbrake.mp4.jpg?v=first-frame-2";
  const mobilePosterSrc = "/posters/showreel4-mobile-handbrake.mp4.jpg?v=first-frame-2";
  const mobileSrc = "/works/showreel4-mobile-handbrake.mp4?v=mobile-2";
  const desktopSrc = "/works/showreel4-handbrake.mp4?v=desktop-2";

  useEffect(() => {
    const pickVideoSrc = () => {
      const isMobile =
        window.matchMedia("(max-width: 767px)").matches ||
        window.innerWidth <= 767 ||
        /Android|iPhone|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const nextSrc = isMobile ? mobileSrc : desktopSrc;
      if (videoSrcRef.current !== nextSrc) {
        videoSrcRef.current = nextSrc;
        setVideoReady(false);
        setShowPlayHint(false);
        setVideoSrc(nextSrc);
      }
    };

    pickVideoSrc();
    window.addEventListener("resize", pickVideoSrc);
    window.addEventListener("orientationchange", pickVideoSrc);
    return () => {
      window.removeEventListener("resize", pickVideoSrc);
      window.removeEventListener("orientationchange", pickVideoSrc);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay may be blocked until interaction; ignore.
      });
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    window.addEventListener("pageshow", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);
    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("touchstart", tryPlay);
    return () => {
      v.removeEventListener("canplay", tryPlay);
      window.removeEventListener("pageshow", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
  }, [videoSrc]);

  useEffect(() => {
    if (!videoSrc || videoReady) {
      setShowPlayHint(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setShowPlayHint(true);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [videoReady, videoSrc]);

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 0.05) {
      video.currentTime = 0;
    }
    video?.play().catch(() => {
      // Autoplay may be blocked until interaction; ignore.
    });
  };

  const handlePlayHintClick = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Safari may still block playback until it accepts the gesture.
    });
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <picture>
        <source srcSet={mobilePosterSrc} media="(max-width: 767px)" />
        <img
          src={desktopPosterSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>
      {videoSrc ? (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onLoadedData={handleVideoReady}
          onCanPlay={handleVideoReady}
          onPlaying={() => setVideoReady(true)}
          className="background-video absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: videoReady ? 1 : 0,
          }}
        />
      ) : null}
      {showPlayHint && !videoReady ? (
        <button
          type="button"
          aria-label="play showreel"
          onClick={handlePlayHintClick}
          className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-white opacity-90 pointer-events-auto"
        >
          <span
            aria-hidden="true"
            style={{
              width: 0,
              height: 0,
              borderTop: "16px solid transparent",
              borderBottom: "16px solid transparent",
              borderLeft: "24px solid currentColor",
              transform: "translateX(4px)",
            }}
          />
        </button>
      ) : null}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </div>
  );
}
