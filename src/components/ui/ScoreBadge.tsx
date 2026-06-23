"use client";

import React from "react";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ScoreBadge({
  score,
  size = "md",
  className = "",
}: ScoreBadgeProps) {
  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "var(--accent-green)", text: "text-accent-green" };
    if (s >= 60) return { stroke: "var(--accent-amber)", text: "text-accent-amber" };
    return { stroke: "var(--accent-red)", text: "text-accent-red" };
  };

  const dims = {
    sm: { size: 40, strokeWidth: 3, fontSize: "text-xs", r: 16 },
    md: { size: 56, strokeWidth: 4, fontSize: "text-sm", r: 22 },
    lg: { size: 80, strokeWidth: 5, fontSize: "text-lg", r: 32 },
  };

  const d = dims[size];
  const circumference = 2 * Math.PI * d.r;
  const offset = circumference - (score / 100) * circumference;
  const color = getColor(score);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={d.size} height={d.size} className="-rotate-90">
        <circle
          cx={d.size / 2}
          cy={d.size / 2}
          r={d.r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={d.strokeWidth}
        />
        <circle
          cx={d.size / 2}
          cy={d.size / 2}
          r={d.r}
          fill="none"
          stroke={color.stroke}
          strokeWidth={d.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ animation: "score-fill 1s ease-out" }}
        />
      </svg>
      <span
        className={`absolute ${d.fontSize} font-bold ${color.text}`}
      >
        {score}
      </span>
    </div>
  );
}
