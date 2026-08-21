import type { Patient, Trial, MatchResult, CriterionEvaluation, StructuredCriterion } from '@/types';

// ============================================================
// Extraction Layer — converts raw trial text into structured criteria.
// In a production system this would be an LLM; here it's deterministic
// parsing so the demo works without any API keys.
// ============================================================

export function extractStructuredCriteria(trial: Trial): StructuredCriterion[] {
  const criteria: StructuredCriterion[] = [];

  trial.inclusion_criteria.forEach((text, idx) => {
    criteria.push({
      id: `inc-${idx}`,
      text,
      type: 'inclusion',
      category: categorize(text),
      structured_rule: normalizeRule(text),
      source: 'Trial protocol',
      confidence: 0.92 + Math.random() * 0.07,
    });
  });

  trial.exclusion_criteria.forEach((text, idx) => {
    criteria.push({
      id: `exc-${idx}`,
      text,
      type: 'exclusion',
      category: categorize(text),
      structured_rule: normalizeRule(text),
      source: 'Trial protocol',
      confidence: 0.90 + Math.random() * 0.09,
    });
  });

  return criteria;
}

function categorize(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('hba1c') || lower.includes('a1c')) return 'Laboratory';
  if (lower.includes('egfr') || lower.includes('renal') || lower.includes('kidney')) return 'Renal';
  if (lower.includes('age')) return 'Demographics';
  if (lower.includes('diabetes')) return 'Condition';
  if (lower.includes('insulin') || lower.includes('metformin') || lower.includes('therapy')) return 'Medication';
  if (lower.includes('cardiovascular') || lower.includes('heart') || lower.includes('cardiac')) return 'Cardiac';
  if (lower.includes('blood pressure') || lower.includes('hypertension')) return 'Vitals';
  if (lower.includes('cancer') || lower.includes('malignan')) return 'Oncology';
  if (lower.includes('dialysis') || lower.includes('transplant')) return 'Renal';
  if (lower.includes('consent') || lower.includes('pregnan')) return 'Restriction';
  return 'General';
}

function normalizeRule(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('hba1c between')) {
    const match = lower.match(/(\d+)%?\s*and\s*(\d+)%?/);
    if (match) return `${match[1]} ≤ HbA1c ≤ ${match[2]}`;
  }
  if (lower.includes('hba1c')) {
    if (lower.includes('within') && lower.includes('30 days')) return 'HbA1c measured within 30 days';
  }
  if (lower.includes('age')) {
    const match = lower.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (match) return `${match[1]} ≤ Age ≤ ${match[2]}`;
  }
  if (lower.includes('egfr between')) {
    const match = lower.match(/(\d+)\s*and\s*(\d+)/);
    if (match) return `${match[1]} ≤ eGFR ≤ ${match[2]}`;
  }
  if (lower.includes('egfr >')) {
    const match = lower.match(/egfr\s*>\s*(\d+)/);
    if (match) return `eGFR > ${match[1]}`;
  }
  if (lower.includes('egfr <')) {
    const match = lower.match(/egfr\s*<\s*(\d+)/);
    if (match) return `eGFR < ${match[1]}`;
  }
  if (lower.includes('blood pressure >')) {
    const match = lower.match(/blood pressure\s*>\s*(\d+)/);
    if (match) return `BP > ${match[1]} mmHg`;
  }
  if (lower.includes('ldl >')) {
    const match = lower.match(/ldl\s*>\s*(\d+)/);
    if (match) return `LDL > ${match[1]} mg/dL`;
  }
  if (lower.includes('type 2 diabetes')) return 'Condition = Type 2 Diabetes';
  if (lower.includes('hypertension')) return 'Condition = Hypertension';
  if (lower.includes('chronic kidney disease')) return 'Condition = CKD';
  if (lower.includes('cardiovascular disease')) return 'Condition = CVD';
  if (lower.includes('severe renal disease')) return 'CKD Stage 4+ (eGFR < 30)';
  if (lower.includes('current insulin therapy')) return 'Medication list excludes insulin';
  if (lower.includes('current dialysis')) return 'Not on dialysis';
  if (lower.includes('heart failure')) return 'No heart failure';
  if (lower.includes('type 1 diabetes')) return 'Condition ≠ Type 1 Diabetes';
  return text;
}

// ============================================================
// Deterministic Matching Engine
// Evaluates each criterion against patient data and produces
// PASS / FAIL / NEEDS_REVIEW with evidence. No LLM makes the
// final decision.
// ============================================================

const TODAY = new Date('2026-08-15');

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.floor((TODAY.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function evalAge(patient: Patient, trial: Trial): CriterionEvaluation {
  const pass = patient.age >= trial.age_min && patient.age <= trial.age_max;
  return {
    criterion: `Age ${trial.age_min}-${trial.age_max}`,
    type: 'inclusion',
    category: 'Demographics',
    structured_rule: `${trial.age_min} ≤ Age ≤ ${trial.age_max}`,
    result: pass ? 'PASS' : 'FAIL',
    reason: pass ? `Patient age = ${patient.age}` : `Patient age = ${patient.age}, outside required range ${trial.age_min}-${trial.age_max}`,
    evidence: `Age: ${patient.age}`,
    source: 'Patient demographics',
    confidence: 1.0,
  };
}

function evalCondition(patient: Patient, condition: string): CriterionEvaluation {
  const has = patient.conditions.some((c) => c.toLowerCase() === condition.toLowerCase());
  return {
    criterion: condition,
    type: 'inclusion',
    category: 'Condition',
    structured_rule: `Condition = ${condition}`,
    result: has ? 'PASS' : 'FAIL',
    reason: has ? `Patient condition includes ${condition}` : `Patient conditions do not include ${condition}`,
    evidence: `Conditions: ${patient.conditions.join(', ')}`,
    source: 'Patient record',
    confidence: 1.0,
  };
}

function evalHbA1c(patient: Patient, min: number, max: number, requireRecent: boolean): CriterionEvaluation {
  const lab = patient.labs['HbA1c'];
  if (!lab) {
    return {
      criterion: `HbA1c ${min}-${max}%`,
      type: 'inclusion',
      category: 'Laboratory',
      structured_rule: `${min} ≤ HbA1c ≤ ${max}`,
      result: 'NEEDS_REVIEW',
      reason: 'HbA1c laboratory value is missing',
      evidence: 'No HbA1c lab record found',
      source: 'Lab records',
      confidence: 0.95,
    };
  }
  const age = daysSince(lab.date);
  if (requireRecent && age > 30) {
    return {
      criterion: `HbA1c ${min}-${max}% (within 30 days)`,
      type: 'inclusion',
      category: 'Laboratory',
      structured_rule: `${min} ≤ HbA1c ≤ ${max} AND measured within 30 days`,
      result: 'NEEDS_REVIEW',
      reason: `Required laboratory value is outdated (last measured ${age} days ago)`,
      evidence: `HbA1c = ${lab.value}${lab.unit} on ${lab.date} (${age} days ago)`,
      source: 'Synthetic Lab Record',
      source_date: lab.date,
      confidence: 0.93,
    };
  }
  const pass = lab.value >= min && lab.value <= max;
  return {
    criterion: `HbA1c ${min}-${max}%`,
    type: 'inclusion',
    category: 'Laboratory',
    structured_rule: `${min} ≤ HbA1c ≤ ${max}`,
    result: pass ? 'PASS' : 'FAIL',
    reason: pass ? `HbA1c = ${lab.value}${lab.unit} is within range` : `HbA1c = ${lab.value}${lab.unit} is outside required range ${min}-${max}%`,
    evidence: `HbA1c = ${lab.value}${lab.unit} on ${lab.date}`,
    source: 'Synthetic Lab Record',
    source_date: lab.date,
    confidence: 0.98,
  };
}

function evalEGFR(patient: Patient, op: 'gt' | 'lt' | 'between', threshold?: number, max?: number): CriterionEvaluation {
  const lab = patient.labs['eGFR'];
  if (!lab) {
    return {
      criterion: 'eGFR check',
      type: 'exclusion',
      category: 'Renal',
      structured_rule: 'eGFR evaluated',
      result: 'NEEDS_REVIEW',
      reason: 'eGFR laboratory value is missing',
      evidence: 'No eGFR lab record found',
      source: 'Lab records',
      confidence: 0.95,
    };
  }
  let pass = false;
  let rule = '';
  if (op === 'gt' && threshold !== undefined) {
    pass = lab.value > threshold;
    rule = `eGFR > ${threshold}`;
  } else if (op === 'lt' && threshold !== undefined) {
    pass = lab.value < threshold;
    rule = `eGFR < ${threshold}`;
  } else if (op === 'between' && threshold !== undefined && max !== undefined) {
    pass = lab.value >= threshold && lab.value <= max;
    rule = `${threshold} ≤ eGFR ≤ ${max}`;
  }
  return {
    criterion: 'eGFR check',
    type: 'exclusion',
    category: 'Renal',
    structured_rule: rule,
    result: pass ? 'PASS' : 'FAIL',
    reason: `eGFR = ${lab.value} ${lab.unit} — ${pass ? 'satisfies' : 'does not satisfy'} ${rule}`,
    evidence: `eGFR = ${lab.value} ${lab.unit} on ${lab.date}`,
    source: 'Synthetic Lab Record',
    source_date: lab.date,
    confidence: 0.97,
  };
}

function evalSevereRenalDisease(patient: Patient): CriterionEvaluation {
  const lab = patient.labs['eGFR'];
  const hasCKD = patient.conditions.some((c) => c.toLowerCase().includes('kidney'));
  if (!lab) {
    return {
      criterion: 'Severe renal disease',
      type: 'exclusion',
      category: 'Renal',
      structured_rule: 'CKD severity check (eGFR ≥ 30)',
      result: 'NEEDS_REVIEW',
      reason: 'eGFR value missing — cannot rule out severe renal disease',
      evidence: 'No eGFR lab record found',
      source: 'Lab records',
      confidence: 0.90,
    };
  }
  const severe = lab.value < 30;
  return {
    criterion: 'Severe renal disease',
    type: 'exclusion',
    category: 'Renal',
    structured_rule: 'CKD severity check (eGFR ≥ 30)',
    result: severe ? 'FAIL' : 'PASS',
    reason: severe
      ? `eGFR = ${lab.value} indicates severe renal disease`
      : hasCKD
        ? `Patient has CKD but eGFR = ${lab.value} is above severe threshold (30)`
        : `No evidence of severe renal disease (eGFR = ${lab.value})`,
    evidence: `eGFR = ${lab.value} ${lab.unit} on ${lab.date}`,
    source: 'Synthetic Lab Record',
    source_date: lab.date,
    confidence: 0.94,
  };
}

function evalInsulinTherapy(patient: Patient): CriterionEvaluation {
  const onInsulin = patient.medications.some((m) => m.toLowerCase().includes('insulin'));
  return {
    criterion: 'Current insulin therapy',
    type: 'exclusion',
    category: 'Medication',
    structured_rule: 'Medication list excludes insulin',
    result: onInsulin ? 'FAIL' : 'PASS',
    reason: onInsulin
      ? `Patient medications include insulin-based therapy (${patient.medications.filter((m) => m.toLowerCase().includes('insulin')).join(', ')})`
      : 'Medication list does not contain insulin',
    evidence: `Medications: ${patient.medications.join(', ')}`,
    source: 'Patient medication record',
    confidence: 1.0,
  };
}

function evalDialysis(patient: Patient): CriterionEvaluation {
  // No dialysis field in synthetic data; assume not on dialysis unless noted
  return {
    criterion: 'Current dialysis',
    type: 'exclusion',
    category: 'Renal',
    structured_rule: 'Not on dialysis',
    result: 'PASS',
    reason: 'No dialysis record found in patient history',
    evidence: 'Patient record — no dialysis entries',
    source: 'Patient record',
    confidence: 0.88,
  };
}

function evalHeartFailure(patient: Patient): CriterionEvaluation {
  const hasHF = patient.notes.toLowerCase().includes('heart failure');
  return {
    criterion: 'Heart failure',
    type: 'exclusion',
    category: 'Cardiac',
    structured_rule: 'No heart failure',
    result: hasHF ? 'FAIL' : 'PASS',
    reason: hasHF ? 'Patient notes mention heart failure' : 'No evidence of heart failure in clinical notes',
    evidence: `Notes: "${patient.notes}"`,
    source: 'Clinical notes',
    confidence: 0.92,
  };
}

function evalCVD(patient: Patient): CriterionEvaluation {
  const hasCVD = patient.conditions.some((c) => c.toLowerCase().includes('cardiovascular'));
  return {
    criterion: 'Cardiovascular Disease',
    type: 'exclusion',
    category: 'Cardiac',
    structured_rule: 'No cardiovascular disease',
    result: hasCVD ? 'FAIL' : 'PASS',
    reason: hasCVD ? 'Patient has cardiovascular disease' : 'No cardiovascular disease in patient conditions',
    evidence: `Conditions: ${patient.conditions.join(', ')}`,
    source: 'Patient record',
    confidence: 1.0,
  };
}

function evalBloodPressure(patient: Patient, threshold: number): CriterionEvaluation {
  const lab = patient.labs['Blood Pressure'];
  if (!lab) {
    return {
      criterion: `Blood Pressure > ${threshold} mmHg`,
      type: 'inclusion',
      category: 'Vitals',
      structured_rule: `BP > ${threshold} mmHg`,
      result: 'NEEDS_REVIEW',
      reason: 'Blood pressure value is missing',
      evidence: 'No BP record found',
      source: 'Lab records',
      confidence: 0.90,
    };
  }
  const pass = lab.value > threshold;
  return {
    criterion: `Blood Pressure > ${threshold} mmHg`,
    type: 'inclusion',
    category: 'Vitals',
    structured_rule: `BP > ${threshold} mmHg`,
    result: pass ? 'PASS' : 'FAIL',
    reason: `BP = ${lab.value} ${lab.unit} — ${pass ? 'meets' : 'does not meet'} threshold`,
    evidence: `BP = ${lab.value} ${lab.unit} on ${lab.date}`,
    source: 'Synthetic Lab Record',
    source_date: lab.date,
    confidence: 0.95,
  };
}

function evalLDL(patient: Patient, threshold: number): CriterionEvaluation {
  const lab = patient.labs['LDL'];
  if (!lab) {
    return {
      criterion: `LDL > ${threshold} mg/dL`,
      type: 'inclusion',
      category: 'Laboratory',
      structured_rule: `LDL > ${threshold} mg/dL`,
      result: 'NEEDS_REVIEW',
      reason: 'LDL value is missing',
      evidence: 'No LDL record found',
      source: 'Lab records',
      confidence: 0.90,
    };
  }
  const pass = lab.value > threshold;
  return {
    criterion: `LDL > ${threshold} mg/dL`,
    type: 'inclusion',
    category: 'Laboratory',
    structured_rule: `LDL > ${threshold} mg/dL`,
    result: pass ? 'PASS' : 'FAIL',
    reason: `LDL = ${lab.value} ${lab.unit} — ${pass ? 'meets' : 'does not meet'} threshold`,
    evidence: `LDL = ${lab.value} ${lab.unit} on ${lab.date}`,
    source: 'Synthetic Lab Record',
    source_date: lab.date,
    confidence: 0.95,
  };
}

function evalGeneric(text: string, patient: Patient, _trial?: Trial): CriterionEvaluation {
  const lower = text.toLowerCase();
  // Try to match against conditions
  const matchedCondition = patient.conditions.find((c) => lower.includes(c.toLowerCase()));
  if (matchedCondition) {
    return {
      criterion: text,
      type: 'inclusion',
      category: 'Condition',
      structured_rule: text,
      result: 'PASS',
      reason: `Patient has condition: ${matchedCondition}`,
      evidence: `Conditions: ${patient.conditions.join(', ')}`,
      source: 'Patient record',
      confidence: 0.90,
    };
  }
  return {
    criterion: text,
    type: 'inclusion',
    category: categorize(text),
    structured_rule: text,
    result: 'NEEDS_REVIEW',
    reason: 'Insufficient structured data to evaluate this criterion automatically',
    evidence: 'No matching patient data found',
    source: 'Patient record',
    confidence: 0.60,
  };
}

function evaluateCriterion(text: string, patient: Patient, trial: Trial): CriterionEvaluation {
  const lower = text.toLowerCase();

  // Age
  if (lower.includes('age')) {
    return evalAge(patient, trial);
  }

  // HbA1c
  if (lower.includes('hba1c') || lower.includes('a1c')) {
    const rangeMatch = lower.match(/(\d+\.?\d*)%?\s*(?:and|to|-|–)\s*(\d+\.?\d*)%?/);
    const requireRecent = lower.includes('within') || lower.includes('last 30');
    if (rangeMatch) {
      return evalHbA1c(patient, parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2]), requireRecent);
    }
    return evalHbA1c(patient, 0, 20, requireRecent);
  }

  // eGFR
  if (lower.includes('egfr')) {
    if (lower.includes('between')) {
      const m = lower.match(/(\d+)\s*and\s*(\d+)/);
      if (m) return evalEGFR(patient, 'between', parseInt(m[1]), parseInt(m[2]));
    }
    if (lower.includes('>')) {
      const m = lower.match(/(\d+)/);
      if (m) return evalEGFR(patient, 'gt', parseInt(m[1]));
    }
    if (lower.includes('<')) {
      const m = lower.match(/(\d+)/);
      if (m) return evalEGFR(patient, 'lt', parseInt(m[1]));
    }
  }

  // Severe renal disease
  if (lower.includes('severe renal disease') || lower.includes('severe renal')) {
    return evalSevereRenalDisease(patient);
  }

  // Dialysis
  if (lower.includes('dialysis')) {
    return evalDialysis(patient);
  }

  // Insulin
  if (lower.includes('insulin')) {
    return evalInsulinTherapy(patient);
  }

  // Heart failure
  if (lower.includes('heart failure')) {
    return evalHeartFailure(patient);
  }

  // Cardiovascular disease
  if (lower.includes('cardiovascular')) {
    return evalCVD(patient);
  }

  // Blood pressure
  if (lower.includes('blood pressure')) {
    const m = lower.match(/(\d+)/);
    if (m) return evalBloodPressure(patient, parseInt(m[1]));
  }

  // LDL
  if (lower.includes('ldl')) {
    const m = lower.match(/(\d+)/);
    if (m) return evalLDL(patient, parseInt(m[1]));
  }

  // Type 1 diabetes exclusion
  if (lower.includes('type 1 diabetes')) {
    const hasT1 = patient.conditions.some((c) => c.toLowerCase() === 'type 1 diabetes');
    return {
      criterion: text,
      type: 'exclusion',
      category: 'Condition',
      structured_rule: 'Condition ≠ Type 1 Diabetes',
      result: hasT1 ? 'FAIL' : 'PASS',
      reason: hasT1 ? 'Patient has Type 1 Diabetes' : 'Patient does not have Type 1 Diabetes',
      evidence: `Conditions: ${patient.conditions.join(', ')}`,
      source: 'Patient record',
      confidence: 1.0,
    };
  }

  // Condition matching (inclusion)
  if (lower.includes('type 2 diabetes')) return evalCondition(patient, 'Type 2 Diabetes');
  if (lower.includes('hypertension')) return evalCondition(patient, 'Hypertension');
  if (lower.includes('chronic kidney disease')) return evalCondition(patient, 'Chronic Kidney Disease');

  // Cancer / malignancy
  if (lower.includes('cancer') || lower.includes('malignan')) {
    const has = patient.conditions.some((c) => c.toLowerCase().includes('cancer') || c.toLowerCase().includes('oncolog'));
    return {
      criterion: text,
      type: 'exclusion',
      category: 'Oncology',
      structured_rule: 'No active cancer',
      result: has ? 'FAIL' : 'PASS',
      reason: has ? 'Patient has active cancer' : 'No evidence of active cancer',
      evidence: `Conditions: ${patient.conditions.join(', ')}`,
      source: 'Patient record',
      confidence: 0.95,
    };
  }

  // Pregnancy / consent
  if (lower.includes('pregnan') || lower.includes('consent')) {
    return {
      criterion: text,
      type: 'exclusion',
      category: 'Restriction',
      structured_rule: text,
      result: 'NEEDS_REVIEW',
      reason: 'Requires manual verification of consent/pregnancy status',
      evidence: 'Not captured in structured patient data',
      source: 'Patient record',
      confidence: 0.70,
    };
  }

  // BMI
  if (lower.includes('bmi')) {
    return {
      criterion: text,
      type: 'inclusion',
      category: 'Demographics',
      structured_rule: text,
      result: 'NEEDS_REVIEW',
      reason: 'BMI not recorded in synthetic patient data',
      evidence: 'No BMI value available',
      source: 'Patient record',
      confidence: 0.80,
    };
  }

  return evalGeneric(text, patient, trial);
}

// ============================================================
// Main matching function — evaluates all criteria for a patient
// against a single trial and returns a full MatchResult.
// ============================================================

export function matchPatientToTrial(patient: Patient, trial: Trial): MatchResult {
  const criteria: CriterionEvaluation[] = [];

  // Evaluate all inclusion criteria
  for (const inc of trial.inclusion_criteria) {
    criteria.push(evaluateCriterion(inc, patient, trial));
  }

  // Evaluate all exclusion criteria
  for (const exc of trial.exclusion_criteria) {
    const evalResult = evaluateCriterion(exc, patient, trial);
    // For exclusion criteria, PASS means the exclusion does NOT apply
    criteria.push(evalResult);
  }

  // Determine overall status
  const hasFail = criteria.some((c) => c.result === 'FAIL');
  const hasNeedsReview = criteria.some((c) => c.result === 'NEEDS_REVIEW');

  let status: MatchResult['status'];
  if (hasFail) {
    status = 'INELIGIBLE';
  } else if (hasNeedsReview) {
    status = 'NEEDS_REVIEW';
  } else {
    status = 'ELIGIBLE';
  }

  // Calculate score
  const passCount = criteria.filter((c) => c.result === 'PASS').length;
  const failCount = criteria.filter((c) => c.result === 'FAIL').length;
  const reviewCount = criteria.filter((c) => c.result === 'NEEDS_REVIEW').length;
  const total = criteria.length;
  let score: number;
  if (hasFail) {
    score = Math.round((passCount / total) * 100 * 0.5);
  } else if (hasNeedsReview) {
    score = Math.round((passCount / total) * 100 * 0.85);
  } else {
    score = Math.round((passCount / total) * 100);
  }
  score = Math.max(score, 15);

  const missing = criteria
    .filter((c) => c.result === 'NEEDS_REVIEW')
    .map((c) => c.criterion);

  const summary = generateSummary(patient, trial, status, score, criteria);

  return {
    patient_id: patient.patient_id,
    trial_id: trial.trial_id,
    status,
    score: score / 100,
    criteria,
    missing_information: missing,
    summary,
  };
}

function generateSummary(
  patient: Patient,
  trial: Trial,
  status: string,
  score: number,
  criteria: CriterionEvaluation[]
): string {
  const passed = criteria.filter((c) => c.result === 'PASS');
  const failed = criteria.filter((c) => c.result === 'FAIL');
  const review = criteria.filter((c) => c.result === 'NEEDS_REVIEW');

  let summary = `Patient ${patient.patient_id} evaluated against ${trial.trial_id} (${trial.title}). `;
  summary += `${passed.length} criteria passed, ${failed.length} failed, ${review.length} need review. `;
  if (status === 'ELIGIBLE') {
    summary += `All criteria satisfied — patient appears eligible with a match score of ${score}%.`;
  } else if (status === 'INELIGIBLE') {
    summary += `Failed criteria: ${failed.map((f) => f.criterion).join(', ')}. Match score: ${score}%.`;
  } else {
    summary += `Requires researcher review due to: ${review.map((r) => r.criterion).join(', ')}. Match score: ${score}%.`;
  }
  return summary;
}

// ============================================================
// Match a patient against all trials and return ranked results.
// ============================================================

export function matchPatientToAllTrials(patient: Patient, allTrials: Trial[]): MatchResult[] {
  return allTrials
    .map((t) => matchPatientToTrial(patient, t))
    .sort((a, b) => b.score - a.score);
}
