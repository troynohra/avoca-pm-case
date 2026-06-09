import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDemoState } from "../lib/store";

const NAV_ITEMS = ["Calls", "Coach", "Outbound", "Texts", "Web Chat"];
const CONTROL_ITEMS = ["Scheduling", "Integrations"];

function TradeChip({ trade }: { trade: string }) {
  const cfg: Record<string, string> = {
    HVAC: "bg-orange-500/20 text-orange-300",
    Plumbing: "bg-blue-500/20 text-blue-300",
    Electrical: "bg-yellow-500/20 text-yellow-300",
  };
  const letter: Record<string, string> = { HVAC: "H", Plumbing: "P", Electrical: "E" };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold flex-shrink-0 ${cfg[trade] ?? "bg-white/10 text-white/60"}`}>
      {letter[trade] ?? "?"}
    </span>
  );
}

export function NavSidebar() {
  const [open, setOpen] = useState(false);
  const { brands } = useDemoState();
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef = useRef<HTMLDivElement>(null);

  // Derive active context from URL
  const parts = location.pathname.split("/");
  const activeBrandId = parts[1] === "brand" ? parts[2] : null;
  const activeBrand = activeBrandId ? brands.find((b) => b.id === activeBrandId) : null;
  const contextLabel = activeBrand ? activeBrand.name : "Portfolio Overview";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside
      style={{ backgroundColor: "#0f1624" }}
      className="w-56 flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto"
    >
      {/* ── Portfolio / brand switcher ────────────────────────────────── */}
      <div className="px-3 py-3 border-b border-white/10 relative" ref={dropRef}>
        <div className="px-2 pt-1 pb-0.5">
          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
            Sunbelt Home Services
          </span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">A</span>
          </div>
          <span className="flex-1 text-left text-white text-sm font-semibold truncate">
            {contextLabel}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-gray-500 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute left-3 right-3 mt-1 rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden"
            style={{ backgroundColor: "#1a2535", top: "100%" }}
          >
            {/* Portfolio Overview — pinned */}
            <button
              onClick={() => { navigate("/"); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left transition-colors ${
                !activeBrandId
                  ? "bg-white/10 text-white font-semibold"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4 opacity-70 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="flex-1 truncate">Portfolio Overview</span>
              {!activeBrandId && (
                <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            <div className="border-t border-white/10" />

            {/* Brand list — scrollable */}
            <div className="max-h-64 overflow-y-auto">
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { navigate(`/brand/${b.id}`); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${
                    activeBrandId === b.id
                      ? "bg-white/10 text-white font-semibold"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <TradeChip trade={b.trade} />
                  <span className="flex-1 truncate">{b.name}</span>
                  {b.status === "slipping" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  )}
                  {b.status === "ramping" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  )}
                  {activeBrandId === b.id && (
                    <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Products ───────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Products</p>
        {NAV_ITEMS.map((label) => (
          <button
            key={label}
            onClick={() => alert(`Opens ${label} (existing per-brand surface)`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
          >
            <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {label}
          </button>
        ))}
      </div>

      {/* ── Controls ───────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Controls</p>
        {CONTROL_ITEMS.map((label) => (
          <button
            key={label}
            onClick={() => alert(`Opens ${label}`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
          >
            <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {label}
          </button>
        ))}
      </div>

      {/* ── Administration ─────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Administration</p>
        {CONTROL_ITEMS.map((label) => (
          <button
            key={label + "-admin"}
            onClick={() => alert(`Opens Admin ${label}`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
          >
            <svg className="w-4 h-4 opacity-50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* ── Bottom ─────────────────────────────────────────────────────── */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
        <button
          onClick={() => alert("Support & Feedback")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
        >
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Support &amp; Feedback
        </button>
        <button
          onClick={() => alert("Refer a Friend — $500 credit")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
        >
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
          </svg>
          Refer a Friend
          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white">$500</span>
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-medium truncate">Steven Shepsy</div>
            <div className="text-gray-400 text-[10px] truncate">Owner</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
