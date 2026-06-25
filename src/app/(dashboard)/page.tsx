"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import ScoreBadge from "@/components/ui/ScoreBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  getDashboardStats,
  getRecentMatches,
  getMissingDataTasks,
} from "@/lib/api";
import type { DashboardStats, MissingDataTask, MatchStatus } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMatches, setRecentMatches] = useState<
    { patient: string; trialNctId: string; score: number; status: MatchStatus; date: string }[]
  >([]);
  const [tasks, setTasks] = useState<MissingDataTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, m, t] = await Promise.all([
          getDashboardStats(),
          getRecentMatches(),
          getMissingDataTasks(),
        ]);
        setStats(s);
        setRecentMatches(m);
        setTasks(t);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">
          Clinical trial matching overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Patients"
          value={stats?.total_patients || 0}
          change={stats?.patients_change_percent}
          changeLabel="this month"
        />
        <StatCard
          icon="🧪"
          label="Active Trials"
          value={stats?.active_trials || 0}
        />
        <StatCard
          icon="⏳"
          label="Pending Reviews"
          value={stats?.pending_reviews || 0}
          highlight
        />
        <StatCard
          icon="🔗"
          label="Matches Today"
          value={stats?.matches_today || 0}
        />
      </div>

      {/* Two columns: Recent Matches + Missing Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Matches Table */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Recent Matches
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-striped">
              <thead>
                <tr className="border-b border-border-theme">
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Patient
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Trial NCT ID
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Score
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((match, i) => (
                  <tr
                    key={i}
                    className="border-b border-border-theme/50 hover:bg-bg-card-hover transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 text-sm font-medium text-text-primary">
                      {match.patient}
                    </td>
                    <td className="py-3 px-3 text-sm text-accent-cyan font-mono">
                      {match.trialNctId}
                    </td>
                    <td className="py-3 px-3">
                      <ScoreBadge score={match.score} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={match.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-sm text-text-muted">
                      {new Date(match.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
                {recentMatches.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-text-muted text-sm"
                    >
                      No recent matches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Missing Data Tasks */}
        <Card>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Missing Data Tasks
          </h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-bg-secondary border border-border-theme/50 hover:border-border-theme transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      task.priority === "high"
                        ? "bg-accent-red"
                        : task.priority === "medium"
                        ? "bg-accent-amber"
                        : "bg-accent-green"
                    }`}
                  />
                  <span className="text-xs font-medium text-accent-cyan">
                    {task.patient_name}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">
                  {task.description}
                </p>
              </div>
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-text-muted text-center py-4">
                No missing data tasks
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Disclaimer Banner */}
      <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-sm font-medium text-amber-400">
              Clinical Decision Support Disclaimer
            </p>
            <p className="text-xs text-text-muted mt-1">
              TrialMatch AI is a prescreening support tool. All matches require
              independent clinical review. This system does not make eligibility
              determinations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
