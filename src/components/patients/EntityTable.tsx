"use client";

import React from "react";
import Badge from "@/components/ui/Badge";
import type { ExtractedEntity, EntityType } from "@/lib/types";

interface EntityTableProps {
  entities: ExtractedEntity[];
}

const typeConfig: Record<EntityType, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" | "purple" }> = {
  diagnosis: { label: "Diagnoses", variant: "purple" },
  lab_result: { label: "Lab Results", variant: "success" },
  medication: { label: "Medications", variant: "info" },
  biomarker: { label: "Biomarkers", variant: "warning" },
  procedure: { label: "Procedures", variant: "neutral" },
  vital_sign: { label: "Vital Signs", variant: "danger" },
  allergy: { label: "Allergies", variant: "danger" },
};

export default function EntityTable({ entities }: EntityTableProps) {
  const grouped = entities.reduce(
    (acc, entity) => {
      if (!acc[entity.entity_type]) acc[entity.entity_type] = [];
      acc[entity.entity_type].push(entity);
      return acc;
    },
    {} as Record<string, ExtractedEntity[]>
  );

  const sortedGroups = Object.entries(grouped).sort(
    ([a], [b]) =>
      ["diagnosis", "biomarker", "lab_result", "medication", "procedure", "vital_sign", "allergy"].indexOf(a) -
      ["diagnosis", "biomarker", "lab_result", "medication", "procedure", "vital_sign", "allergy"].indexOf(b)
  );

  return (
    <div className="space-y-6">
      {sortedGroups.map(([type, items]) => {
        const config = typeConfig[type as EntityType] || { label: type, variant: "neutral" as const };
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={config.variant} size="md">
                {config.label}
              </Badge>
              <span className="text-xs text-text-muted">
                {items.length} {items.length === 1 ? "entity" : "entities"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-theme">
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Name
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Value
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Date
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Source
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((entity) => (
                    <tr
                      key={entity.id}
                      className="border-b border-border-theme/50 hover:bg-bg-card-hover transition-colors"
                    >
                      <td className="py-2 px-3 text-sm text-text-primary font-medium">
                        {entity.is_negated && (
                          <span className="text-accent-red text-xs mr-1">NEG</span>
                        )}
                        {entity.name}
                      </td>
                      <td className="py-2 px-3 text-sm text-text-secondary">
                        {entity.value}
                        {entity.unit && (
                          <span className="text-text-muted ml-1">{entity.unit}</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-xs text-text-muted font-mono">
                        {entity.date
                          ? new Date(entity.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-2 px-3 text-xs text-text-muted max-w-[200px] truncate" title={entity.source_snippet}>
                        {entity.source_snippet}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                entity.confidence >= 0.9
                                  ? "bg-accent-green"
                                  : entity.confidence >= 0.7
                                  ? "bg-accent-amber"
                                  : "bg-accent-red"
                              }`}
                              style={{ width: `${entity.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-text-muted">
                            {Math.round(entity.confidence * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
