// Dashboard statistics and chart data for the research prototype.

export const dashboardKPIs = [
  { key: 'screened', label: 'Patients Screened', value: 128, trend: '+12%', trendUp: true, icon: 'Users', color: 'navy' },
  { key: 'trials', label: 'Active Clinical Trials', value: 24, trend: '+3', trendUp: true, icon: 'FlaskConical', color: 'teal' },
  { key: 'matches', label: 'Potential Matches', value: 47, trend: '+8', trendUp: true, icon: 'Target', color: 'navy' },
  { key: 'review', label: 'Needs Review', value: 12, trend: '-2', trendUp: false, icon: 'AlertCircle', color: 'amber' },
  { key: 'eligible', label: 'Eligible Patients', value: 31, trend: '+5', trendUp: true, icon: 'CheckCircle', color: 'teal' },
  { key: 'recruiting', label: 'Trials Recruiting', value: 18, trend: '+2', trendUp: true, icon: 'Activity', color: 'navy' },
];

export const screeningTrend = [
  { day: 'Mon', eligible: 18, ineligible: 7, needsReview: 3 },
  { day: 'Tue', eligible: 22, ineligible: 9, needsReview: 4 },
  { day: 'Wed', eligible: 20, ineligible: 6, needsReview: 5 },
  { day: 'Thu', eligible: 26, ineligible: 8, needsReview: 3 },
  { day: 'Fri', eligible: 24, ineligible: 10, needsReview: 4 },
  { day: 'Sat', eligible: 19, ineligible: 5, needsReview: 2 },
  { day: 'Sun', eligible: 28, ineligible: 7, needsReview: 3 },
];

export const matchDistribution = [
  { label: 'Eligible', value: 31, color: '#28a085' },
  { label: 'Ineligible', value: 18, color: '#dc2626' },
  { label: 'Needs Review', value: 12, color: '#f99407' },
];

export const topConditions = [
  { condition: 'Type 2 Diabetes', count: 42 },
  { condition: 'Hypertension', count: 35 },
  { condition: 'Oncology', count: 22 },
  { condition: 'Cardiovascular Disease', count: 18 },
  { condition: 'Chronic Kidney Disease', count: 14 },
];

export const recentScreening = [
  { patient: 'P001', trial: 'NCT00000001', result: 'ELIGIBLE', score: 92, date: '2026-08-15 10:42' },
  { patient: 'P004', trial: 'NCT00000001', result: 'INELIGIBLE', score: 31, date: '2026-08-15 10:15' },
  { patient: 'P009', trial: 'NCT00000003', result: 'NEEDS_REVIEW', score: 64, date: '2026-08-15 09:52' },
  { patient: 'P006', trial: 'NCT00000001', result: 'ELIGIBLE', score: 88, date: '2026-08-14 11:05' },
  { patient: 'P011', trial: 'NCT00000007', result: 'ELIGIBLE', score: 95, date: '2026-08-13 16:50' },
  { patient: 'P003', trial: 'NCT00000001', result: 'INELIGIBLE', score: 28, date: '2026-08-13 14:20' },
];

export const trialPerformance = [
  { trial: 'NCT00000001', title: 'Example Diabetes Study', screened: 68, eligible: 31, enrolled: 24 },
  { trial: 'NCT00000002', title: 'Diabetes Metabolic Study', screened: 42, eligible: 18, enrolled: 18 },
  { trial: 'NCT00000003', title: 'Diabetes Intervention Trial', screened: 55, eligible: 31, enrolled: 31 },
  { trial: 'NCT00000005', title: 'CKD Progression Trial', screened: 38, eligible: 22, enrolled: 45 },
  { trial: 'NCT00000007', title: 'Early-Onset Diabetes Registry', screened: 72, eligible: 67, enrolled: 67 },
];

export const funnelData = [
  { stage: 'Identified', value: 128, color: '#3d5f95' },
  { stage: 'Screened', value: 68, color: '#5b80b5' },
  { stage: 'Eligible', value: 31, color: '#28a085' },
  { stage: 'Enrolled', value: 24, color: '#1c8069' },
];

export const complianceMetrics = {
  screeningCompliance: 96,
  missingDocumentation: 8,
  outdatedLabs: 5,
  pendingReviews: 12,
  auditEvents: 143,
};

export const researchAssistantSuggestions = [
  'Why is patient P001 eligible for trial NCT00000001?',
  'Which criteria caused patient P004 to fail?',
  'Which trials require an HbA1c between 7 and 10%?',
  'Show patients needing review because of missing labs.',
  'What information is missing for P009?',
  'Which trials is patient P011 eligible for?',
];
