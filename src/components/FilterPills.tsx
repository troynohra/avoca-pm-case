import { useEffect, useRef, useState } from "react";
import { useDemoState } from "../lib/store";

const OPTIONS: Record<string, string[]> = {
  trade: ["HVAC", "Plumbing", "Electrical"],
  region: ["Southwest", "Southeast", "Northeast", "Midwest"],
  crm: ["ServiceTitan", "Housecall Pro"],
};

const LABELS: Record<string, string> = {
  trade: "Trade",
  region: "Region",
  crm: "CRM",
};

type FilterKey = "trade" | "region" | "crm";

function FilterPill({
  filterKey,
  value,
  onSelect,
  onClear,
}: {
  filterKey: FilterKey;
  value: string | null;
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = LABELS[filterKey];
  const options = OPTIONS[filterKey];
  const hasValue = value !== null;

  return (
    <div className="relative" ref={ref}>
      {/* Pill button */}
      <button
        onClick={() => {
          if (hasValue) return; // clicking active pill's label does nothing; use X to clear
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all select-none ${
          hasValue
            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
        }`}
      >
        {/* chevron or label */}
        {!hasValue && (
          <svg className="w-3 h-3 opacity-50" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span>{hasValue ? value : label}</span>
        {hasValue && (
          <span
            role="button"
            aria-label={`Clear ${label} filter`}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-white/25 hover:bg-white/40 cursor-pointer transition-colors"
          >
            <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
              <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        )}
        {!hasValue && (
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            className="sr-only"
          />
        )}
      </button>

      {/* Dropdown */}
      {open && !hasValue && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[140px] bg-white border border-gray-200 rounded-xl shadow-lg py-1 animate-in">
          <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
            {label}
          </p>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FilterPills() {
  const { filters, setFilter, clearFilters } = useDemoState();
  const hasAny = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {(Object.keys(OPTIONS) as FilterKey[]).map((key) => (
        <FilterPill
          key={key}
          filterKey={key}
          value={filters[key] ?? null}
          onSelect={(v) => setFilter(key, v)}
          onClear={() => setFilter(key, null)}
        />
      ))}
      {hasAny && (
        <button
          onClick={clearFilters}
          className="px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
