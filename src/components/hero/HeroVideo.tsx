"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const desktopPosterSrc = "/posters/showreel4-handbrake.mp4.jpg?v=first-frame-1";
  const mobilePosterSrc = "/posters/showreel4-mobile-handbrake.mp4.jpg?v=first-frame-1";
  const mobileSrc = "/works/showreel4-mobile-handbrake.mp4";
  const desktopSrc = "/works/showreel4-handbrake.mp4";

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
  }, []);

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (video && video.currentTime > 0.05) {
      video.currentTime = 0;
    }
    video?.play().catch(() => {
      // Autoplay may be blocked until interaction; ignore.
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
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        onPlaying={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoReady ? 1 : 0,
        }}
      >
        <source src={mobileSrc} media="(max-width: 767px)" type="video/mp4" />
        <source src={desktopSrc} type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </div>
  );
}
