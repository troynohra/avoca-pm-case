import { useDemoState } from "../lib/store";
import { MetricTile } from "../components/MetricTile";
import { FilterPills } from "../components/FilterPills";
import { BrandTable } from "../components/BrandTable";

function fmtCurrency(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}

export function Portfolio() {
  const { brands } = useDemoState();

  const totalBooked = brands.reduce((s, b) => s + b.revenueBooked, 0);
  const totalAtRisk = brands.reduce((s, b) => s + b.revenueAtRisk, 0);
  const totalRecoverable = brands.reduce((s, b) => s + b.recoverableAtRisk, 0);
  const brandsLive = brands.length;
  const brandsFlagged = brands.filter((b) => b.status === "slipping").length;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">PORTFOLIO</span>{" "}
              <span className="text-gray-300">OVERVIEW</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Sunbelt Home Services · 14 brands · All regions</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">MTD · Jun 2026</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI strip — 4 tiles */}
        <div className="grid grid-cols-4 gap-4">
          <MetricTile
            label="Portfolio Booked"
            value={fmtCurrency(totalBooked)}
            trend="up"
            trendLabel="4.3% vs last month"
          />
          <MetricTile
            label="Recoverable at Risk"
            value={fmtCurrency(totalRecoverable)}
            highlight
            trend={totalRecoverable > 50000 ? "down" : "neutral"}
            trendLabel={`of ${fmtCurrency(totalAtRisk)} total · fixable via config`}
          />
          <MetricTile
            label="Brands Live"
            value={brandsLive}
            sub="Across all regions"
          />
          <MetricTile
            label="Brands Flagged"
            value={brandsFlagged}
            trend={brandsFlagged > 0 ? "down" : "neutral"}
            trendLabel={brandsFlagged > 0 ? `${brandsFlagged} need attention` : "All clear"}
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <FilterPills />
        </div>

        {/* Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">All Brands — Worst First</h2>
            <span className="text-xs text-gray-400">Sorted by recoverable revenue at risk</span>
          </div>
          <BrandTable />
        </div>
      </div>
    </div>
  );
}
