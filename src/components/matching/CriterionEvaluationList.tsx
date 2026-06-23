"use client";

import React from "react";
import CriterionCard from "@/components/ui/CriterionCard";
import type { CriterionEvaluation } from "@/lib/types";

interface CriterionEvaluationListProps {
  evaluations: CriterionEvaluation[];
}

export default function CriterionEvaluationList({
  evaluations,
}: CriterionEvaluationListProps) {
  const inclusion = evaluations.filter((e) => e.criterion_type === "inclusion");
  const exclusion = evaluations.filter((e) => e.criterion_type === "exclusion");

  const counts = (evals: CriterionEvaluation[]) => ({
    passed: evals.filter((e) => e.result === "passed").length,
    failed: evals.filter((e) => e.result === "failed").length,
    missing: evals.filter((e) => e.result === "missing").length,
  });

  const incCounts = counts(inclusion);
  const excCounts = counts(exclusion);

  return (
    <div className="space-y-8">
      {/* Inclusion */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Inclusion Criteria
          </h3>
          <div className="flex gap-2 text-[10px]">
            <span className="text-accent-green">✓ {incCounts.passed}</span>
            <span className="text-accent-red">✗ {incCounts.failed}</span>
            <span className="text-accent-amber">? {incCounts.missing}</span>
          </div>
        </div>
        <div className="space-y-3">
          {inclusion.map((evaluation) => (
            <CriterionCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>
      </div>

      {/* Exclusion */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Exclusion Criteria
          </h3>
          <div className="flex gap-2 text-[10px]">
            <span className="text-accent-green">✓ {excCounts.passed}</span>
            <span className="text-accent-red">✗ {excCounts.failed}</span>
            <span className="text-accent-amber">? {excCounts.missing}</span>
          </div>
        </div>
        <div className="space-y-3">
          {exclusion.map((evaluation) => (
            <CriterionCard key={evaluation.id} evaluation={evaluation} />
          ))}
        </div>
      </div>
    </div>
  );
}
