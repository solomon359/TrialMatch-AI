"use client";

import React from "react";
import Badge from "./Badge";
import type { CriterionEvaluation } from "@/lib/types";

interface CriterionCardProps {
  evaluation: CriterionEvaluation;
}

const resultConfig = {
  passed: { icon: "✓", color: "text-accent-green", bg: "bg-emerald-500/10", label: "Passed" },
  failed: { icon: "✗", color: "text-accent-red", bg: "bg-red-500/10", label: "Failed" },
  missing: { icon: "?", color: "text-accent-amber", bg: "bg-amber-500/10", label: "Missing" },
  not_evaluated: { icon: "—", color: "text-text-muted", bg: "bg-slate-500/10", label: "Not Evaluated" },
};

const categoryVariant: Record<string, "info" | "success" | "warning" | "danger" | "neutral" | "purple"> = {
  demographics: "info",
  diagnosis: "purple",
  lab_thresholds: "success",
  biomarkers: "warning",
  prior_therapy: "neutral",
  organ_function: "success",
  comorbidities: "danger",
  medications: "info",
  performance_status: "purple",
  other: "neutral",
};

export default function CriterionCard({ evaluation }: CriterionCardProps) {
  const result = resultConfig[evaluation.result];

  return (
    <div
      className={`rounded-lg border border-border-theme p-4 transition-all duration-200 hover:border-border-active/30 ${result.bg}`}
    >
      <div className="flex items-start gap-3">
        {/* Result Icon */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${result.color} bg-bg-card`}
        >
          {result.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge
              variant={categoryVariant[evaluation.category] || "neutral"}
              size="sm"
            >
              {evaluation.category.replace(/_/g, " ")}
            </Badge>
            <span className={`text-xs font-medium ${result.color}`}>
              {result.label}
            </span>
            <span className="text-xs text-text-muted ml-auto">
              {evaluation.criterion_type === "exclusion" ? "Exclusion" : "Inclusion"}
            </span>
          </div>

          {/* Criterion Text */}
          <p className="text-sm text-text-primary mt-2">{evaluation.criterion_text}</p>

          {/* Evidence */}
          {evaluation.evidence_snippet && (
            <div className="mt-2 px-3 py-2 bg-bg-secondary rounded border-l-2 border-accent-blue/50">
              <p className="text-xs text-text-secondary italic">
                &quot;{evaluation.evidence_snippet}&quot;
              </p>
            </div>
          )}

          {/* Explanation */}
          <p className="mt-2 text-xs text-text-muted">{evaluation.explanation}</p>

          {/* Confidence */}
          {evaluation.confidence > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-bg-secondary rounded-full overflow-hidden max-w-[100px]">
                <div
                  className="h-full bg-accent-blue rounded-full transition-all duration-500"
                  style={{ width: `${evaluation.confidence * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-text-muted">
                {Math.round(evaluation.confidence * 100)}% confidence
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
