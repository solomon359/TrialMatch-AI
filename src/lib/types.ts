// ==================== Enums ====================

export type PatientStatus =
  | "new"
  | "documents_uploaded"
  | "extraction_in_progress"
  | "extraction_complete"
  | "matching_in_progress"
  | "matches_available"
  | "under_review"
  | "reviewed";

export type DocumentStatus =
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";

export type TrialPhase = "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4" | "Not Applicable";

export type TrialStatus =
  | "recruiting"
  | "active_not_recruiting"
  | "completed"
  | "terminated"
  | "withdrawn"
  | "suspended";

export type MatchStatus =
  | "likely_eligible"
  | "possibly_eligible"
  | "insufficient_data"
  | "likely_ineligible";

export type CriterionResult = "passed" | "failed" | "missing" | "not_evaluated";

export type CriterionCategory =
  | "demographics"
  | "diagnosis"
  | "lab_thresholds"
  | "biomarkers"
  | "prior_therapy"
  | "organ_function"
  | "comorbidities"
  | "medications"
  | "performance_status"
  | "other";

export type EntityType =
  | "diagnosis"
  | "lab_result"
  | "medication"
  | "biomarker"
  | "procedure"
  | "vital_sign"
  | "allergy";

export type AuditAction =
  | "patient_created"
  | "document_uploaded"
  | "extraction_completed"
  | "match_generated"
  | "match_reviewed"
  | "match_approved"
  | "match_overridden"
  | "status_changed"
  | "trial_imported"
  | "note_added";

// ==================== Core Models ====================

export interface Patient {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: "Male" | "Female" | "Other";
  status: PatientStatus;
  created_at: string;
  updated_at: string;
  documents_count: number;
  notes?: string;
}

export interface PatientDocument {
  id: string;
  patient_id: string;
  filename: string;
  file_type: string;
  file_size_bytes: number;
  status: DocumentStatus;
  uploaded_at: string;
  processed_at?: string;
  page_count?: number;
  error_message?: string;
}

export interface ExtractedEntity {
  id: string;
  patient_id: string;
  document_id: string;
  entity_type: EntityType;
  name: string;
  value?: string;
  unit?: string;
  date?: string;
  source_snippet: string;
  page_number?: number;
  confidence: number;
  is_negated: boolean;
}

export interface TimelineEvent {
  id: string;
  patient_id: string;
  date: string;
  event_type: EntityType | "status_change" | "note";
  title: string;
  description: string;
  source?: string;
}

export interface ClinicalTrial {
  id: string;
  nct_id: string;
  title: string;
  condition: string;
  intervention: string;
  phase: TrialPhase;
  status: TrialStatus;
  sponsor: string;
  summary: string;
  min_age?: number;
  max_age?: number;
  sex: "All" | "Male" | "Female";
  healthy_volunteers: boolean;
  sites: TrialSite[];
  inclusion_criteria: TrialCriterion[];
  exclusion_criteria: TrialCriterion[];
  last_updated: string;
}

export interface TrialSite {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  status: string;
}

export interface TrialCriterion {
  id: string;
  trial_id: string;
  criterion_type: "inclusion" | "exclusion";
  category: CriterionCategory;
  text: string;
  parsed_expression?: string;
  order_index: number;
}

export interface TrialMatch {
  id: string;
  patient_id: string;
  trial_id: string;
  patient_name: string;
  trial_nct_id: string;
  trial_title: string;
  overall_score: number;
  status: MatchStatus;
  criteria_evaluations: CriterionEvaluation[];
  generated_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface CriterionEvaluation {
  id: string;
  match_id: string;
  criterion_id: string;
  criterion_text: string;
  criterion_type: "inclusion" | "exclusion";
  category: CriterionCategory;
  result: CriterionResult;
  evidence_snippet?: string;
  explanation: string;
  confidence: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string;
  details: string;
}

export interface DashboardStats {
  total_patients: number;
  patients_change_percent: number;
  active_trials: number;
  pending_reviews: number;
  matches_today: number;
}

export interface MissingDataTask {
  id: string;
  patient_id: string;
  patient_name: string;
  description: string;
  priority: "high" | "medium" | "low";
  created_at: string;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
