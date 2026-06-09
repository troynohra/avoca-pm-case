import { useParams, useNavigate } from "react-router-dom";
import { useDemoState } from "../lib/store";
import type { Brand } from "../lib/brands";

function portfolioAvgForBrand(brand: Brand, allBrands: Brand[]): number {
  const others = allBrands.filter((b) => b.id !== brand.id && b.trade === brand.trade);
  const pool = others.length >= 2 ? others : allBrands.filter((b) => b.id !== brand.id);
  return Math.round(pool.reduce((s, b) => s + b.bookingRate, 0) / pool.length);
}
import { MetricTile } from "../components/MetricTile";
import { StatusBadge } from "../components/StatusBadge";
import { RecommendationCard } from "../components/RecommendationCard";

function fmtCurrency(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k`;
  return `$${n}`;
}

export function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const { brands } = useDemoState();
  const navigate = useNavigate();

  const brand = brands.find((b) => b.id === id);
  const portAvg = brand ? portfolioAvgForBrand(brand, brands) : 0;
  if (!brand) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Brand not found.</p>
          <button onClick={() => navigate("/")} className="text-blue-600 hover:underline text-sm">
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const vsPortfolio = brand.bookingRate - portAvg;
  const maxPct = Math.max(...brand.topUnbookedReasons.flatMap((r) => [r.brandPct, r.peerPct]), 40);

  // Derive recommendation from top recoverable outlier (largest positive gap over peer)
  const topRecoverable = [...brand.topUnbookedReasons]
    .filter((r) => r.recoverable)
    .sort((a, b) => (b.brandPct - b.peerPct) - (a.brandPct - a.peerPct))[0];
  const hasFix = topRecoverable && (topRecoverable.brandPct - topRecoverable.peerPct) > 2;

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Portfolio
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">{brand.name.toUpperCase().split(" ")[0]}</span>{" "}
              <span className="text-gray-300">{brand.name.toUpperCase().split(" ").slice(1).join(" ")}</span>
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {[brand.trade, brand.region, `Cohort ${brand.cohort}`, brand.crm].map((chip) => (
                <span key={chip} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <StatusBadge status={brand.status} />
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Metric tiles */}
        <div className="grid grid-cols-4 gap-4">
          <MetricTile
            label="Booking Rate"
            value={`${brand.bookingRate}%`}
            trend={brand.bookingTrend.delta < 0 ? "down" : brand.bookingTrend.delta > 0 ? "up" : "neutral"}
            trendLabel={
              brand.bookingTrend.delta !== 0
                ? `${brand.bookingTrend.delta > 0 ? "↑" : "↓"}${Math.abs(brand.bookingTrend.delta)} pts / ${brand.bookingTrend.weeks}wk · portfolio avg ${portAvg}% (${vsPortfolio >= 0 ? "+" : ""}${vsPortfolio})`
                : `Flat / ${brand.bookingTrend.weeks}wk · portfolio avg ${portAvg}%`
            }
          />
          <MetricTile
            label="Containment"
            value={`${brand.containment}%`}
            sub="Calls resolved without transfer"
          />
          <MetricTile
            label="Transfer Rate"
            value={`${brand.transferRate}%`}
            trend={brand.transferRate > 35 ? "down" : "neutral"}
            trendLabel={brand.transferRate > 35 ? "High — watch" : "Within range"}
          />
          <MetricTile
            label="Recoverable at Risk"
            value={fmtCurrency(brand.recoverableAtRisk)}
            trend={brand.recoverableAtRisk > 10000 ? "down" : "neutral"}
            trendLabel={`of ${fmtCurrency(brand.revenueAtRisk)} total · fixable via config`}
          />
        </div>

        {/* Why section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-base mb-1">Why is this brand flagged?</h2>
          <p className="text-sm text-gray-500 mb-5">Top unbooked reasons vs peer set for same trade &amp; region.</p>

          <div className="space-y-5 mb-6">
            {brand.topUnbookedReasons.map((reason, i) => {
              const gap = reason.brandPct - reason.peerPct;
              const isOutlier = reason.recoverable && gap > 2;
              const isTopFix = topRecoverable?.label === reason.label && hasFix;
              return (
                <div key={i} className={`rounded-lg p-3 -mx-1 ${isTopFix ? "bg-red-50 border border-red-100" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${isOutlier ? "text-red-700" : "text-gray-800"}`}>
                        {reason.label}
                      </span>
                      {isTopFix && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wide">
                          Top fix
                        </span>
                      )}
                      {!reason.recoverable ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200">
                          Structural
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                          {reason.lever}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isOutlier && (
                        <span className="text-xs font-bold text-red-600">
                          +{gap}pp · {(reason.brandPct / reason.peerPct).toFixed(1)}×
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand bar */}
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[10px] text-gray-400 w-20 flex-shrink-0">This brand</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 relative overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full rounded-full ${
                          isOutlier ? "bg-red-500" : reason.recoverable ? "bg-blue-400" : "bg-gray-300"
                        }`}
                        style={{ width: `${(reason.brandPct / maxPct) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold w-8 text-right ${isOutlier ? "text-red-600" : "text-gray-600"}`}>
                      {reason.brandPct}%
                    </span>
                  </div>
                  {/* Peer bar */}
                  <div className="flex gap-1.5 items-center mt-1">
                    <span className="text-[10px] text-gray-400 w-20 flex-shrink-0">Portfolio avg</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 relative overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gray-400"
                        style={{ width: `${(reason.peerPct / maxPct) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 w-8 text-right">{reason.peerPct}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drop-off stage */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Drop-off stage</h3>
            <div className="flex items-center gap-2">
              {["Initial contact", "Qualification", "Quote stage", "Scheduling", "After-hours routing", "Booking"].map((stage) => {
                const isDropOff = brand.dropOffStage.toLowerCase().includes(stage.toLowerCase().split(" ")[0]);
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                        isDropOff
                          ? "bg-red-100 text-red-700 border-2 border-red-300 font-semibold"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {stage}
                      {isDropOff && <span className="ml-1">&#9888;</span>}
                    </div>
                    {stage !== "Booking" && (
                      <svg className="w-3 h-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        {brand.status !== "recovered" && hasFix && (
          <RecommendationCard
            brandId={brand.id}
            summary={brand.recommendation.summary}
            peerName={brand.recommendation.peerName}
            fixLabel={topRecoverable?.lever ?? brand.recommendation.fixLabel}
          />
        )}
        {brand.status === "recovered" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-800">Recovery in progress</p>
              <p className="text-sm text-emerald-600">Config change applied. Monitoring for booking rate improvement.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
