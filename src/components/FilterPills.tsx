import { useDemoState } from "../lib/store";

const TRADES = ["HVAC", "Plumbing", "Electrical"];
const REGIONS = ["Southwest", "Southeast", "Northeast", "Midwest"];
const COHORTS = ["2023", "2024", "2025"];
const CRMS = ["ServiceTitan", "Housecall Pro"];

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  );
}

export function FilterPills() {
  const { filters, setFilter, clearFilters } = useDemoState();
  const hasAny = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Trade</span>
      {TRADES.map((t) => (
        <Pill
          key={t}
          label={t}
          active={filters.trade === t}
          onClick={() => setFilter("trade", filters.trade === t ? null : t)}
        />
      ))}
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mx-1">Region</span>
      {REGIONS.map((r) => (
        <Pill
          key={r}
          label={r}
          active={filters.region === r}
          onClick={() => setFilter("region", filters.region === r ? null : r)}
        />
      ))}
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mx-1">Cohort</span>
      {COHORTS.map((c) => (
        <Pill
          key={c}
          label={c}
          active={filters.cohort === c}
          onClick={() => setFilter("cohort", filters.cohort === c ? null : c)}
        />
      ))}
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mx-1">CRM</span>
      {CRMS.map((c) => (
        <Pill
          key={c}
          label={c}
          active={filters.crm === c}
          onClick={() => setFilter("crm", filters.crm === c ? null : c)}
        />
      ))}
      {hasAny && (
        <button
          onClick={clearFilters}
          className="ml-2 px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
