import {
  Patient,
  PatientDocument,
  ExtractedEntity,
  TimelineEvent,
  ClinicalTrial,
  TrialMatch,
  AuditLogEntry,
  DashboardStats,
  MissingDataTask,
} from "./types";
import {
  mockPatients,
  mockDocuments,
  mockEntities,
  mockTimeline,
  mockTrials,
  mockMatches,
  mockAuditLog,
  mockDashboardStats,
  mockMissingDataTasks,
  mockRecentMatches,
} from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const USE_MOCK = true; // Set to false when backend is running

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("trialmatch_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// Simulate API delay for mock data
function mockDelay<T>(data: T, ms: number = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

// ==================== Dashboard ====================

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) return mockDelay(mockDashboardStats);
  return apiFetch<DashboardStats>("/dashboard/stats");
}

export async function getRecentMatches() {
  if (USE_MOCK) return mockDelay(mockRecentMatches);
  return apiFetch<typeof mockRecentMatches>("/dashboard/recent-matches");
}

export async function getMissingDataTasks(): Promise<MissingDataTask[]> {
  if (USE_MOCK) return mockDelay(mockMissingDataTasks);
  return apiFetch<MissingDataTask[]>("/dashboard/missing-data");
}

// ==================== Patients ====================

export async function getPatients(): Promise<Patient[]> {
  if (USE_MOCK) return mockDelay(mockPatients);
  return apiFetch<Patient[]>("/patients");
}

export async function getPatient(id: string): Promise<Patient> {
  if (USE_MOCK) {
    const patient = mockPatients.find((p) => p.id === id);
    if (!patient) throw new Error("Patient not found");
    return mockDelay(patient);
  }
  return apiFetch<Patient>(`/patients/${id}`);
}

export async function createPatient(data: Partial<Patient>): Promise<Patient> {
  if (USE_MOCK) {
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      mrn: data.mrn || `MRN-${Date.now()}`,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      date_of_birth: data.date_of_birth || "",
      sex: data.sex || "Other",
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      documents_count: 0,
    };
    mockPatients.push(newPatient);
    return mockDelay(newPatient);
  }
  return apiFetch<Patient>("/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePatientStatus(
  id: string,
  status: Patient["status"]
): Promise<Patient> {
  if (USE_MOCK) {
    const patient = mockPatients.find((p) => p.id === id);
    if (!patient) throw new Error("Patient not found");
    patient.status = status;
    patient.updated_at = new Date().toISOString();
    return mockDelay(patient);
  }
  return apiFetch<Patient>(`/patients/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ==================== Documents ====================

export async function getPatientDocuments(
  patientId: string
): Promise<PatientDocument[]> {
  if (USE_MOCK) {
    return mockDelay(mockDocuments.filter((d) => d.patient_id === patientId));
  }
  return apiFetch<PatientDocument[]>(`/patients/${patientId}/documents`);
}

export async function uploadDocument(
  patientId: string,
  file: File
): Promise<PatientDocument> {
  if (USE_MOCK) {
    const newDoc: PatientDocument = {
      id: `doc-${Date.now()}`,
      patient_id: patientId,
      filename: file.name,
      file_type: file.type,
      file_size_bytes: file.size,
      status: "uploaded",
      uploaded_at: new Date().toISOString(),
    };
    return mockDelay(newDoc, 500);
  }

  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<PatientDocument>(`/patients/${patientId}/documents`, {
    method: "POST",
    headers: {}, // Let browser set content-type for FormData
    body: formData,
  });
}

// ==================== Extracted Entities ====================

export async function getPatientEntities(
  patientId: string
): Promise<ExtractedEntity[]> {
  if (USE_MOCK) {
    return mockDelay(mockEntities.filter((e) => e.patient_id === patientId));
  }
  return apiFetch<ExtractedEntity[]>(`/patients/${patientId}/entities`);
}

// ==================== Timeline ====================

export async function getPatientTimeline(
  patientId: string
): Promise<TimelineEvent[]> {
  if (USE_MOCK) {
    return mockDelay(
      mockTimeline
        .filter((t) => t.patient_id === patientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }
  return apiFetch<TimelineEvent[]>(`/patients/${patientId}/timeline`);
}

// ==================== Trials ====================

export async function getTrials(): Promise<ClinicalTrial[]> {
  if (USE_MOCK) return mockDelay(mockTrials);
  return apiFetch<ClinicalTrial[]>("/trials");
}

export async function getTrial(id: string): Promise<ClinicalTrial> {
  if (USE_MOCK) {
    const trial = mockTrials.find((t) => t.id === id);
    if (!trial) throw new Error("Trial not found");
    return mockDelay(trial);
  }
  return apiFetch<ClinicalTrial>(`/trials/${id}`);
}

export async function importTrial(nctId: string): Promise<ClinicalTrial> {
  if (USE_MOCK) {
    return mockDelay(mockTrials[0], 1000);
  }
  return apiFetch<ClinicalTrial>("/trials/import", {
    method: "POST",
    body: JSON.stringify({ nct_id: nctId }),
  });
}

// ==================== Matches ====================

export async function getMatches(): Promise<TrialMatch[]> {
  if (USE_MOCK) return mockDelay(mockMatches);
  return apiFetch<TrialMatch[]>("/matches");
}

export async function getMatch(id: string): Promise<TrialMatch> {
  if (USE_MOCK) {
    const match = mockMatches.find((m) => m.id === id);
    if (!match) throw new Error("Match not found");
    return mockDelay(match);
  }
  return apiFetch<TrialMatch>(`/matches/${id}`);
}

export async function getPatientMatches(
  patientId: string
): Promise<TrialMatch[]> {
  if (USE_MOCK) {
    return mockDelay(mockMatches.filter((m) => m.patient_id === patientId));
  }
  return apiFetch<TrialMatch[]>(`/patients/${patientId}/matches`);
}

export async function getTrialMatches(
  trialId: string
): Promise<TrialMatch[]> {
  if (USE_MOCK) {
    return mockDelay(mockMatches.filter((m) => m.trial_id === trialId));
  }
  return apiFetch<TrialMatch[]>(`/trials/${trialId}/matches`);
}

export async function updateMatchStatus(
  id: string,
  status: TrialMatch["status"],
  notes?: string
): Promise<TrialMatch> {
  if (USE_MOCK) {
    const match = mockMatches.find((m) => m.id === id);
    if (!match) throw new Error("Match not found");
    match.status = status;
    if (notes) match.notes = notes;
    match.reviewed_at = new Date().toISOString();
    match.reviewed_by = "Dr. Sarah Chen";
    return mockDelay(match);
  }
  return apiFetch<TrialMatch>(`/matches/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, notes }),
  });
}

// ==================== Audit Log ====================

export async function getAuditLog(): Promise<AuditLogEntry[]> {
  if (USE_MOCK) return mockDelay(mockAuditLog);
  return apiFetch<AuditLogEntry[]>("/audit-log");
}

// ==================== Reports ====================

export async function generateReport(
  patientId: string,
  matchId: string
): Promise<Blob> {
  if (USE_MOCK) {
    const patient = mockPatients.find((p) => p.id === patientId);
    const match = mockMatches.find((m) => m.id === matchId);
    const reportContent = `
TRIALMATCH AI - SCREENING REPORT
Generated: ${new Date().toISOString()}
============================================

PATIENT INFORMATION
Name: ${patient?.first_name} ${patient?.last_name}
MRN: ${patient?.mrn}
DOB: ${patient?.date_of_birth}
Sex: ${patient?.sex}

TRIAL INFORMATION
NCT ID: ${match?.trial_nct_id}
Title: ${match?.trial_title}

MATCH RESULTS
Overall Score: ${match?.overall_score}%
Status: ${match?.status}

CRITERION EVALUATIONS
${match?.criteria_evaluations
  .map(
    (ce) =>
      `  ${ce.result === "passed" ? "✓" : ce.result === "failed" ? "✗" : "?"} [${ce.category}] ${ce.criterion_text}
     ${ce.explanation}`
  )
  .join("\n\n")}

============================================
DISCLAIMER: This is a prescreening support tool. 
All matches require independent clinical review.
    `.trim();

    const blob = new Blob([reportContent], { type: "text/plain" });
    return mockDelay(blob, 500);
  }

  const response = await fetch(
    `${BASE_URL}/reports/generate?patient_id=${patientId}&match_id=${matchId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("trialmatch_token")}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to generate report");
  return response.blob();
}
