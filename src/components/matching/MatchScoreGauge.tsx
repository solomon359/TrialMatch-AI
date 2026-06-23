"use client";

import React from "react";
import type { MatchStatus } from "@/lib/types";

interface MatchScoreGaugeProps {
  score: number;
  status: MatchStatus;
  size?: number;
}

const statusLabels: Record<MatchStatus, string> = {
  likely_eligible: "Likely Eligible",
  possibly_eligible: "Possibly Eligible",
  insufficient_data: "Insufficient Data",
  likely_ineligible: "Likely Ineligible",
};

export default function MatchScoreGauge({
  score,
  status,
  size = 120,
}: MatchScoreGaugeProps) {
  const strokeWidth = 8;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "var(--accent-green)";
    if (s >= 60) return "var(--accent-amber)";
    return "var(--accent-red)";
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ animation: "score-fill 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] text-text-muted uppercase">Score</span>
        </div>
      </div>
      <span className="text-xs font-medium text-text-secondary">
        {statusLabels[status]}
      </span>
    </div>
  );
}
