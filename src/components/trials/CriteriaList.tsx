"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import type { TrialCriterion } from "@/lib/types";

interface CriteriaListProps {
  criteria: TrialCriterion[];
  type: "inclusion" | "exclusion";
}

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

export default function CriteriaList({ criteria, type }: CriteriaListProps) {
  if (criteria.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4">
        No {type} criteria defined.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {criteria
        .sort((a, b) => a.order_index - b.order_index)
        .map((criterion) => (
          <div
            key={criterion.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-border-theme/50 hover:border-border-theme transition-colors"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-bg-card flex items-center justify-center text-xs text-text-muted font-mono mt-0.5">
              {criterion.order_index}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={categoryVariant[criterion.category] || "neutral"}
                  size="sm"
                >
                  {criterion.category.replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-sm text-text-primary">{criterion.text}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
