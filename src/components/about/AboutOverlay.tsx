"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAbout } from "@/context/AboutContext";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { NameMarquee } from "@/components/ui/NameMarquee";
import { SocialLinks } from "@/components/ui/SocialLinks";

const ABOUT_PHOTOS = [
  { src: "/about/dima-about-main.jpg", alt: "Dima Melroz" },
  { src: "/about/dima-about-set-1.jpg", alt: "Dima Melroz on set" },
  { src: "/about/dima-about-set-2.jpg", alt: "Dima Melroz behind the camera" },
];

const PHOTO_SLIDE_VARIANTS = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export function AboutOverlay() {
  const { open, setOpen } = useAbout();
  const [mounted, setMounted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoDirection, setPhotoDirection] = useState(1);

  const showPreviousPhoto = () => {
    setPhotoDirection(-1);
    setCurrentPhotoIndex((index) =>
      (index + ABOUT_PHOTOS.length - 1) % ABOUT_PHOTOS.length
    );
  };
  const showNextPhoto = () => {
    setPhotoDirection(1);
    setCurrentPhotoIndex((index) => (index + 1) % ABOUT_PHOTOS.length);
  };

  useLockBodyScroll(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") showPreviousPhoto();
      if (e.key === "ArrowRight") showNextPhoto();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => {
      setPhotoDirection(1);
      setCurrentPhotoIndex((index) => (index + 1) % ABOUT_PHOTOS.length);
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [open, currentPhotoIndex]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="about-overlay"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-3xl overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="about-close-button absolute text-white/70 hover:text-white transition-opacity cursor-pointer border-none z-20"
            aria-label="Close about"
          >
            <X size={30} />
          </button>

          <div className="about-marquee" onClick={(e) => e.stopPropagation()}>
            <NameMarquee
              fontSize="clamp(42px, 7.4vw, 104px)"
              paddingTop="0"
              paddingBottom="0"
              speed={46}
            />
          </div>

          {/* Content */}
          <div
            className="about-container max-w-7xl mx-auto px-8 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              .about-close-button {
                top: clamp(116px, 12vw, 168px);
                right: 24px;
                width: 34px;
                height: 34px;
                border-radius: 999px;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .about-marquee {
                width: 100%;
                overflow: hidden;
                padding-top: 4px;
                margin-bottom: 10px;
              }
              .about-photo-frame {
                height: min(68vh, 680px);
              }
              .about-copy {
                color: rgba(245,247,250,0.82);
                font-size: 1rem;
                line-height: 1.65;
                letter-spacing: -0.035em;
              }
              .about-copy p {
                margin-bottom: 18px;
              }
              .about-copy p:last-child {
                margin-bottom: 0;
              }
              .about-copy strong {
                color: rgba(255,255,255,0.96);
                font-weight: 600;
              }
              @media (max-width: 767px) {
                .about-spacer { display: none !important; }
                .about-container { padding-top: 0 !important; padding-bottom: 32px !important; }
                .about-marquee { padding-top: 10px !important; margin-bottom: 10px !important; }
                .about-close-button { top: 72px !important; right: 18px !important; width: 34px !important; height: 34px !important; }
                .about-photo-frame { height: auto !important; }
                .about-row { gap: 20px !important; }
              }
            `}</style>
            {/* Two-column row */}
            <div
              className="about-row flex flex-col md:flex-row"
              style={{ gap: 56, alignItems: "stretch" }}
            >
              {/* Left column: heading + photo slider */}
              <div style={{ flexShrink: 0, width: "100%", maxWidth: 560 }}>
                <div
                  className="about-photo-frame"
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 560,
                    aspectRatio: "4/5",
                    overflow: "hidden",
                  }}
                >
                  <AnimatePresence initial={false} custom={photoDirection}>
                    <motion.img
                      key={ABOUT_PHOTOS[currentPhotoIndex].src}
                      src={ABOUT_PHOTOS[currentPhotoIndex].src}
                      alt={ABOUT_PHOTOS[currentPhotoIndex].alt}
                      custom={photoDirection}
                      variants={PHOTO_SLIDE_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    />
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={showPreviousPhoto}
                    aria-label="Previous about photo"
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      border: 0,
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextPhoto}
                    aria-label="Next about photo"
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      border: 0,
                      background: "rgba(0,0,0,0.35)",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      padding: "4px 7px",
                      borderRadius: 999,
                      background: "rgba(0,0,0,0.35)",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 11,
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {currentPhotoIndex + 1} / {ABOUT_PHOTOS.length}
                  </div>
                </div>
              </div>

              {/* Right column: invisible spacer → bio → contacts pinned to bottom */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 600 }}>
                {/* Bio */}
                <div className="about-copy">
                  <p>
                    привет, я <strong>Дима Melroz</strong> – режиссёр,
                    креативный продюсер. уже 7 лет <strong>снимаю рекламу,
                    клипы, шоу и бренд-контент</strong>. базируюсь в Москве,
                    но работаю по всей России.
                  </p>
                  <p>
                    мне интересно соединять <strong>яркую визуальную эстетику</strong>{" "}
                    с точной <strong>формой, ритмом и интонацией</strong>{" "}
                    проекта – чтобы видео работало на идею и зрительское
                    вовлечение.
                  </p>
                  <p>
                    у меня высшее <strong>образование в маркетинге</strong> и
                    дополнительное <strong>обучение во ВГИКе</strong> по
                    направлению «второй режиссёр». это помогает мне лучше
                    понимать <strong>задачи бренда, продакшена и команды.</strong>
                  </p>
                  <p>
                    открыт к диалогу, экспериментам и поиску сильных решений
                    вместе с командой!
                  </p>
                </div>

                {/* Contacts pinned to bottom of column */}
                <div
                  className="flex flex-wrap"
                  style={{ marginTop: "auto", paddingTop: 32 }}
                >
                  <SocialLinks size={26} gap={24} tone="about" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
