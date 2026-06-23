"use client";

import React from "react";
import Card from "./Card";

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  highlight?: boolean;
}

export default function StatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  highlight = false,
}: StatCardProps) {
  return (
    <Card hover className={highlight ? "border-accent-amber/40" : ""}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm">{label}</p>
          <p className="text-3xl font-bold mt-1 text-text-primary">{value}</p>
          {change !== undefined && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 ${
                change >= 0 ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%{" "}
              {changeLabel && (
                <span className="text-text-muted">{changeLabel}</span>
              )}
            </p>
          )}
        </div>
        <span
          className={`text-2xl p-2 rounded-lg ${
            highlight
              ? "bg-amber-500/15"
              : "bg-accent-blue/10"
          }`}
        >
          {icon}
        </span>
      </div>
    </Card>
  );
}
