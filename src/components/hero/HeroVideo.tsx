"use client";

export function HeroVideo() {
  return (
    // pointer-events-none so nothing above is blocked (Rule 5)
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {/* TODO: replace with <video src="/hero.mp4" autoPlay muted loop playsInline> when ready */}
      <img
        src="/placeholder/hero-poster.svg"
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}
