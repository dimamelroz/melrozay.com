"use client";

import { createContext, useContext, useState } from "react";
import type { FilterGroup } from "@/types/work";

type ActiveFilter = "all" | FilterGroup;

interface FilterContextValue {
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  return (
    <FilterContext.Provider value={{ activeFilter, setActiveFilter }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used inside FilterProvider");
  return ctx;
}
