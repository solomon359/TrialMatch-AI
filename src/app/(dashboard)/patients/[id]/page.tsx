"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import ScoreBadge from "@/components/ui/ScoreBadge";
import Tabs from "@/components/ui/Tabs";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import DocumentUploader from "@/components/patients/DocumentUploader";
import EntityTable from "@/components/patients/EntityTable";
import PatientTimeline from "@/components/patients/PatientTimeline";
import {
  getPatient,
  getPatientDocuments,
  getPatientEntities,
  getPatientTimeline,
  getPatientMatches,
  updatePatientStatus,
  uploadDocument,
} from "@/lib/api";
import type {
  Patient,
  PatientDocument,
  ExtractedEntity,
  TimelineEvent,
  TrialMatch,
  PatientStatus,
} from "@/lib/types";

const statusOrder: PatientStatus[] = [
  "new",
  "documents_uploaded",
  "extraction_in_progress",
  "extraction_complete",
  "matching_in_progress",
  "matches_available",
  "under_review",
  "reviewed",
];

export default function PatientDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [entities, setEntities] = useState<ExtractedEntity[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [matches, setMatches] = useState<TrialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("documents");
  const [statusNote, setStatusNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<PatientStatus>("new");

  useEffect(() => {
    async function load() {
      try {
        const [p, d, e, t, m] = await Promise.all([
          getPatient(id),
          getPatientDocuments(id),
          getPatientEntities(id),
          getPatientTimeline(id),
          getPatientMatches(id),
        ]);
        setPatient(p);
        setDocuments(d);
        setEntities(e);
        setTimeline(t);
        setMatches(m);
        setSelectedStatus(p.status);
      } catch (error) {
        console.error("Failed to load patient:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        const newDoc = await uploadDocument(id, file);
        setDocuments((prev) => [...prev, newDoc]);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  const handleStatusUpdate = async () => {
    if (!patient) return;
    try {
      const updated = await updatePatientStatus(id, selectedStatus);
      setPatient(updated);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  if (loading || !patient) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading patient..." />
      </div>
    );
  }

  const tabs = [
    { id: "documents", label: "Documents", icon: "📄", count: documents.length },
    { id: "evidence", label: "Extracted Evidence", icon: "🔬", count: entities.length },
    { id: "timeline", label: "Timeline", icon: "📅", count: timeline.length },
    { id: "matches", label: "Trial Matches", icon: "🔗", count: matches.length },
  ];

  const currentStepIndex = statusOrder.indexOf(patient.status);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Patient Header */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-text-primary">
                {patient.first_name} {patient.last_name}
              </h1>
              <StatusBadge status={patient.status} />
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
              <span>
                <span className="text-text-muted">MRN:</span>{" "}
                <span className="font-mono text-accent-cyan">{patient.mrn}</span>
              </span>
              <span>
                <span className="text-text-muted">DOB:</span>{" "}
                {new Date(patient.date_of_birth).toLocaleDateString("en-US")}
              </span>
              <span>
                <span className="text-text-muted">Sex:</span> {patient.sex}
              </span>
              <span>
                <span className="text-text-muted">Age:</span>{" "}
                {Math.floor(
                  (Date.now() - new Date(patient.date_of_birth).getTime()) /
                    (365.25 * 24 * 60 * 60 * 1000)
                )}
              </span>
            </div>
            {patient.notes && (
              <p className="text-xs text-text-muted mt-2 italic">
                {patient.notes}
              </p>
            )}
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="mt-4 pt-4 border-t border-border-theme">
          <div className="flex items-center gap-1 overflow-x-auto">
            {statusOrder.map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`flex-shrink-0 px-2 py-1 rounded text-[10px] font-medium ${
                    i <= currentStepIndex
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "bg-bg-secondary text-text-muted"
                  }`}
                >
                  {s.replace(/_/g, " ")}
                </div>
                {i < statusOrder.length - 1 && (
                  <div
                    className={`flex-shrink-0 w-4 h-px ${
                      i < currentStepIndex ? "bg-accent-blue" : "bg-border-theme"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="mb-6"
          />

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-4">
              <DocumentUploader onUpload={handleUpload} />
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary border border-border-theme/50 hover:border-border-theme transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg flex-shrink-0">📄</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {doc.filename}
                        </p>
                        <p className="text-xs text-text-muted">
                          {(doc.file_size_bytes / 1024 / 1024).toFixed(1)} MB
                          {doc.page_count && ` · ${doc.page_count} pages`}
                          {" · "}
                          {new Date(doc.uploaded_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={doc.status} size="sm" />
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-center text-sm text-text-muted py-8">
                    No documents uploaded yet
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === "evidence" && (
            <div>
              {entities.length > 0 ? (
                <EntityTable entities={entities} />
              ) : (
                <div className="text-center py-12 text-text-muted">
                  <p className="text-4xl mb-3">🔬</p>
                  <p className="text-sm">
                    No entities extracted yet. Upload and process documents first.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <PatientTimeline events={timeline} />
          )}

          {/* Matches Tab */}
          {activeTab === "matches" && (
            <div className="space-y-3">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  hover
                  onClick={() =>
                    window.location.assign(`/matching?match=${match.id}`)
                  }
                >
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={match.overall_score} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {match.trial_title}
                      </p>
                      <p className="text-xs text-accent-cyan font-mono mt-0.5">
                        {match.trial_nct_id}
                      </p>
                    </div>
                    <StatusBadge status={match.status} size="sm" />
                  </div>
                </Card>
              ))}
              {matches.length === 0 && (
                <div className="text-center py-12 text-text-muted">
                  <p className="text-4xl mb-3">🔗</p>
                  <p className="text-sm">
                    No matches generated yet. Complete extraction first.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Side Panel: Workflow Actions */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Workflow Actions
            </h3>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-muted">
                  Change Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as PatientStatus)
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg bg-bg-secondary border border-border-theme text-text-primary focus:outline-none focus:border-border-active"
                >
                  {statusOrder.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-muted">
                  Add Note
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  placeholder="Add a clinical note..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-bg-secondary border border-border-theme text-text-primary placeholder-text-muted focus:outline-none focus:border-border-active resize-none"
                />
              </div>
              <Button
                onClick={handleStatusUpdate}
                className="w-full"
                size="sm"
              >
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Quick Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Documents</span>
                <span className="text-text-primary font-medium">
                  {documents.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Entities</span>
                <span className="text-text-primary font-medium">
                  {entities.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Matches</span>
                <span className="text-text-primary font-medium">
                  {matches.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Created</span>
                <span className="text-text-primary text-xs font-mono">
                  {new Date(patient.created_at).toLocaleDateString("en-US")}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
