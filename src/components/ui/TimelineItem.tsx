"use client";

import React from "react";
import type { TimelineEvent } from "@/lib/types";

interface TimelineItemProps {
  event: TimelineEvent;
  isLast?: boolean;
}

const eventTypeConfig: Record<string, { icon: string; color: string }> = {
  diagnosis: { icon: "🔬", color: "bg-purple-500" },
  lab_result: { icon: "🧪", color: "bg-cyan-500" },
  medication: { icon: "💊", color: "bg-blue-500" },
  biomarker: { icon: "🧬", color: "bg-green-500" },
  procedure: { icon: "🏥", color: "bg-amber-500" },
  vital_sign: { icon: "❤️", color: "bg-red-500" },
  allergy: { icon: "⚠️", color: "bg-amber-500" },
  status_change: { icon: "📋", color: "bg-blue-400" },
  note: { icon: "📝", color: "bg-slate-500" },
};

export default function TimelineItem({ event, isLast = false }: TimelineItemProps) {
  const config = eventTypeConfig[event.event_type] || { icon: "•", color: "bg-slate-500" };

  return (
    <div className="flex gap-4">
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${config.color}/20 border-2 border-border-theme`}
        >
          {config.icon}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-border-theme min-h-[24px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-text-muted font-mono">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <h4 className="text-sm font-medium text-text-primary">{event.title}</h4>
        <p className="text-xs text-text-secondary mt-1">{event.description}</p>
        {event.source && (
          <p className="text-[11px] text-text-muted mt-1">
            📄 {event.source}
          </p>
        )}
      </div>
    </div>
  );
}
