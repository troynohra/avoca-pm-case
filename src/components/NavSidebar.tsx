import { NavLink, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Calls", icon: "📞", href: "#" },
  { label: "Coach", icon: "🎯", href: "#" },
  { label: "Outbound", icon: "📤", href: "#" },
  { label: "Texts", icon: "💬", href: "#" },
  { label: "Web Chat", icon: "🌐", href: "#" },
];

const CONTROL_ITEMS = [
  { label: "Scheduling", icon: "📅", href: "#" },
  { label: "Integrations", icon: "🔗", href: "#" },
];

export function NavSidebar() {
  const location = useLocation();
  const isPortfolio = location.pathname === "/" || location.pathname.startsWith("/brand");

  return (
    <aside
      style={{ backgroundColor: "#0f1624" }}
      className="w-56 flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto"
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">Avoca</div>
            <div className="text-gray-400 text-xs truncate">Sunbelt Home Services</div>
          </div>
          <svg className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Portfolio section - highlighted */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Portfolio</p>
        <NavLink
          to="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            isPortfolio ? "bg-white/10 text-white font-semibold" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Overview
        </NavLink>
      </div>

      {/* Products */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Products</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => alert(`Opens ${item.label} (existing per-brand surface)`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
          >
            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {item.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Controls</p>
        {CONTROL_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => alert(`Opens ${item.label} (existing per-brand surface)`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
          >
            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {item.label}
          </button>
        ))}
      </div>

      {/* Administration */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider px-2 mb-1">Administration</p>
        {CONTROL_ITEMS.map((item) => (
          <button
            key={item.label + "-admin"}
            onClick={() => alert(`Opens Admin ${item.label}`)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
          >
            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {item.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
        <button
          onClick={() => alert("Support & Feedback")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
        >
          <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Support &amp; Feedback
        </button>
        <button
          onClick={() => alert("Refer a Friend — $500 credit")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-left"
        >
          <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
