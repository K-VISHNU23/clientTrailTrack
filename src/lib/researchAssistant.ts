import type { Patient, Trial, MatchResult } from '@/types';
import { getPatient, patients } from '@/data/patients';
import { trials, getTrial } from '@/data/trials';
import { matchPatientToTrial, matchPatientToAllTrials } from '@/lib/matching';

// Deterministic research assistant — answers questions using the matching
// engine and patient/trial data. No LLM hallucination; every answer is
// grounded in the synthetic data.

interface AssistantAnswer {
  content: string;
  evidence: string[];
}

function extractPatientId(query: string): string | undefined {
  const match = query.match(/P\d{3}/i);
  return match ? match[0].toUpperCase() : undefined;
}

function extractTrialId(query: string): string | undefined {
  const match = query.match(/NCT\d{8}/i);
  return match ? match[0].toUpperCase() : undefined;
}

export function answerResearchQuestion(query: string): AssistantAnswer {
  const lower = query.toLowerCase();
  const patientId = extractPatientId(query);
  const trialId = extractTrialId(query);

  // "Why is patient PX eligible for trial NCTY?"
  if (lower.includes('why') && lower.includes('eligible') && patientId && trialId) {
    return explainEligibility(patientId, trialId);
  }

  // "Which criteria caused patient PX to fail?"
  if ((lower.includes('fail') || lower.includes('ineligible')) && patientId) {
    return explainFailure(patientId, trialId);
  }

  // "Which trials require an HbA1c between 7 and 10%?"
  if (lower.includes('which trials') && lower.includes('hba1c')) {
    return findTrialsWithHbA1c();
  }

  // "Show patients needing review because of missing labs"
  if (lower.includes('needing review') || (lower.includes('needs review') && lower.includes('missing'))) {
    return findPatientsNeedingReview();
  }

  // "What information is missing for PX?"
  if (lower.includes('missing') && patientId) {
    return explainMissing(patientId, trialId);
  }

  // "Which trials is patient PX eligible for?"
  if (lower.includes('which trials') && lower.includes('eligible') && patientId) {
    return findEligibleTrials(patientId);
  }

  // Fallback: if a patient is mentioned, run a general summary
  if (patientId) {
    return patientSummary(patientId);
  }

  return {
    content: "I can help with questions about patient eligibility, trial criteria, and screening status. Try asking:\n\n• \"Why is patient P001 eligible for trial NCT00000001?\"\n• \"Which criteria caused patient P004 to fail?\"\n• \"Which trials require an HbA1c between 7 and 10%?\"\n• \"Show patients needing review because of missing labs.\"\n• \"What information is missing for P009?\"",
    evidence: [],
  };
}

function explainEligibility(patientId: string, trialId: string): AssistantAnswer {
  const patient = getPatient(patientId);
  const trial = getTrial(trialId);
  if (!patient || !trial) {
    return { content: `Could not find ${!patient ? `patient ${patientId}` : `trial ${trialId}`}.`, evidence: [] };
  }
  const result = matchPatientToTrial(patient, trial);
  const passed = result.criteria.filter((c) => c.result === 'PASS');

  let content = `Patient ${patientId} matches trial ${trialId} (${trial.title}) with a ${Math.round(result.score * 100)}% match score.\n\n`;
  content += `Here is why this patient matches:\n\n`;
  passed.forEach((c) => {
    content += `• ${c.criterion}: ${c.reason}\n`;
  });

  const evidence = passed.map((c) => `${c.source} — ${c.evidence}`);

  return { content, evidence };
}

function explainFailure(patientId: string, trialId?: string): AssistantAnswer {
  const patient = getPatient(patientId);
  if (!patient) return { content: `Could not find patient ${patientId}.`, evidence: [] };

  const trialsToCheck = trialId ? [getTrial(trialId)].filter(Boolean) as Trial[] : trials;
  const results = trialsToCheck.map((t) => matchPatientToTrial(patient, t));
  const failed = results.filter((r) => r.status === 'INELIGIBLE');

  if (failed.length === 0) {
    return { content: `Patient ${patientId} has not failed any evaluated trial criteria.`, evidence: [] };
  }

  let content = `Patient ${patientId} failed the following criteria:\n\n`;
  const evidence: string[] = [];
  failed.forEach((r) => {
    const fails = r.criteria.filter((c) => c.result === 'FAIL');
    fails.forEach((c) => {
      content += `• Trial ${r.trial_id} — ${c.criterion}: ${c.reason}\n`;
      evidence.push(`${c.source} — ${c.evidence}`);
    });
  });

  return { content, evidence };
}

function findTrialsWithHbA1c(): AssistantAnswer {
  const matching = trials.filter((t) =>
    [...t.inclusion_criteria, ...t.exclusion_criteria].some((c) => c.toLowerCase().includes('hba1c'))
  );

  let content = `${matching.length} trials require an HbA1c criterion:\n\n`;
  matching.forEach((t) => {
    const hba1cCriteria = [...t.inclusion_criteria, ...t.exclusion_criteria].filter((c) =>
      c.toLowerCase().includes('hba1c')
    );
    content += `• ${t.trial_id} — ${t.title}: ${hba1cCriteria.join('; ')}\n`;
  });

  return { content, evidence: matching.map((t) => `${t.trial_id} eligibility criteria`) };
}

function findPatientsNeedingReview(): AssistantAnswer {
  const reviewPatients = patients.filter((p: Patient) => p.screeningStatus === 'NEEDS_REVIEW');

  if (reviewPatients.length === 0) {
    return { content: 'No patients currently need review.', evidence: [] };
  }

  let content = `${reviewPatients.length} patient(s) need review due to missing or outdated information:\n\n`;
  reviewPatients.forEach((p: Patient) => {
    const outdated = Object.entries(p.labs).filter(([, v]) => v.status === 'outdated');
    const missing = Object.entries(p.labs).filter(([, v]) => v.status === 'missing');
    content += `• ${p.patient_id} — ${p.age}${p.gender[0].toUpperCase()}, ${p.conditions.join(', ')}\n`;
    if (outdated.length > 0) {
      content += `  Outdated: ${outdated.map(([k, v]) => `${k} (${v.date})`).join(', ')}\n`;
    }
    if (missing.length > 0) {
      content += `  Missing: ${missing.map(([k]) => k).join(', ')}\n`;
    }
  });

  return { content, evidence: reviewPatients.map((p: Patient) => `Patient ${p.patient_id} lab records`) };
}

function explainMissing(patientId: string, trialId?: string): AssistantAnswer {
  const patient = getPatient(patientId);
  if (!patient) return { content: `Could not find patient ${patientId}.`, evidence: [] };

  const trialsToCheck = trialId ? [getTrial(trialId)].filter(Boolean) as Trial[] : trials;
  const results = trialsToCheck.map((t) => matchPatientToTrial(patient, t));
  const allMissing = new Map<string, string[]>();

  results.forEach((r) => {
    r.criteria.filter((c) => c.result === 'NEEDS_REVIEW').forEach((c) => {
      const existing = allMissing.get(c.criterion) || [];
      existing.push(r.trial_id);
      allMissing.set(c.criterion, existing);
    });
  });

  if (allMissing.size === 0) {
    return { content: `No missing information detected for patient ${patientId}.`, evidence: [] };
  }

  let content = `The following information is missing or outdated for patient ${patientId}:\n\n`;
  allMissing.forEach((trials, criterion) => {
    content += `• ${criterion} (affects: ${trials.join(', ')})\n`;
  });

  const evidence: string[] = [];
  Object.entries(patient.labs).forEach(([k, v]) => {
    if (v.status === 'outdated' || v.status === 'missing') {
      evidence.push(`Lab record — ${k} — ${v.status === 'outdated' ? `${v.value}${v.unit} on ${v.date}` : 'missing'}`);
    }
  });

  return { content, evidence };
}

function findEligibleTrials(patientId: string): AssistantAnswer {
  const patient = getPatient(patientId);
  if (!patient) return { content: `Could not find patient ${patientId}.`, evidence: [] };

  const results = matchPatientToAllTrials(patient, trials);
  const eligible = results.filter((r) => r.status === 'ELIGIBLE');

  if (eligible.length === 0) {
    return { content: `Patient ${patientId} is not eligible for any currently active trials.`, evidence: [] };
  }

  let content = `Patient ${patientId} is eligible for ${eligible.length} trial(s):\n\n`;
  eligible.forEach((r) => {
    const t = getTrial(r.trial_id);
    content += `• ${r.trial_id} — ${t?.title}: ${Math.round(r.score * 100)}% match\n`;
  });

  return { content, evidence: eligible.map((r) => `${r.trial_id} match result`) };
}

function patientSummary(patientId: string): AssistantAnswer {
  const patient = getPatient(patientId);
  if (!patient) return { content: `Could not find patient ${patientId}.`, evidence: [] };

  const results = matchPatientToAllTrials(patient, trials);
  const eligible = results.filter((r) => r.status === 'ELIGIBLE').length;
  const ineligible = results.filter((r) => r.status === 'INELIGIBLE').length;
  const review = results.filter((r) => r.status === 'NEEDS_REVIEW').length;
  const topMatch = results[0];

  let content = `Patient ${patientId} — ${patient.age}${patient.gender[0].toUpperCase()}, ${patient.conditions.join(', ')}.\n\n`;
  content += `Screening summary across ${trials.length} trials:\n`;
  content += `• Eligible: ${eligible}\n`;
  content += `• Ineligible: ${ineligible}\n`;
  content += `• Needs Review: ${review}\n\n`;
  content += `Top match: ${topMatch.trial_id} at ${Math.round(topMatch.score * 100)}% (${topMatch.status}).`;

  const evidence = [
    `Patient record — ${patient.conditions.join(', ')}`,
    `Medications: ${patient.medications.join(', ')}`,
  ];

  return { content, evidence };
}
