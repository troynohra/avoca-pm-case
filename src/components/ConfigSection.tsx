import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  highlighted?: boolean;
}

export function ConfigSection({ title, children, highlighted }: Props) {
  return (
    <div className={`rounded-xl border p-6 ${highlighted ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        {highlighted && (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white uppercase tracking-wide">Action needed</span>
        )}
        <h3 className={`font-bold text-base ${highlighted ? "text-blue-900" : "text-gray-900"}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}
