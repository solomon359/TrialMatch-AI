"use client";

import React, { useState } from "react";
import { mockMatches, mockPatients, mockTrials } from "@/lib/mockData";
import { CriterionEvaluation, TrialMatch } from "@/lib/types";

const resultIcons: Record<string, { icon: string; color: string }> = {
  passed: { icon: "✓", color: "text-accent-green bg-accent-green/15 border-accent-green/30" },
  failed: { icon: "✗", color: "text-accent-red bg-accent-red/15 border-accent-red/30" },
  missing: { icon: "?", color: "text-accent-amber bg-accent-amber/15 border-accent-amber/30" },
  not_evaluated: { icon: "—", color: "text-text-muted bg-bg-card-hover border-border-theme" },
};

const matchStatusColors: Record<string, string> = {
  likely_eligible: "bg-accent-green/15 text-accent-green border-accent-green/30",
  possibly_eligible: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  insufficient_data: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  likely_ineligible: "bg-accent-red/15 text-accent-red border-accent-red/30",
};

const categoryColors: Record<string, string> = {
  demographics: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  diagnosis: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  lab_thresholds: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  biomarkers: "bg-accent-green/15 text-accent-green border-accent-green/30",
  prior_therapy: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  organ_function: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  comorbidities: "bg-accent-red/15 text-accent-red border-accent-red/30",
  medications: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  performance_status: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  other: "bg-bg-card-hover text-text-muted border-border-theme",
};

export default function MatchingPage() {
  const [selectedMatch, setSelectedMatch] = useState<TrialMatch | null>(mockMatches[0] || null);
  const [filterResult, setFilterResult] = useState<string>("all");
  const [actionNote, setActionNote] = useState("");

  const selectedPatient = selectedMatch ? mockPatients.find((p) => p.id === selectedMatch.patient_id) : null;
  const selectedTrial = selectedMatch ? mockTrials.find((t) => t.id === selectedMatch.trial_id) : null;

  const filteredEvaluations = selectedMatch
    ? selectedMatch.criteria_evaluations.filter((e) => filterResult === "all" || e.result === filterResult)
    : [];

  const passedCount = selectedMatch?.criteria_evaluations.filter((e) => e.result === "passed").length || 0;
  const failedCount = selectedMatch?.criteria_evaluations.filter((e) => e.result === "failed").length || 0;
  const missingCount = selectedMatch?.criteria_evaluations.filter((e) => e.result === "missing").length || 0;
  const totalCount = selectedMatch?.criteria_evaluations.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Match Review Workspace</h1>
        <p className="text-sm text-text-muted mt-1">
          Review criterion-level eligibility evaluations with evidence citations
        </p>
      </div>

      {/* Disclaimer */}
      <div className="glass-card p-4 border-l-4 border-l-accent-amber">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <p className="text-xs text-text-secondary">
            <strong className="text-accent-amber">Prescreening Support Only.</strong>{" "}
            This is not a clinical eligibility determination. All matches require independent review by a qualified clinician or research coordinator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Match List */}
        <div className="col-span-3 space-y-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Matches</h2>
          {mockMatches.map((match) => (
            <button
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className={`w-full text-left glass-card p-4 transition-all duration-200 hover:scale-[1.02] ${
                selectedMatch?.id === match.id ? "border-accent-blue/50 bg-accent-blue/5" : ""
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  match.overall_score >= 75 ? "bg-accent-green/15 text-accent-green" :
                  match.overall_score >= 50 ? "bg-accent-amber/15 text-accent-amber" :
                  "bg-accent-red/15 text-accent-red"
                }`}>
                  {match.overall_score}%
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium truncate">{match.patient_name}</p>
                  <p className="text-xs text-text-muted font-mono">{match.trial_nct_id}</p>
                </div>
              </div>
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border ${matchStatusColors[match.status]}`}>
                {match.status.replace(/_/g, " ")}
              </span>
            </button>
          ))}
        </div>

        {/* Center: Criterion Evaluations */}
        <div className="col-span-6 space-y-4">
          {selectedMatch && selectedPatient && selectedTrial ? (
            <>
              {/* Score Overview */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">{selectedPatient.first_name} {selectedPatient.last_name}</h2>
                    <p className="text-sm text-text-muted">{selectedTrial.nct_id} — {selectedTrial.title}</p>
                  </div>
                  <div className="text-center">
                    {/* Score Gauge */}
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="40" fill="none"
                          stroke={selectedMatch.overall_score >= 75 ? "var(--accent-green)" : selectedMatch.overall_score >= 50 ? "var(--accent-amber)" : "var(--accent-red)"}
                          strokeWidth="8"
                          strokeDasharray={`${(selectedMatch.overall_score / 100) * 251.2} 251.2`}
                          strokeLinecap="round"
                          style={{ animation: "score-fill 1s ease-out" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-text-primary">{selectedMatch.overall_score}%</span>
                      </div>
                    </div>
                    <span className={`inline-flex mt-2 px-2.5 py-1 text-xs font-medium rounded-full border ${matchStatusColors[selectedMatch.status]}`}>
                      {selectedMatch.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 rounded-lg bg-accent-green/10">
                    <p className="text-2xl font-bold text-accent-green">{passedCount}</p>
                    <p className="text-[10px] text-accent-green uppercase tracking-wider">Passed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent-red/10">
                    <p className="text-2xl font-bold text-accent-red">{failedCount}</p>
                    <p className="text-[10px] text-accent-red uppercase tracking-wider">Failed</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent-amber/10">
                    <p className="text-2xl font-bold text-accent-amber">{missingCount}</p>
                    <p className="text-[10px] text-accent-amber uppercase tracking-wider">Missing</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-bg-card">
                    <p className="text-2xl font-bold text-text-primary">{totalCount}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">Total</p>
                  </div>
                </div>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                {["all", "passed", "failed", "missing"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterResult(f)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      filterResult === f
                        ? "bg-accent-blue text-white"
                        : "bg-bg-card text-text-secondary hover:text-text-primary border border-border-theme"
                    }`}
                  >
                    {f === "all" ? `All (${totalCount})` : f === "passed" ? `Passed (${passedCount})` : f === "failed" ? `Failed (${failedCount})` : `Missing (${missingCount})`}
                  </button>
                ))}
              </div>

              {/* Criterion Cards */}
              <div className="space-y-3">
                {filteredEvaluations.map((evaluation) => (
                  <div key={evaluation.id} className="glass-card p-4 hover:scale-[1.01] transition-transform duration-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border flex-shrink-0 ${resultIcons[evaluation.result].color}`}>
                        {resultIcons[evaluation.result].icon}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm text-text-primary leading-snug">{evaluation.criterion_text}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border ${categoryColors[evaluation.category] || categoryColors.other}`}>
                              {evaluation.category.replace(/_/g, " ")}
                            </span>
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                              evaluation.criterion_type === "inclusion" ? "bg-accent-green/10 text-accent-green border-accent-green/20" : "bg-accent-red/10 text-accent-red border-accent-red/20"
                            }`}>
                              {evaluation.criterion_type}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-text-secondary">{evaluation.explanation}</p>
                        {evaluation.evidence_snippet && (
                          <div className="mt-2 p-2.5 rounded-lg bg-bg-primary border border-border-theme">
                            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">📎 Evidence</p>
                            <p className="text-xs text-text-secondary italic">"{evaluation.evidence_snippet}"</p>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-[10px] text-text-muted">
                          <span>Confidence: {Math.round(evaluation.confidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <span className="text-5xl">🔗</span>
              <p className="text-text-muted mt-4">Select a match to review criterion-level evaluations</p>
            </div>
          )}
        </div>

        {/* Right: Actions Panel */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Coordinator Actions</h2>
          
          {selectedMatch && (
            <>
              {/* Status Actions */}
              <div className="glass-card p-4 space-y-3">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Workflow Action</p>
                <button className="w-full px-4 py-2.5 bg-accent-green hover:bg-accent-green/80 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                  ✓ Mark as Reviewed
                </button>
                <button className="w-full px-4 py-2.5 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                  📋 Refer to Site
                </button>
                <button className="w-full px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover text-text-secondary text-sm font-medium rounded-lg transition-colors border border-border-theme flex items-center justify-center gap-2">
                  ⚠️ Flag for Review
                </button>
                <button className="w-full px-4 py-2.5 bg-accent-red/10 hover:bg-accent-red/20 text-accent-red text-sm font-medium rounded-lg transition-colors border border-accent-red/30 flex items-center justify-center gap-2">
                  ✗ Exclude
                </button>
              </div>

              {/* Notes */}
              <div className="glass-card p-4 space-y-3">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Add Note</p>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Add coordinator notes..."
                  rows={3}
                  className="w-full px-3 py-2 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue resize-none"
                />
                <button className="w-full px-4 py-2 bg-bg-card hover:bg-bg-card-hover text-text-secondary text-sm font-medium rounded-lg transition-colors border border-border-theme">
                  Save Note
                </button>
              </div>

              {/* Export */}
              <div className="glass-card p-4 space-y-3">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Export</p>
                <button className="w-full px-4 py-2 bg-bg-card hover:bg-bg-card-hover text-text-secondary text-sm font-medium rounded-lg transition-colors border border-border-theme flex items-center justify-center gap-2">
                  📄 Export Prescreen Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
