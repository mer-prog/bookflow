"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { RISK_LABELS } from "@/lib/utils";

interface Props {
  bookingId: string;
  risk: string;
}

export function RiskExplanation({ bookingId, risk }: Props) {
  const [open, setOpen] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [factors, setFactors] = useState<string[]>([]);
  const [suggestedAction, setSuggestedAction] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchExplanation() {
    setOpen(true);
    if (explanation) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/cancel-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      setExplanation(data.explanation);
      setFactors(data.factors || []);
      setSuggestedAction(data.suggestedAction || "");
    } catch {
      setExplanation("リスク分析の取得に失敗しました。");
    }
    setLoading(false);
  }

  return (
    <>
      <button
        onClick={fetchExplanation}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
        title="AI分析を表示"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#1E3A5F" strokeWidth="1.5" />
          <path d="M8 7v4M8 5v0.5" stroke="#1E3A5F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="AIリスク分析">
        {loading ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-mint" />
            <span className="text-muted-foreground">AI分析中...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">リスクレベル:</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  risk === "HIGH"
                    ? "bg-red-100 text-red-800"
                    : risk === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {RISK_LABELS[risk] || risk}
              </span>
            </div>

            {factors.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">リスク要因:</p>
                <ul className="space-y-1">
                  {factors.map((factor, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l2.5 5 5.5.8-4 3.9.9 5.3L8 13.3 3.1 16l.9-5.3-4-3.9 5.5-.8z" fill="#4ECDC4" />
                </svg>
                <span className="text-sm font-medium text-navy">AIコメント</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
            </div>

            {suggestedAction && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1v6l3 3" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="8" cy="8" r="6.5" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">推奨アクション</span>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed">{suggestedAction}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
