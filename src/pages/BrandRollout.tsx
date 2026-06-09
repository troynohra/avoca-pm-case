import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDemoState } from "../lib/store";
import type { ProductStatus } from "../lib/brands";

type ProductKey = "responder" | "coach" | "outbound" | "speedToLead";

const PRODUCTS: ProductKey[] = ["responder", "coach", "outbound", "speedToLead"];

const PRODUCT_LABELS: Record<ProductKey, string> = {
  responder: "Responder",
  coach: "Coach",
  outbound: "Outbound",
  speedToLead: "Speed-to-Lead",
};

const PRODUCT_DESCRIPTIONS: Record<ProductKey, string> = {
  responder: "AI-powered inbound call answering & booking",
  coach: "Real-time agent coaching and quality scoring",
  outbound: "Automated outbound follow-up and win-back",
  speedToLead: "Instant lead response and qualification",
};

const SETUP_STEPS = [
  "Integration connected",
  "Knowledge base configured",
  "Call flows built",
  "Test calls passed",
  "Go-live approved",
];

type ProductsState = Record<ProductKey, ProductStatus>;

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
        disabled ? "cursor-default opacity-40" : "cursor-pointer"
      } ${checked ? "bg-blue-500" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function StatusPill({ status }: { status: ProductStatus }) {
  if (status.live) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Live
      </span>
    );
  }
  if (status.purchased && status.setupDone > 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        In Setup · {status.setupDone}/{status.setupTotal}
      </span>
    );
  }
  if (status.purchased) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Not Started
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
      Not Purchased
    </span>
  );
}

function ProductCard({
  productKey,
  status,
  onTogglePurchased,
  onToggleLive,
}: {
  productKey: ProductKey;
  status: ProductStatus;
  onTogglePurchased: () => void;
  onToggleLive: () => void;
}) {
  const progressPct = status.setupTotal > 0 ? (status.setupDone / status.setupTotal) * 100 : 0;

  return (
    <div className={`bg-white border rounded-xl p-5 ${status.live ? "border-emerald-200" : status.purchased ? "border-amber-200" : "border-gray-200"}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base">{PRODUCT_LABELS[productKey]}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{PRODUCT_DESCRIPTIONS[productKey]}</p>
        </div>
        <StatusPill status={status} />
      </div>

      {/* Toggles */}
      <div className="space-y-3 py-3 border-t border-b border-gray-100 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 font-medium">Purchased</span>
          <Toggle checked={status.purchased} onChange={onTogglePurchased} />
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${status.purchased ? "text-gray-700" : "text-gray-300"}`}>Live</span>
          <Toggle
            checked={status.live}
            onChange={onToggleLive}
            disabled={!status.purchased}
          />
        </div>
      </div>

      {/* Setup checklist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Setup Checklist</span>
          <span className={`text-xs font-semibold ${status.live ? "text-emerald-600" : status.purchased ? "text-amber-600" : "text-gray-300"}`}>
            {status.setupDone}/{status.setupTotal}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              status.live ? "bg-emerald-500" : status.setupDone > 0 ? "bg-amber-400" : "bg-gray-200"
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps */}
        <ul className="space-y-1.5">
          {SETUP_STEPS.map((step, i) => {
            const done = i < status.setupDone;
            return (
              <li key={step} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  done ? (status.live ? "bg-emerald-500" : "bg-amber-400") : "bg-gray-100"
                }`}>
                  {done && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs ${done ? "text-gray-700" : "text-gray-300"}`}>{step}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function BrandRollout() {
  const { id } = useParams<{ id: string }>();
  const { brands } = useDemoState();
  const navigate = useNavigate();

  const brand = brands.find((b) => b.id === id);

  const [products, setProducts] = useState<ProductsState>(() => {
    if (!brand) return {} as ProductsState;
    return { ...brand.products };
  });

  if (!brand) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Brand not found.</p>
          <button onClick={() => navigate("/rollout")} className="text-blue-600 hover:underline text-sm">
            Back to Rollout
          </button>
        </div>
      </div>
    );
  }

  function togglePurchased(key: ProductKey) {
    setProducts((prev) => {
      const cur = prev[key];
      const nowPurchased = !cur.purchased;
      return {
        ...prev,
        [key]: {
          ...cur,
          purchased: nowPurchased,
          // un-purchasing resets live + setup
          live: nowPurchased ? cur.live : false,
          setupDone: nowPurchased ? cur.setupDone : 0,
        },
      };
    });
  }

  function toggleLive(key: ProductKey) {
    setProducts((prev) => {
      const cur = prev[key];
      if (!cur.purchased) return prev;
      const nowLive = !cur.live;
      return {
        ...prev,
        [key]: {
          ...cur,
          live: nowLive,
          // going live completes setup; un-going-live keeps progress
          setupDone: nowLive ? cur.setupTotal : cur.setupDone,
        },
      };
    });
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/rollout")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Rollout
          </button>
          <button
            onClick={() => alert(`Switch to ${brand.name} workspace`)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Open {brand.name} workspace
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
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
      </div>

      <div className="px-8 py-6">
        <div className="mb-5">
          <h2 className="font-bold text-gray-900 text-base">Implementation Checklist</h2>
          <p className="text-sm text-gray-500 mt-0.5">Product rollout status for this brand. Toggles update locally for demo purposes.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map((key) => (
            <ProductCard
              key={key}
              productKey={key}
              status={products[key]}
              onTogglePurchased={() => togglePurchased(key)}
              onToggleLive={() => toggleLive(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
