import { useNavigate } from "react-router-dom";

interface Props {
  brandId: string;
  summary: string;
  peerName: string;
  fixLabel: string;
}

export function RecommendationCard({ brandId, summary, peerName, fixLabel }: Props) {
  const navigate = useNavigate();
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Recommendation</h3>
          <p className="text-gray-700 text-sm">{summary}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4 bg-white rounded-lg px-4 py-3 border border-blue-100">
        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-sm text-gray-600">Borrow <strong>{fixLabel}</strong> from <strong className="text-blue-700">{peerName}</strong></span>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate(`/brand/${brandId}/config`)}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Fix in config
        </button>
        <button
          onClick={() => alert("Opens existing Coach / Responder / Analytics screens (existing per-brand surface)")}
          className="px-5 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Open Coach / Responder / Analytics
        </button>
      </div>
    </div>
  );
}
