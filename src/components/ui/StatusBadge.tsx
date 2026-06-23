"use client";

import React from "react";
import Badge from "./Badge";
import type { PatientStatus, TrialStatus, MatchStatus, DocumentStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: PatientStatus | TrialStatus | MatchStatus | DocumentStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" | "purple" }
> = {
  // Patient statuses
  new: { label: "New", variant: "info" },
  documents_uploaded: { label: "Docs Uploaded", variant: "info" },
  extraction_in_progress: { label: "Extracting...", variant: "warning" },
  extraction_complete: { label: "Extracted", variant: "purple" },
  matching_in_progress: { label: "Matching...", variant: "warning" },
  matches_available: { label: "Matches Ready", variant: "success" },
  under_review: { label: "Under Review", variant: "warning" },
  reviewed: { label: "Reviewed", variant: "success" },

  // Document statuses
  uploaded: { label: "Uploaded", variant: "info" },
  processing: { label: "Processing", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  failed: { label: "Failed", variant: "danger" },

  // Trial statuses
  recruiting: { label: "Recruiting", variant: "success" },
  active_not_recruiting: { label: "Active", variant: "info" },
  terminated: { label: "Terminated", variant: "danger" },
  withdrawn: { label: "Withdrawn", variant: "neutral" },
  suspended: { label: "Suspended", variant: "warning" },

  // Match statuses
  likely_eligible: { label: "Likely Eligible", variant: "success" },
  possibly_eligible: { label: "Possibly Eligible", variant: "warning" },
  insufficient_data: { label: "Insufficient Data", variant: "neutral" },
  likely_ineligible: { label: "Likely Ineligible", variant: "danger" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "neutral" as const };
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
