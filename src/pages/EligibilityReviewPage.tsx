import { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, ChevronLeft, FileText,
  ShieldCheck, ScrollText, Calendar, Database, User,
} from 'lucide-react';
import { Card, Badge, Button, StatusBadge, ScoreRing, Modal } from '@/components/ui';
import { useNav } from '@/context/NavContext';
import { getPatient } from '@/data/patients';
import { getTrial } from '@/data/trials';
import { matchPatientToTrial } from '@/lib/matching';
import type { CriterionEvaluation, CriterionResult } from '@/types';

const resultConfig: Record<CriterionResult, { icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  PASS: { icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  FAIL: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  NEEDS_REVIEW: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
};

export function EligibilityReviewPage() {
  const { params, navigate } = useNav();
  const [evidenceCriterion, setEvidenceCriterion] = useState<CriterionEvaluation | null>(null);

  const patient = getPatient(params.patientId);
  const trial = getTrial(params.trialId);

  if (!patient || !trial) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Missing patient or trial information.</p>
          <Button onClick={() => navigate('matching')}>Go to Trial Matching</Button>
        </div>
      </Card>
    );
  }

  const result = matchPatientToTrial(patient, trial);
  const score = Math.round(result.score * 100);
  const passed = result.criteria.filter((c) => c.result === 'PASS');
  const failed = result.criteria.filter((c) => c.result === 'FAIL');
  const review = result.criteria.filter((c) => c.result === 'NEEDS_REVIEW');

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate('matching', { patientId: patient.patient_id })}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Matching
      </button>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Eligibility Review</h2>
          <p className="text-sm text-slate-500 mt-1">
            <span className="font-semibold text-navy-700">{patient.patient_id}</span> × <span className="font-mono">{trial.trial_id}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ScoreRing score={score} size={72} />
          <StatusBadge status={result.status} />
        </div>
      </div>

      {/* Patient + Trial side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Patient panel */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-navy-500" />
            <h3 className="font-semibold text-navy-800 text-sm">Patient Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Patient ID:</span><span className="font-medium text-navy-700">{patient.patient_id}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Age:</span><span className="font-medium text-navy-700">{patient.age}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Gender:</span><span className="font-medium text-navy-700 capitalize">{patient.gender}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Location:</span><span className="font-medium text-navy-700">{patient.location}</span></div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block mb-1">Conditions:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.conditions.map((c) => <Badge key={c} variant="navy">{c}</Badge>)}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Medications:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.medications.map((m) => <Badge key={m} variant="teal">{m}</Badge>)}
              </div>
            </div>
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Key Labs:</span>
              <div className="space-y-1">
                {Object.entries(patient.labs).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-medium text-navy-700">{v.value} {v.unit} <span className="text-slate-400">({v.date})</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Trial panel */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <ScrollText className="h-4 w-4 text-navy-500" />
            <h3 className="font-semibold text-navy-800 text-sm">Trial Criteria</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">Trial ID:</span><span className="font-mono text-navy-700">{trial.trial_id}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Title:</span><span className="font-medium text-navy-700 text-right">{trial.title}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Age Range:</span><span className="font-medium text-navy-700">{trial.age_min}-{trial.age_max}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Gender:</span><span className="font-medium text-navy-700 capitalize">{trial.gender}</span></div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block mb-1">Inclusion Criteria:</span>
              <ul className="space-y-1">
                {trial.inclusion_criteria.map((c, i) => (
                  <li key={i} className="text-xs text-navy-700 flex items-start gap-1.5">
                    <span className="text-teal-500 mt-0.5">+</span> {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2">
              <span className="text-slate-400 block mb-1">Exclusion Criteria:</span>
              <ul className="space-y-1">
                {trial.exclusion_criteria.map((c, i) => (
                  <li key={i} className="text-xs text-navy-700 flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">−</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Criterion-by-criterion breakdown */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-navy-500" />
            <h3 className="font-semibold text-navy-800">Criterion-Level Evaluation</h3>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="flex items-center gap-1 text-teal-600"><CheckCircle2 className="h-3.5 w-3.5" /> {passed.length} PASS</span>
            <span className="flex items-center gap-1 text-red-600"><XCircle className="h-3.5 w-3.5" /> {failed.length} FAIL</span>
            <span className="flex items-center gap-1 text-amber-600"><AlertCircle className="h-3.5 w-3.5" /> {review.length} REVIEW</span>
          </div>
        </div>

        {/* Why this patient matches */}
        {result.status === 'ELIGIBLE' && (
          <div className="mb-4 rounded-lg bg-teal-50 border border-teal-200 p-4">
            <h4 className="text-sm font-semibold text-teal-800 mb-2">Why this patient matches</h4>
            <ul className="space-y-1">
              {passed.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-teal-700">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                  {c.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Criteria table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="font-medium px-3 py-2.5">Criterion</th>
                <th className="font-medium px-3 py-2.5">Type</th>
                <th className="font-medium px-3 py-2.5">Result</th>
                <th className="font-medium px-3 py-2.5">Evidence</th>
                <th className="font-medium px-3 py-2.5">Reason</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {result.criteria.map((c, i) => {
                const cfg = resultConfig[c.result];
                const Icon = cfg.icon;
                return (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <p className="font-medium text-navy-700">{c.criterion}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.structured_rule}</p>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={c.type === 'inclusion' ? 'teal' : 'red'}>
                        {c.type === 'inclusion' ? 'Inclusion' : 'Exclusion'}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1.5 ${cfg.color} font-semibold text-sm`}>
                        <Icon className="h-4 w-4" />
                        {c.result}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500 max-w-xs">{c.evidence}</td>
                    <td className="px-3 py-3 text-xs text-slate-500 max-w-xs">{c.reason}</td>
                    <td className="px-3 py-3">
                      <Button variant="ghost" size="sm" onClick={() => setEvidenceCriterion(c)}>
                        <FileText className="h-3.5 w-3.5" />
                        Evidence
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Final result */}
      <Card className={`p-6 ${result.status === 'ELIGIBLE' ? 'border-teal-300 bg-teal-50/30' : result.status === 'INELIGIBLE' ? 'border-red-300 bg-red-50/30' : 'border-amber-300 bg-amber-50/30'}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
              result.status === 'ELIGIBLE' ? 'bg-teal-500' :
              result.status === 'INELIGIBLE' ? 'bg-red-500' : 'bg-amber-500'
            }`}>
              {result.status === 'ELIGIBLE' ? <CheckCircle2 className="h-7 w-7 text-white" /> :
               result.status === 'INELIGIBLE' ? <XCircle className="h-7 w-7 text-white" /> :
               <AlertCircle className="h-7 w-7 text-white" />}
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Final Result</p>
              <p className="text-2xl font-bold text-navy-800">{result.status.replace('_', ' ')}</p>
              <p className="text-sm text-slate-500 mt-0.5">Match Score: <span className="font-bold text-navy-700">{score}%</span></p>
            </div>
          </div>
          <div className="max-w-md text-sm text-slate-600 text-center sm:text-right">
            {result.summary}
          </div>
        </div>
      </Card>

      {/* Evidence drawer modal */}
      <Modal
        open={!!evidenceCriterion}
        onClose={() => setEvidenceCriterion(null)}
        title="Source Evidence"
        size="md"
      >
        {evidenceCriterion && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Criterion</p>
              <p className="font-semibold text-navy-800">{evidenceCriterion.criterion}</p>
              <p className="text-sm text-slate-500 mt-1">{evidenceCriterion.structured_rule}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Database className="h-3 w-3" /> Patient Value</p>
                <p className="font-medium text-navy-700">{evidenceCriterion.evidence}</p>
              </div>
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> Source</p>
                <p className="font-medium text-navy-700">{evidenceCriterion.source}</p>
              </div>
              {evidenceCriterion.source_date && (
                <div className="rounded-lg border border-slate-100 p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Date</p>
                  <p className="font-medium text-navy-700">{evidenceCriterion.source_date}</p>
                </div>
              )}
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-1">Confidence</p>
                <p className="font-medium text-navy-700">{Math.round(evidenceCriterion.confidence * 100)}%</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-100 p-3">
              <p className="text-xs text-slate-400 mb-1">Evaluation</p>
              <p className="text-sm text-navy-700">{evidenceCriterion.reason}</p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
              <p className="text-sm font-medium text-slate-600">Result</p>
              <StatusBadge status={evidenceCriterion.result} />
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs text-slate-400 mb-1">Extraction Note</p>
              <p className="text-xs text-slate-500">
                This criterion was evaluated by the deterministic matching engine using structured patient data.
                The AI extraction layer only structured the criterion text; it did not make the eligibility decision.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
