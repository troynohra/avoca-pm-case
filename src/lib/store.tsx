import React, { createContext, useContext, useRef, useState } from "react";
import { type Brand, initialBrands } from "./brands";

export interface Filters {
  trade: string | null;
  region: string | null;
  cohort: string | null;
  crm: string | null;
}

interface DemoState {
  brands: Brand[];
  filters: Filters;
  recoveredThisWeek: number;
  recoverBrand: (id: string) => void;
  setFilter: (key: keyof Filters, value: string | null) => void;
  clearFilters: () => void;
}

const DemoContext = createContext<DemoState | null>(null);

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [filters, setFiltersState] = useState<Filters>({
    trade: null,
    region: null,
    cohort: null,
    crm: null,
  });
  const [recoveredThisWeek, setRecoveredThisWeek] = useState(0);
  const recoveredIdsRef = useRef<Set<string>>(new Set());

  const recoverBrand = (id: string) => {
    if (recoveredIdsRef.current.has(id)) return;
    recoveredIdsRef.current.add(id);
    setBrands((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status: "recovered" as const,
          bookingRate: Math.min(b.peerBenchmark - 2, b.bookingRate + 13),
          revenueAtRisk: Math.round(b.revenueAtRisk * 0.04),
          recoverableAtRisk: Math.round(b.recoverableAtRisk * 0.04),
        };
      })
    );
    setRecoveredThisWeek((n) => n + 1);
  };

  const setFilter = (key: keyof Filters, value: string | null) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFiltersState({ trade: null, region: null, cohort: null, crm: null });
  };

  return (
    <DemoContext.Provider
      value={{ brands, filters, recoveredThisWeek, recoverBrand, setFilter, clearFilters }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoState() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoState must be inside DemoStateProvider");
  return ctx;
}
