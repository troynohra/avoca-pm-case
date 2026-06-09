interface Props {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
}

export function MetricTile({ label, value, sub, highlight, trend, trendLabel }: Props) {
  return (
    <div
      className={`rounded-xl border p-5 flex flex-col gap-2 ${
        highlight
          ? "border-blue-200 bg-blue-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      <span className={`text-3xl font-bold leading-none ${highlight ? "text-blue-700" : "text-gray-900"}`}>
        {value}
      </span>
      {(trendLabel || sub) && (
        <div className="flex items-center gap-1.5">
          {trend === "up" && (
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          )}
          {trend === "down" && (
            <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
          <span className={`text-xs ${trend === "up" ? "text-emerald-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
            {trendLabel || sub}
          </span>
        </div>
      )}
    </div>
  );
}
