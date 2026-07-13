"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { Plus } from "lucide-react";
import { useFilter } from "@/context/FilterContext";
import { useAbout } from "@/context/AboutContext";
import { MobileMenu } from "./MobileMenu";

const FILTERS = [
  { id: "all" as const, label: "all" },
  { id: "commercial" as const, label: "commercial" },
  { id: "music-video" as const, label: "music video" },
];

export function Header() {
  const pathname = usePathname();
  const { activeFilter, setActiveFilter } = useFilter();
  const { setOpen: setAboutOpen } = useAbout();
  const [menuOpen, setMenuOpen] = useState(false);

  const isWorks = pathname === "/works" || pathname === "/works/";

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between"
        style={{
          height: "var(--header-height)",
          paddingLeft: "clamp(16px, 3vw, 24px)",
          paddingRight: "clamp(16px, 3vw, 24px)",
        }}
      >
        {/* Brand name */}
        <Link
          href="/"
          className="text-white font-bold no-underline"
          style={{ fontSize: "clamp(20px, 2.5vw, 24px)", letterSpacing: "-0.04em" }}
        >
          Dima Melroz
        </Link>

        {/* Filter segmented control — absolutely centered, desktop only, /works only */}
        {isWorks && (
          <LayoutGroup id="filter">
            <motion.div
              initial={{ x: "-50%", y: "calc(-50% - 24px)", opacity: 0 }}
              animate={{ x: "-50%", y: "-50%", opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:flex items-center"
              style={{ position: "absolute", left: "50%", top: "50%" }}
            >
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
                    requestAnimationFrame(() => setActiveFilter(f.id));
                  }}
                  className="relative cursor-pointer bg-transparent border-none"
                  style={{ padding: "2px 6px" }}
                >
                  {activeFilter === f.id && (
                    <motion.div
                      layoutId="filter-indicator"
                      layout="position"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "white",
                      }}
                    />
                  )}
                  <span
                    className="relative"
                    style={{
                      zIndex: 1,
                      fontSize: "14px",
                      lineHeight: 1,
                      display: "block",
                      letterSpacing: "-0.035em",
                      color: activeFilter === f.id ? "black" : "white",
                      fontWeight: 700,
                      transition: "color 150ms",
                    }}
                  >
                    {f.label}
                  </span>
                </button>
              ))}
            </motion.div>
          </LayoutGroup>
        )}

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* About button — desktop only */}
          <button
            onClick={() => setAboutOpen(true)}
            className="hidden md:inline-block cursor-pointer bg-transparent border-none text-white hover:text-white transition-colors"
            style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.035em" }}
          >
            about
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden cursor-pointer bg-transparent border-none text-white p-1"
            aria-label="Open menu"
            style={{ lineHeight: 0 }}
          >
            <Plus size={32} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
