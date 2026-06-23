"use client";

import React, { useState } from "react";
import Link from "next/link";
import { mockTrials } from "@/lib/mockData";
import { ClinicalTrial } from "@/lib/types";

const phaseColors: Record<string, string> = {
  "Phase 1": "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  "Phase 2": "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  "Phase 3": "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  "Phase 4": "bg-accent-green/15 text-accent-green border-accent-green/30",
  "Not Applicable": "bg-bg-card-hover text-text-muted border-border-theme",
};

const statusColors: Record<string, string> = {
  recruiting: "bg-accent-green/15 text-accent-green border-accent-green/30",
  active_not_recruiting: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  completed: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  terminated: "bg-accent-red/15 text-accent-red border-accent-red/30",
  withdrawn: "bg-accent-red/15 text-accent-red border-accent-red/30",
  suspended: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
};

export default function TrialsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showImportModal, setShowImportModal] = useState(false);

  const filtered = mockTrials.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nct_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPhase = phaseFilter === "all" || t.phase === phaseFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchPhase && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Clinical Trials</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage imported trials and their eligibility criteria
          </p>
        </div>
        <button
          onClick={() => setShowImportModal(true)}
          className="px-4 py-2.5 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <span>🌐</span>
          Import from ClinicalTrials.gov
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by NCT ID, title, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
        >
          <option value="all">All Phases</option>
          <option value="Phase 1">Phase 1</option>
          <option value="Phase 2">Phase 2</option>
          <option value="Phase 3">Phase 3</option>
          <option value="Phase 4">Phase 4</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
        >
          <option value="all">All Statuses</option>
          <option value="recruiting">Recruiting</option>
          <option value="active_not_recruiting">Active, Not Recruiting</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Trials Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full table-striped">
          <thead>
            <tr className="border-b border-border-theme">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">NCT ID</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Condition</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Phase</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Criteria</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Sites</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trial) => (
              <tr key={trial.id} className="border-b border-border-theme/50 cursor-pointer hover:bg-bg-card-hover transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/trials/${trial.id}`} className="text-accent-blue font-mono text-sm hover:underline">
                    {trial.nct_id}
                  </Link>
                </td>
                <td className="px-5 py-4 max-w-xs">
                  <Link href={`/trials/${trial.id}`} className="text-sm text-text-primary hover:text-accent-blue transition-colors line-clamp-2">
                    {trial.title}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary">{trial.condition}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${phaseColors[trial.phase] || ""}`}>
                    {trial.phase}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[trial.status] || ""}`}>
                    {trial.status.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary">
                  {trial.inclusion_criteria.length + trial.exclusion_criteria.length}
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary">{trial.sites.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">🧪</span>
            <p className="text-text-muted mt-3 text-sm">No trials match your filters</p>
          </div>
        )}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="glass-card p-6 w-full max-w-lg space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-text-primary">Import from ClinicalTrials.gov</h2>
            <p className="text-sm text-text-muted">Search and import clinical trials by condition, phase, or recruitment status.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Condition / Disease</label>
                <input type="text" placeholder="e.g., Non-Small Cell Lung Cancer" className="w-full px-3 py-2 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Phase</label>
                  <select className="w-full px-3 py-2 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue">
                    <option>Any Phase</option>
                    <option>Phase 1</option>
                    <option>Phase 2</option>
                    <option>Phase 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
                  <select className="w-full px-3 py-2 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue">
                    <option>Recruiting</option>
                    <option>Active, Not Recruiting</option>
                    <option>Any Status</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Max Results</label>
                <input type="number" defaultValue={10} className="w-full px-3 py-2 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
              <button className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-medium rounded-lg transition-colors">
                🔍 Search & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
