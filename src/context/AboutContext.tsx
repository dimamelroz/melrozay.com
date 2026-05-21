"use client";

import { createContext, useContext, useState } from "react";

interface AboutContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AboutContext = createContext<AboutContextValue | null>(null);

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <AboutContext.Provider value={{ open, setOpen }}>
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout(): AboutContextValue {
  const ctx = useContext(AboutContext);
  if (!ctx) throw new Error("useAbout must be used inside AboutProvider");
  return ctx;
}
