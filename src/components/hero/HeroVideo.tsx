"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const posterSrc = "/posters/showreel4-handbrake.mp4.jpg?v=first-frame-1";

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
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!videoReady && video && video.currentTime > 0.05) {
      video.currentTime = 0;
    }
    setVideoReady(true);
    video?.play().catch(() => {
      // Autoplay may be blocked until interaction; ignore.
    });
  };

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <img
        src={posterSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <video
        ref={videoRef}
        src="/works/showreel4-handbrake.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={posterSrc}
        onLoadedData={handleVideoReady}
        onCanPlay={handleVideoReady}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: videoReady ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </div>
  );
}
