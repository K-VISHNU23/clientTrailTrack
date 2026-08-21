// Core domain types for the Clinical Trial Matching platform

export type Gender = 'male' | 'female' | 'all';
export type TrialStatus = 'RECRUITING' | 'NOT_YET_RECRUITING' | 'ACTIVE' | 'COMPLETED' | 'CLOSED';
export type TrialPhase = 'PHASE_1' | 'PHASE_2' | 'PHASE_3' | 'PHASE_4' | 'OBSERVATIONAL';
export type ScreeningStatus = 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW' | 'NOT_SCREENED';

export interface LabValue {
  value: number;
  unit: string;
  date: string;
  status?: 'normal' | 'abnormal' | 'outdated' | 'missing';
}

export interface Patient {
  patient_id: string;
  age: number;
  gender: 'male' | 'female';
  conditions: string[];
  medications: string[];
  allergies: string[];
  labs: Record<string, LabValue>;
  notes: string;
  location: string;
  screeningStatus: ScreeningStatus;
}

export interface TrialLocation {
  city: string;
  country: string;
  facility: string;
}

export interface Trial {
  trial_id: string;
  title: string;
  status: TrialStatus;
  phase: TrialPhase;
  conditions: string[];
  age_min: number;
  age_max: number;
  gender: Gender;
  sponsor: string;
  inclusion_criteria: string[];
  exclusion_criteria: string[];
  locations: TrialLocation[];
  target_enrollment: number;
  enrolled: number;
  description: string;
  raw_eligibility_text: string;
}

export type CriterionResult = 'PASS' | 'FAIL' | 'NEEDS_REVIEW';

export interface CriterionEvaluation {
  criterion: string;
  type: 'inclusion' | 'exclusion';
  category: string;
  structured_rule: string;
  result: CriterionResult;
  reason: string;
  evidence: string;
  source: string;
  source_date?: string;
  confidence: number;
}

export interface MatchResult {
  patient_id: string;
  trial_id: string;
  status: ScreeningStatus;
  score: number;
  criteria: CriterionEvaluation[];
  missing_information: string[];
  summary: string;
}

export interface StructuredCriterion {
  id: string;
  text: string;
  type: 'inclusion' | 'exclusion';
  category: string;
  structured_rule: string;
  source: string;
  confidence: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  patient_id?: string;
  trial_id?: string;
  result?: string;
}

export interface ComplianceIssue {
  id: string;
  patient_id: string;
  trial_id: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  action: string;
}

export interface AlertItem {
  id: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export interface ResearchDocument {
  id: string;
  name: string;
  type: 'protocol' | 'eligibility' | 'clinical_note' | 'lab_report' | 'consent' | 'research';
  upload_date: string;
  trial_id?: string;
  patient_id?: string;
  size: string;
  status: 'processed' | 'processing' | 'pending';
  summary: string;
  extracted: {
    conditions: string[];
    medications: string[];
    lab_values: string[];
    eligibility_criteria: string[];
    dates: string[];
    restrictions: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  evidence?: string[];
  timestamp: string;
}

export type PageKey =
  | 'dashboard'
  | 'patients'
  | 'patient-detail'
  | 'trials'
  | 'trial-detail'
  | 'matching'
  | 'eligibility-review'
  | 'eligibility-extraction'
  | 'documents'
  | 'compliance'
  | 'monitoring'
  | 'assistant'
  | 'audit'
  | 'settings';
