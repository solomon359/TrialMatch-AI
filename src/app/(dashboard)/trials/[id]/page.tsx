"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mockTrials, mockMatches } from "@/lib/mockData";

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

export default function TrialDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"overview" | "inclusion" | "exclusion" | "sites" | "candidates">("overview");

  const trial = mockTrials.find((t) => t.id === params.id);
  if (!trial) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <span className="text-5xl">🧪</span>
          <p className="text-text-muted mt-4">Trial not found</p>
          <Link href="/trials" className="text-accent-blue text-sm hover:underline mt-2 inline-block">← Back to Trials</Link>
        </div>
      </div>
    );
  }

  const trialMatches = mockMatches.filter((m) => m.trial_id === trial.id);

  const statusColor = trial.status === "recruiting"
    ? "bg-accent-green/15 text-accent-green border-accent-green/30"
    : "bg-accent-amber/15 text-accent-amber border-accent-amber/30";

  const tabs = [
    { key: "overview", label: "Overview", icon: "📋" },
    { key: "inclusion", label: `Inclusion (${trial.inclusion_criteria.length})`, icon: "✅" },
    { key: "exclusion", label: `Exclusion (${trial.exclusion_criteria.length})`, icon: "❌" },
    { key: "sites", label: `Sites (${trial.sites.length})`, icon: "📍" },
    { key: "candidates", label: `Candidates (${trialMatches.length})`, icon: "👥" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/trials" className="hover:text-accent-blue transition-colors">Trials</Link>
        <span>/</span>
        <span className="text-text-primary">{trial.nct_id}</span>
      </div>

      {/* Header Card */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-accent-blue text-sm font-medium">{trial.nct_id}</span>
              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${statusColor}`}>
                {trial.status.replace(/_/g, " ")}
              </span>
              <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full border bg-accent-purple/15 text-accent-purple border-accent-purple/30">
                {trial.phase}
              </span>
            </div>
            <h1 className="text-xl font-bold text-text-primary leading-snug">{trial.title}</h1>
            <p className="text-sm text-text-secondary">Sponsor: {trial.sponsor}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border-theme">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2 flex items-center gap-2
              ${activeTab === tab.key
                ? "border-accent-blue text-accent-blue"
                : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Condition</p>
            <p className="text-sm text-text-primary font-medium">{trial.condition}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Intervention</p>
            <p className="text-sm text-text-primary font-medium">{trial.intervention}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Age Range</p>
            <p className="text-sm text-text-primary font-medium">{trial.min_age || 18} — {trial.max_age || 99} years</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Sex</p>
            <p className="text-sm text-text-primary font-medium">{trial.sex}</p>
          </div>
          <div className="glass-card p-4 col-span-2 lg:col-span-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Summary</p>
            <p className="text-sm text-text-secondary leading-relaxed">{trial.summary}</p>
          </div>
        </div>
      )}

      {activeTab === "inclusion" && (
        <div className="space-y-3">
          {trial.inclusion_criteria.map((c, i) => (
            <div key={c.id} className="glass-card p-4 flex items-start gap-4 hover:scale-[1.01] transition-transform duration-200">
              <div className="w-8 h-8 rounded-full bg-accent-green/15 text-accent-green flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">{c.text}</p>
                <span className={`inline-flex mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full border ${categoryColors[c.category] || categoryColors.other}`}>
                  {c.category.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "exclusion" && (
        <div className="space-y-3">
          {trial.exclusion_criteria.map((c, i) => (
            <div key={c.id} className="glass-card p-4 flex items-start gap-4 hover:scale-[1.01] transition-transform duration-200">
              <div className="w-8 h-8 rounded-full bg-accent-red/15 text-accent-red flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-primary">{c.text}</p>
                <span className={`inline-flex mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full border ${categoryColors[c.category] || categoryColors.other}`}>
                  {c.category.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "sites" && (
        <div className="glass-card overflow-hidden">
          <table className="w-full table-striped">
            <thead>
              <tr className="border-b border-border-theme">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Facility</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">City</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">State</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Country</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {trial.sites.map((site) => (
                <tr key={site.id} className="border-b border-border-theme/50">
                  <td className="px-5 py-4 text-sm text-text-primary">{site.name}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{site.city}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{site.state}</td>
                  <td className="px-5 py-4 text-sm text-text-secondary">{site.country}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full border bg-accent-green/15 text-accent-green border-accent-green/30">
                      {site.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "candidates" && (
        <div className="space-y-3">
          {trialMatches.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl">👥</span>
              <p className="text-text-muted mt-3 text-sm">No candidate patients matched yet</p>
              <Link href="/matching" className="text-accent-blue text-sm hover:underline mt-2 inline-block">
                Run matching engine →
              </Link>
            </div>
          ) : (
            trialMatches.map((match) => (
              <Link key={match.id} href="/matching" className="glass-card p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform duration-200 block">
                <div className="w-10 h-10 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center text-sm font-bold">
                  {match.overall_score}%
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary font-medium">{match.patient_name}</p>
                  <p className="text-xs text-text-muted">Score: {match.overall_score}% • {match.status.replace(/_/g, " ")}</p>
                </div>
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                  match.status === "likely_eligible" ? "bg-accent-green/15 text-accent-green border-accent-green/30" :
                  match.status === "possibly_eligible" ? "bg-accent-amber/15 text-accent-amber border-accent-amber/30" :
                  "bg-accent-red/15 text-accent-red border-accent-red/30"
                }`}>
                  {match.status.replace(/_/g, " ")}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
