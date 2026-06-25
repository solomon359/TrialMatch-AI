"use client";

import React, { useState } from "react";
import { mockAuditLog } from "@/lib/mockData";

const actionColors: Record<string, string> = {
  patient_created: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  document_uploaded: "bg-accent-purple/15 text-accent-purple border-accent-purple/30",
  extraction_completed: "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30",
  match_generated: "bg-accent-green/15 text-accent-green border-accent-green/30",
  match_reviewed: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  match_approved: "bg-accent-green/15 text-accent-green border-accent-green/30",
  match_overridden: "bg-accent-red/15 text-accent-red border-accent-red/30",
  status_changed: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  trial_imported: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  note_added: "bg-bg-card-hover text-text-muted border-border-theme",
};

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = mockAuditLog.filter((log) => {
    const matchSearch =
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const uniqueActions = Array.from(new Set(mockAuditLog.map((l) => l.action)));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Audit Log</h1>
        <p className="text-sm text-text-muted mt-1">
          Immutable record of all system actions for compliance and accountability
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by user, details, or resource ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2.5 bg-bg-primary border border-border-theme rounded-lg text-sm text-text-secondary focus:outline-none focus:border-accent-blue"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full table-striped">
          <thead>
            <tr className="border-b border-border-theme">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Timestamp</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">User</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Resource</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-border-theme/50">
                <td className="px-5 py-4 text-xs text-text-muted font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent-blue/15 text-accent-blue flex items-center justify-center text-[10px] font-bold">
                      {log.user_name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm text-text-primary">{log.user_name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 text-[10px] font-medium rounded-full border ${actionColors[log.action] || actionColors.note_added}`}>
                    {log.action.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div>
                    <span className="text-xs text-text-muted">{log.resource_type}</span>
                    <span className="text-xs text-text-secondary ml-1 font-mono">#{log.resource_id}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-text-secondary max-w-xs truncate">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">🛡️</span>
            <p className="text-text-muted mt-3 text-sm">No audit entries match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
