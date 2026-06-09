import { useNavigate } from "react-router-dom";
import { useDemoState } from "../lib/store";
import type { Brand, ProductStatus } from "../lib/brands";

type ProductKey = "responder" | "coach" | "outbound" | "speedToLead";

const PRODUCTS: ProductKey[] = ["responder", "coach", "outbound", "speedToLead"];

const PRODUCT_LABELS: Record<ProductKey, string> = {
  responder: "Responder",
  coach: "Coach",
  outbound: "Outbound",
  speedToLead: "Speed-to-Lead",
};

function isStuck(brand: Brand): boolean {
  return PRODUCTS.some((p) => brand.products[p].purchased && !brand.products[p].live);
}

function stuckCount(brand: Brand): number {
  return PRODUCTS.filter((p) => brand.products[p].purchased && !brand.products[p].live).length;
}

function sortRolloutBrands(brands: Brand[]): Brand[] {
  return [...brands].sort((a, b) => {
    const aStuck = isStuck(a);
    const bStuck = isStuck(b);
    if (aStuck && !bStuck) return -1;
    if (!aStuck && bStuck) return 1;
    if (aStuck && bStuck) return stuckCount(b) - stuckCount(a);
    return a.name.localeCompare(b.name);
  });
}

function ProductCell({ status }: { status: ProductStatus }) {
  if (status.live) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        Live
      </span>
    );
  }
  if (status.purchased && status.setupDone > 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {status.setupDone}/{status.setupTotal}
      </span>
    );
  }
  if (status.purchased) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Purchased
      </span>
    );
  }
  return <span className="text-gray-300 text-sm font-medium select-none">—</span>;
}

function TradeChip({ trade }: { trade: string }) {
  const cfg: Record<string, string> = {
    HVAC: "bg-orange-100 text-orange-700",
    Plumbing: "bg-blue-100 text-blue-700",
    Electrical: "bg-yellow-100 text-yellow-700",
  };
  const letter: Record<string, string> = { HVAC: "H", Plumbing: "P", Electrical: "E" };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold flex-shrink-0 ${cfg[trade] ?? "bg-gray-100 text-gray-600"}`}>
      {letter[trade] ?? "?"}
    </span>
  );
}

export function Rollout() {
  const { brands } = useDemoState();
  const navigate = useNavigate();
  const total = brands.length;

  const liveCount = (key: ProductKey) => brands.filter((b) => b.products[key].live).length;
  const sorted = sortRolloutBrands(brands);

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">PORTFOLIO</span>{" "}
              <span className="text-gray-300">ROLLOUT</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Sunbelt Home Services · Implementation status across all brands</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Summary strip */}
        <div className="grid grid-cols-4 gap-4">
          {PRODUCTS.map((key) => {
            const live = liveCount(key);
            const purchased = brands.filter((b) => b.products[key].purchased).length;
            const inSetup = brands.filter(
              (b) => b.products[key].purchased && !b.products[key].live
            ).length;
            return (
              <div key={key} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{PRODUCT_LABELS[key]}</p>
                <p className="text-2xl font-black text-gray-900">
                  {live}
                  <span className="text-gray-300 font-bold">/{total}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">live</p>
                {inSetup > 0 && (
                  <p className="text-xs text-amber-600 font-medium mt-2">
                    {inSetup} in setup · {purchased - live} not live
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Matrix table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-48">
                  Brand
                </th>
                {PRODUCTS.map((key) => (
                  <th key={key} className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    {PRODUCT_LABELS[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((brand, i) => {
                const stuck = isStuck(brand);
                return (
                  <tr
                    key={brand.id}
                    onClick={() => navigate(`/brand/${brand.id}/rollout`)}
                    className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${
                      i === sorted.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <TradeChip trade={brand.trade} />
                        <span className={`font-medium truncate ${stuck ? "text-gray-900" : "text-gray-500"}`}>
                          {brand.name}
                        </span>
                        {stuck && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        )}
                      </div>
                    </td>
                    {PRODUCTS.map((key) => (
                      <td key={key} className="px-4 py-3.5 text-center">
                        <ProductCell status={brand.products[key]} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">Live</span>
            Active and live
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">3/5</span>
            In setup — steps done/total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">Purchased</span>
            Purchased, setup not started
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-gray-300 font-medium">—</span>
            Not purchased
          </span>
        </div>
      </div>
    </div>
  );
}
