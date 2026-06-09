import { useNavigate } from "react-router-dom";
import { type Brand, sortBrandsWorstFirst } from "../lib/brands";
import { StatusBadge } from "./StatusBadge";
import { useDemoState } from "../lib/store";

function portfolioAvgForBrand(brand: Brand, allBrands: Brand[]): number {
  const others = allBrands.filter((b) => b.id !== brand.id && b.trade === brand.trade);
  const pool = others.length >= 2 ? others : allBrands.filter((b) => b.id !== brand.id);
  return Math.round(pool.reduce((s, b) => s + b.bookingRate, 0) / pool.length);
}

function fmtCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

export function BrandTable() {
  const { brands, filters } = useDemoState();
  const navigate = useNavigate();

  let filtered = brands;
  if (filters.trade) filtered = filtered.filter((b) => b.trade === filters.trade);
  if (filters.region) filtered = filtered.filter((b) => b.region === filters.region);
  if (filters.cohort) filtered = filtered.filter((b) => b.cohort === filters.cohort);
  if (filters.crm) filtered = filtered.filter((b) => b.crm === filters.crm);

  const sorted = sortBrandsWorstFirst(filtered);
  // allBrands (unfiltered) for portfolio-average calculation
  const allBrands = brands;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Brand</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Trade</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Region</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Booking Rate</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Recoverable Risk</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((brand) => (
            <BrandRow
              key={brand.id}
              brand={brand}
              allBrands={allBrands}
              onClick={() => navigate(`/brand/${brand.id}`)}
            />
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                No brands match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function BrandRow({ brand, allBrands, onClick }: { brand: Brand; allBrands: Brand[]; onClick: () => void }) {
  const portAvg = portfolioAvgForBrand(brand, allBrands);
  const vsPortfolio = brand.bookingRate - portAvg;

  return (
    <tr
      onClick={onClick}
      className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
        brand.status === "recovered" ? "opacity-60" : ""
      }`}
    >
      <td className="px-5 py-3.5 font-semibold text-gray-900">
        <div className="flex items-center gap-2">
          <TradeIcon trade={brand.trade} />
          {brand.name}
        </div>
      </td>
      <td className="px-4 py-3.5 text-gray-600">{brand.trade}</td>
      <td className="px-4 py-3.5 text-gray-600">{brand.region}</td>
      <td className="px-4 py-3.5">
        <div>
          <span className="font-semibold text-gray-900">{brand.bookingRate}%</span>
          {brand.status !== "ramping" && (
            <>
              <div className={`text-xs font-medium mt-0.5 ${brand.bookingTrend.delta < 0 ? "text-red-600" : brand.bookingTrend.delta > 0 ? "text-emerald-600" : "text-gray-400"}`}>
                {brand.bookingTrend.delta < 0 ? "↓" : brand.bookingTrend.delta > 0 ? "↑" : "→"}
                {brand.bookingTrend.delta !== 0 ? `${Math.abs(brand.bookingTrend.delta)} pts / ${brand.bookingTrend.weeks}wk` : `flat / ${brand.bookingTrend.weeks}wk`}
              </div>
              <div className={`text-[11px] mt-0.5 ${vsPortfolio < -3 ? "text-red-400" : "text-gray-400"}`}>
                portfolio avg: {portAvg}%{vsPortfolio !== 0 ? ` (${vsPortfolio > 0 ? "+" : ""}${vsPortfolio})` : ""}
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5">
        {brand.status === "ramping" ? (
          <span className="text-gray-400 text-xs">— ramping</span>
        ) : (
          <div>
            <span className={`font-semibold ${brand.recoverableAtRisk > 10000 ? "text-red-700" : "text-gray-700"}`}>
              {fmtCurrency(brand.recoverableAtRisk)}
            </span>
            {brand.recoverableAtRisk < brand.revenueAtRisk && (
              <span className="block text-[11px] text-gray-400">
                {fmtCurrency(brand.revenueAtRisk)} total
              </span>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3.5">
        <StatusBadge status={brand.status} />
      </td>
    </tr>
  );
}

function TradeIcon({ trade }: { trade: string }) {
  const colors: Record<string, string> = {
    HVAC: "bg-orange-100 text-orange-600",
    Plumbing: "bg-blue-100 text-blue-600",
    Electrical: "bg-yellow-100 text-yellow-600",
  };
  const letters: Record<string, string> = { HVAC: "H", Plumbing: "P", Electrical: "E" };
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${colors[trade] ?? "bg-gray-100 text-gray-600"}`}>
      {letters[trade] ?? "?"}
    </span>
  );
}
