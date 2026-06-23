"use client";

import React from "react";
import type { ExtractedEntity } from "@/lib/types";

interface EvidencePanelProps {
  entities: ExtractedEntity[];
  title?: string;
}

export default function EvidencePanel({
  entities,
  title = "Extracted Evidence",
}: EvidencePanelProps) {
  if (entities.length === 0) {
    return (
      <div className="text-center py-6 text-text-muted">
        <p className="text-sm">No evidence extracted yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-3">{title}</h3>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className="p-3 rounded-lg bg-bg-secondary border border-border-theme/50 hover:border-border-theme transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-accent-cyan uppercase">
                {entity.entity_type.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] text-text-muted">
                {entity.confidence >= 0.9
                  ? "🟢"
                  : entity.confidence >= 0.7
                  ? "🟡"
                  : "🔴"}{" "}
                {Math.round(entity.confidence * 100)}%
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary">
              {entity.name}
              {entity.value && (
                <span className="text-text-secondary font-normal">
                  : {entity.value}
                  {entity.unit && ` ${entity.unit}`}
                </span>
              )}
            </p>
            <p className="text-xs text-text-muted mt-1 italic border-l-2 border-accent-blue/30 pl-2">
              &quot;{entity.source_snippet}&quot;
            </p>
            {entity.page_number && (
              <p className="text-[10px] text-text-muted mt-1">
                Page {entity.page_number}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
