"use client";

import React from "react";
import TimelineItem from "@/components/ui/TimelineItem";
import type { TimelineEvent } from "@/lib/types";

interface PatientTimelineProps {
  events: TimelineEvent[];
}

export default function PatientTimeline({ events }: PatientTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-3xl mb-2">📅</p>
        <p className="text-sm">No timeline events yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <TimelineItem
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
    </div>
  );
}
