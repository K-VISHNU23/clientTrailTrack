import type { Trial } from '@/types';

// 8 synthetic clinical trials for the research prototype.

export const trials: Trial[] = [
  {
    trial_id: 'NCT00000001',
    title: 'Example Diabetes Study',
    status: 'RECRUITING',
    phase: 'PHASE_3',
    conditions: ['Type 2 Diabetes'],
    age_min: 18,
    age_max: 65,
    gender: 'all',
    sponsor: 'National Diabetes Research Institute',
    inclusion_criteria: ['Type 2 Diabetes', 'Age 18-65', 'HbA1c between 7% and 10%'],
    exclusion_criteria: ['Severe renal disease', 'Current insulin therapy'],
    locations: [{ city: 'Chennai', country: 'India', facility: 'Apollo Diabetes Center' }],
    target_enrollment: 100,
    enrolled: 24,
    description:
      'A Phase 3 randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of a novel oral adjunct therapy in adults with Type 2 Diabetes inadequately controlled on metformin.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 18 to 65 years
- Confirmed diagnosis of Type 2 Diabetes Mellitus
- HbA1c between 7% and 10% at screening
- Willing to maintain current medication regimen for the study duration

Exclusion Criteria:
- Severe renal disease (eGFR < 30 mL/min/1.73m2)
- Current insulin therapy (any route)
- History of severe hypoglycemia in the past 6 months
- Pregnancy or planning to become pregnant during the study`,
  },
  {
    trial_id: 'NCT00000002',
    title: 'Diabetes Metabolic Study',
    status: 'RECRUITING',
    phase: 'PHASE_2',
    conditions: ['Type 2 Diabetes'],
    age_min: 25,
    age_max: 70,
    gender: 'all',
    sponsor: 'Metabolic Health Foundation',
    inclusion_criteria: ['Type 2 Diabetes', 'Age 25-70', 'HbA1c between 6.5% and 9%'],
    exclusion_criteria: ['Severe renal disease', 'Current insulin therapy', 'Active cancer'],
    locations: [{ city: 'Bengaluru', country: 'India', facility: 'Narayana Health City' }],
    target_enrollment: 80,
    enrolled: 18,
    description:
      'A Phase 2 study investigating metabolic outcomes in adults with Type 2 Diabetes using a continuous glucose monitoring intervention.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 25 to 70 years
- Type 2 Diabetes Mellitus
- HbA1c between 6.5% and 9% within the last 30 days
- eGFR > 40 mL/min/1.73m2

Exclusion Criteria:
- Severe renal disease
- Current insulin therapy
- Active cancer or recent chemotherapy
- Severe cardiovascular event within 3 months`,
  },
  {
    trial_id: 'NCT00000003',
    title: 'Diabetes Intervention Trial',
    status: 'RECRUITING',
    phase: 'PHASE_3',
    conditions: ['Type 2 Diabetes'],
    age_min: 18,
    age_max: 50,
    gender: 'all',
    sponsor: 'Global Diabetes Consortium',
    inclusion_criteria: ['Type 2 Diabetes', 'Age 18-50', 'HbA1c between 7% and 9%'],
    exclusion_criteria: ['Current insulin therapy', 'Cardiovascular Disease'],
    locations: [{ city: 'Chennai', country: 'India', facility: 'Madras Medical College' }],
    target_enrollment: 120,
    enrolled: 31,
    description:
      'A Phase 3 interventional study testing a once-weekly GLP-1 receptor agonist in younger adults with Type 2 Diabetes.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 18 to 50 years
- Type 2 Diabetes Mellitus
- HbA1c between 7% and 9% (measured within last 30 days)
- BMI > 25

Exclusion Criteria:
- Current insulin therapy
- Cardiovascular disease
- Severe renal impairment (eGFR < 30)
- HbA1c not measured in the last 30 days`,
  },
  {
    trial_id: 'NCT00000004',
    title: 'Hypertension Management Study',
    status: 'RECRUITING',
    phase: 'PHASE_2',
    conditions: ['Hypertension'],
    age_min: 30,
    age_max: 75,
    gender: 'all',
    sponsor: 'Cardiovascular Research Alliance',
    inclusion_criteria: ['Hypertension', 'Age 30-75', 'Blood Pressure > 140 mmHg'],
    exclusion_criteria: ['Severe renal disease', 'Heart failure'],
    locations: [{ city: 'Delhi', country: 'India', facility: 'AIIMS Cardiology Dept' }],
    target_enrollment: 60,
    enrolled: 12,
    description:
      'A Phase 2 study evaluating a combination antihypertensive therapy in adults with uncontrolled hypertension.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 30 to 75 years
- Diagnosis of Hypertension
- Systolic Blood Pressure > 140 mmHg at screening

Exclusion Criteria:
- Severe renal disease
- Heart failure (NYHA Class III/IV)
- Recent stroke (< 6 months)`,
  },
  {
    trial_id: 'NCT00000005',
    title: 'CKD Progression Trial',
    status: 'RECRUITING',
    phase: 'PHASE_3',
    conditions: ['Chronic Kidney Disease'],
    age_min: 40,
    age_max: 80,
    gender: 'all',
    sponsor: 'Renal Health Initiative',
    inclusion_criteria: ['Chronic Kidney Disease', 'Age 40-80', 'eGFR between 20 and 60'],
    exclusion_criteria: ['Current dialysis', 'Active transplant'],
    locations: [{ city: 'Mumbai', country: 'India', facility: 'Kokilaben Hospital' }],
    target_enrollment: 200,
    enrolled: 45,
    description:
      'A Phase 3 study of a novel renoprotective agent in adults with Stage 3-4 CKD.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 40 to 80 years
- Chronic Kidney Disease (Stage 3 or 4)
- eGFR between 20 and 60 mL/min/1.73m2

Exclusion Criteria:
- Current dialysis
- Active kidney transplant
- Severe hepatic impairment`,
  },
  {
    trial_id: 'NCT00000006',
    title: 'Cardiovascular Outcomes Study',
    status: 'NOT_YET_RECRUITING',
    phase: 'PHASE_4',
    conditions: ['Cardiovascular Disease'],
    age_min: 50,
    age_max: 85,
    gender: 'all',
    sponsor: 'Heart Care Network',
    inclusion_criteria: ['Cardiovascular Disease', 'Age 50-85'],
    exclusion_criteria: ['Recent MI (< 3 months)', 'Severe renal disease'],
    locations: [{ city: 'Pune', country: 'India', facility: 'Ruby Hall Clinic' }],
    target_enrollment: 150,
    enrolled: 0,
    description:
      'A Phase 4 post-marketing study on long-term cardiovascular outcomes with a PCSK9 inhibitor.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 50 to 85 years
- Documented Cardiovascular Disease
- LDL > 100 mg/dL

Exclusion Criteria:
- Recent myocardial infarction (< 3 months)
- Severe renal disease
- Uncontrolled arrhythmia`,
  },
  {
    trial_id: 'NCT00000007',
    title: 'Early-Onset Diabetes Registry',
    status: 'RECRUITING',
    phase: 'OBSERVATIONAL',
    conditions: ['Type 2 Diabetes'],
    age_min: 18,
    age_max: 40,
    gender: 'all',
    sponsor: 'Young Diabetes Foundation',
    inclusion_criteria: ['Type 2 Diabetes', 'Age 18-40', 'HbA1c between 6% and 10%'],
    exclusion_criteria: ['Type 1 Diabetes', 'Gestational diabetes'],
    locations: [{ city: 'Hyderabad', country: 'India', facility: 'NIMS Diabetes Unit' }],
    target_enrollment: 300,
    enrolled: 67,
    description:
      'An observational registry tracking long-term outcomes in adults diagnosed with Type 2 Diabetes before age 40.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 18 to 40 years
- Type 2 Diabetes Mellitus
- HbA1c between 6% and 10%

Exclusion Criteria:
- Type 1 Diabetes
- Gestational diabetes
- Secondary diabetes (pancreatic, drug-induced)`,
  },
  {
    trial_id: 'NCT00000008',
    title: 'Renal-Diabetes Combination Study',
    status: 'RECRUITING',
    phase: 'PHASE_2',
    conditions: ['Type 2 Diabetes', 'Chronic Kidney Disease'],
    age_min: 35,
    age_max: 70,
    gender: 'all',
    sponsor: 'Diabetes-Kidney Research Group',
    inclusion_criteria: ['Type 2 Diabetes', 'Chronic Kidney Disease', 'Age 35-70', 'eGFR between 30 and 70'],
    exclusion_criteria: ['Current insulin therapy', 'Current dialysis'],
    locations: [
      { city: 'Chennai', country: 'India', facility: 'Apollo Kidney Center' },
      { city: 'Mumbai', country: 'India', facility: 'Hinduja Hospital' },
    ],
    target_enrollment: 90,
    enrolled: 21,
    description:
      'A Phase 2 study of a dual SGLT2/GLP-1 therapy in patients with both Type 2 Diabetes and moderate CKD.',
    raw_eligibility_text: `Inclusion Criteria:
- Adults aged 35 to 70 years
- Type 2 Diabetes Mellitus
- Chronic Kidney Disease
- eGFR between 30 and 70 mL/min/1.73m2
- HbA1c between 7% and 10%

Exclusion Criteria:
- Current insulin therapy
- Current dialysis
- Active malignancy`,
  },
];

export function getTrial(id: string): Trial | undefined {
  return trials.find((t) => t.trial_id === id);
}
