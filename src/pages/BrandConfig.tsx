import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDemoState } from "../lib/store";
import { ConfigSection } from "../components/ConfigSection";
import { Toast } from "../components/Toast";

const WEAK_HANDLING = `When a customer mentions price concerns, acknowledge the concern and transition to scheduling:

"I understand cost is a consideration. Let me get a technician scheduled to give you an accurate quote based on your specific situation."

[Then proceed to scheduling.]`;

const PEER_HANDLING = `When a customer mentions price concerns, validate and offer value anchoring before scheduling:

"Totally understand — and we actually find that most customers are surprised by how affordable it ends up being once we assess the job. Our technicians are upfront about pricing, and there's no commitment until you approve the quote. The best way to get you an accurate number is to have someone take a look. I have [TIME] available — does that work for you?"

[Use urgency and social proof: "Most of our customers in your area book within the week because our schedules fill up fast."]

[Offer financing mention if hesitation continues: "And just so you know, we do offer flexible payment options for larger jobs."]`;

export function BrandConfig() {
  const { id } = useParams<{ id: string }>();
  const { brands, recoverBrand } = useDemoState();
  const navigate = useNavigate();
  const [objectionText, setObjectionText] = useState(WEAK_HANDLING);
  const [showToast, setShowToast] = useState(false);
  const [applied, setApplied] = useState(false);

  const brand = brands.find((b) => b.id === id);
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

  const isActionableSection = brand.recommendation.fixLabel !== "N/A";
  const fixLabel = isActionableSection ? brand.recommendation.fixLabel : "Objection Handling";
  const peerName = isActionableSection ? brand.recommendation.peerName : "Top Peer";

  const getPeerHandlingText = () => {
    if (brand.id === "lone-star-plumbing") {
      return `When a call comes in after hours, immediately reassure and capture intent:

"Thanks for calling ${brand.name}! Our office is currently closed, but you've reached our after-hours line. We handle urgent calls 24/7 — let me get your info and a technician will call you back within 30 minutes.

[Name], [Phone], [Best time to reach you]

For true emergencies (active leak, no heat, electrical hazard), say: 'If this is an emergency, press 1 now and I'll connect you to our on-call technician immediately.'"

[Never let the call drop without capturing contact details or transferring to on-call.]`;
    }
    if (brand.id === "midwest-electric-co") {
      return `When no technician is available for a requested time slot:

"I completely understand — let me check a few options for you. We actually have [SLOT_A] and [SLOT_B] available this week. Many customers find the [earlier slot] works out perfectly because [reason].

If neither works, I can put you on our priority waitlist — if there's a cancellation, you'd be the first call. Can I get your contact info?"

[Always offer two alternatives, never just say "no availability."]
[Capture waitlist intent even if no immediate slot.]`;
    }
    return PEER_HANDLING;
  };

  const handleApplyPeer = () => {
    setObjectionText(getPeerHandlingText());
    setApplied(true);
  };

  const handleApplyChange = () => {
    recoverBrand(brand.id);
    setShowToast(true);
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <button
          onClick={() => navigate(`/brand/${brand.id}`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {brand.name}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-gray-900">RESPONDER</span>{" "}
              <span className="text-gray-300">CONFIG</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{brand.name} · {brand.crm}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Fix needed: {brand.recommendation.fixLabel}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-4 max-w-4xl">
        {/* Read-only sections */}
        <ConfigSection title="Business Information">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Business Name", value: brand.name },
              { label: "Trade", value: brand.trade },
              { label: "Region", value: brand.region },
              { label: "CRM", value: brand.crm },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</label>
                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </ConfigSection>

        <ConfigSection title="Knowledge Base">
          <div className="space-y-3">
            {["Services offered", "Service area zip codes", "Pricing tiers", "FAQs"].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{item}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Configured</span>
              </div>
            ))}
          </div>
        </ConfigSection>

        <ConfigSection title="Booking Windows">
          <div className="grid grid-cols-3 gap-3">
            {["Mon–Fri", "Saturday", "Sunday / After-hours"].map((day) => (
              <div key={day} className="bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200">
                <div className="text-xs text-gray-500 font-medium mb-1">{day}</div>
                <div className="text-sm text-gray-800 font-semibold">
                  {day === "Sunday / After-hours" ? "On-call" : "8am – 6pm"}
                </div>
              </div>
            ))}
          </div>
        </ConfigSection>

        {/* Actionable section */}
        <ConfigSection title={fixLabel} highlighted>
          <div className="space-y-4">
            {!applied ? (
              <div className="bg-white border border-red-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Current handling — underperforming vs peers</span>
                </div>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{WEAK_HANDLING}</pre>
              </div>
            ) : null}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  {applied ? (
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Applied {peerName}&apos;s approach
                    </span>
                  ) : (
                    "Edit handling script"
                  )}
                </label>
                {!applied && (
                  <button
                    onClick={handleApplyPeer}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Apply {peerName}&apos;s approach
                  </button>
                )}
              </div>
              <textarea
                value={objectionText}
                onChange={(e) => setObjectionText(e.target.value)}
                rows={12}
                className={`w-full px-4 py-3 rounded-lg border text-sm font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 ${
                  applied
                    ? "border-emerald-300 bg-emerald-50 focus:ring-emerald-200 text-emerald-900"
                    : "border-gray-300 bg-white focus:ring-blue-200 text-gray-800"
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-400">
                Changes are applied to {brand.name}&apos;s AI responder immediately.
              </p>
              <button
                onClick={handleApplyChange}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Apply change
              </button>
            </div>
          </div>
        </ConfigSection>

        <ConfigSection title="Voice &amp; Tone Settings">
          <div className="space-y-2">
            {[
              { label: "Agent persona", value: "Professional & Friendly" },
              { label: "Language", value: "English (US)" },
              { label: "Escalation threshold", value: "3 failed attempts" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{value}</span>
              </div>
            ))}
          </div>
        </ConfigSection>
      </div>

      {showToast && (
        <Toast
          message={`Change applied to ${brand.name}. Monitoring for recovery.`}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
