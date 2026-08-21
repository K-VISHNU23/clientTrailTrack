import { useState, useEffect, useRef } from 'react';
import {
  Search, Play, ChevronRight, ArrowRight, CheckCircle2, XCircle,
  AlertCircle, User, FlaskConical, FileText, Cpu, ShieldCheck,
  FileSearch, Trophy, Loader2,
} from 'lucide-react';
import { Card, Badge, Button, StatusBadge, ScoreRing, ProgressBar, EmptyState } from '@/components/ui';
import { useNav } from '@/context/NavContext';
import { patients, getPatient } from '@/data/patients';
import { trials, getTrial } from '@/data/trials';
import { matchPatientToAllTrials, matchPatientToTrial } from '@/lib/matching';
import type { MatchResult, Patient, Trial } from '@/types';

const loadingSteps = [
  'Analyzing patient profile...',
  'Evaluating trial eligibility...',
  'Checking laboratory criteria...',
  'Generating evidence...',
  'Ranking trial matches...',
  'Matching complete',
];

const pipelineSteps = [
  { label: 'Patient Data', icon: User },
  { label: 'Trial Criteria', icon: FlaskConical },
  { label: 'Criteria Extraction', icon: FileText },
  { label: 'Rule Evaluation', icon: Cpu },
  { label: 'Evidence Verification', icon: ShieldCheck },
  { label: 'Eligibility Decision', icon: FileSearch },
  { label: 'Ranked Trials', icon: Trophy },
];

export function TrialMatchingPage() {
  const { params, navigate } = useNav();
  const [selectedPatientId, setSelectedPatientId] = useState(params.patientId || 'P001');
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [demoMode, setDemoMode] = useState(params.demo === 'true');

  const selectedPatient = getPatient(selectedPatientId);

  // Auto-run matching if navigated with a specific patient
  useEffect(() => {
    if (params.patientId) {
      runMatching(params.patientId);
    }
    if (params.demo === 'true') {
      setDemoMode(true);
    }
  }, [params.patientId, params.demo]);

  function runMatching(patientId?: string) {
    const pid = patientId || selectedPatientId;
    const patient = getPatient(pid);
    if (!patient) return;
    setLoading(true);
    setResults(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    setTimeout(() => {
      const allResults = matchPatientToAllTrials(patient, trials);
      setResults(allResults);
      setLoading(false);
      clearInterval(stepInterval);
    }, 2800);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Demo banner */}
      {demoMode && (
        <Card className="bg-gradient-to-r from-teal-600 to-teal-700 border-teal-600">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-white" />
              <h3 className="text-white font-semibold text-sm">Demo Mode Active</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => { setSelectedPatientId('P001'); runMatching('P001'); }}
                className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-white text-sm hover:bg-white/25 transition-colors text-left"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-300 text-teal-800 text-xs font-bold">1</span>
                <div>
                  <p className="font-medium">P001 — Eligible</p>
                  <p className="text-xs text-teal-100">Happy path demo</p>
                </div>
              </button>
              <button
                onClick={() => { setSelectedPatientId('P004'); runMatching('P004'); }}
                className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-white text-sm hover:bg-white/25 transition-colors text-left"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-300 text-red-800 text-xs font-bold">2</span>
                <div>
                  <p className="font-medium">P004 — Ineligible</p>
                  <p className="text-xs text-teal-100">Failed criteria</p>
                </div>
              </button>
              <button
                onClick={() => { setSelectedPatientId('P009'); runMatching('P009'); }}
                className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-white text-sm hover:bg-white/25 transition-colors text-left"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-amber-800 text-xs font-bold">3</span>
                <div>
                  <p className="font-medium">P009 — Needs Review</p>
                  <p className="text-xs text-teal-100">Outdated lab</p>
                </div>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Patient selector */}
      <Card className="p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-navy-700 mb-2">Select Patient</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm font-medium text-navy-700 focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-400"
              >
                {patients.map((p) => (
                  <option key={p.patient_id} value={p.patient_id}>
                    {p.patient_id} — {p.age}{p.gender[0].toUpperCase()} — {p.conditions.join(', ')}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 rotate-90 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-end">
            <Button variant="primary" size="lg" onClick={() => runMatching()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Run Trial Matching
            </Button>
          </div>
        </div>

        {/* Selected patient summary */}
        {selectedPatient && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-slate-400">Age:</span> <span className="font-medium text-navy-700">{selectedPatient.age}</span></div>
            <div><span className="text-slate-400">Gender:</span> <span className="font-medium text-navy-700 capitalize">{selectedPatient.gender}</span></div>
            <div><span className="text-slate-400">Conditions:</span> <span className="font-medium text-navy-700">{selectedPatient.conditions.join(', ')}</span></div>
            <div><span className="text-slate-400">Location:</span> <span className="font-medium text-navy-700">{selectedPatient.location}</span></div>
          </div>
        )}
      </Card>

      {/* Loading state */}
      {loading && (
        <Card className="p-8 animate-fade-in">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="h-5 w-5 text-navy-600 animate-spin" />
              <h3 className="font-semibold text-navy-800">Running Eligibility Analysis</h3>
            </div>
            <div className="space-y-3">
              {loadingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full shrink-0 transition-colors ${
                    i < loadingStep ? 'bg-teal-500 text-white' :
                    i === loadingStep ? 'bg-navy-100 text-navy-600' :
                    'bg-slate-100 text-slate-300'
                  }`}>
                    {i < loadingStep ? <CheckCircle2 className="h-3.5 w-3.5" /> :
                     i === loadingStep ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> :
                     <span className="text-xs">{i + 1}</span>}
                  </div>
                  <span className={`text-sm ${i <= loadingStep ? 'text-navy-700 font-medium' : 'text-slate-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <ProgressBar value={((loadingStep + 1) / loadingSteps.length) * 100} />
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {!loading && results && (
        <>
          {/* Pipeline visualization */}
          <Card className="p-5">
            <h3 className="font-semibold text-navy-800 mb-4">Matching Pipeline</h3>
            <div className="flex flex-wrap items-center gap-2">
              {pipelineSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center gap-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-white">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-medium text-teal-800">{step.label}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                    </div>
                    {i < pipelineSteps.length - 1 && <ArrowRight className="h-4 w-4 text-slate-300 hidden sm:block" />}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Matching summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Patient</p>
              <p className="text-lg font-bold text-navy-800">{selectedPatientId}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Trials Analyzed</p>
              <p className="text-lg font-bold text-navy-800">{results.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Potential Matches</p>
              <p className="text-lg font-bold text-teal-600">
                {results.filter((r) => r.status === 'ELIGIBLE').length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Needs Review</p>
              <p className="text-lg font-bold text-amber-600">
                {results.filter((r) => r.status === 'NEEDS_REVIEW').length}
              </p>
            </Card>
          </div>

          {/* Ranked results */}
          <div>
            <h3 className="font-semibold text-navy-800 mb-3">Ranked Trial Results</h3>
            <div className="space-y-3">
              {results.map((result, idx) => {
                const trial = getTrial(result.trial_id);
                if (!trial) return null;
                const passed = result.criteria.filter((c) => c.result === 'PASS').length;
                const failed = result.criteria.filter((c) => c.result === 'FAIL').length;
                const review = result.criteria.filter((c) => c.result === 'NEEDS_REVIEW').length;
                const score = Math.round(result.score * 100);

                return (
                  <Card key={result.trial_id} className="p-5 card-hover animate-slide-up" >
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Rank + Score */}
                      <div className="flex lg:flex-col items-center gap-3 lg:gap-2 shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-700 font-bold text-sm">
                          #{idx + 1}
                        </div>
                        <ScoreRing score={score} size={64} />
                      </div>

                      {/* Trial info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-mono text-slate-400">{trial.trial_id}</span>
                              <StatusBadge status={result.status} size="sm" />
                            </div>
                            <h4 className="font-semibold text-navy-800">{trial.title}</h4>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {trial.conditions.map((c) => (
                            <Badge key={c} variant="navy">{c}</Badge>
                          ))}
                          <Badge variant="neutral">{trial.locations[0]?.city}</Badge>
                        </div>

                        {/* Criteria summary */}
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1 text-teal-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {passed} passed
                          </span>
                          {failed > 0 && (
                            <span className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-3.5 w-3.5" /> {failed} failed
                            </span>
                          )}
                          {review > 0 && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <AlertCircle className="h-3.5 w-3.5" /> {review} need review
                            </span>
                          )}
                        </div>

                        {/* Reason for non-eligible */}
                        {result.status === 'INELIGIBLE' && failed > 0 && (
                          <div className="mt-3 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                            <p className="text-xs text-red-700">
                              <strong>Reason:</strong> {result.criteria.find((c) => c.result === 'FAIL')?.reason}
                            </p>
                          </div>
                        )}
                        {result.status === 'NEEDS_REVIEW' && review > 0 && (
                          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                            <p className="text-xs text-amber-700">
                              <strong>Reason:</strong> {result.criteria.find((c) => c.result === 'NEEDS_REVIEW')?.reason}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="shrink-0">
                        <Button
                          variant={result.status === 'ELIGIBLE' ? 'secondary' : result.status === 'INELIGIBLE' ? 'outline' : 'outline'}
                          onClick={() => navigate('eligibility-review', { patientId: selectedPatientId, trialId: result.trial_id })}
                        >
                          {result.status === 'ELIGIBLE' ? 'View Eligibility' :
                           result.status === 'NEEDS_REVIEW' ? 'Review' : 'View Details'}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!loading && !results && !demoMode && (
        <Card className="p-8">
          <EmptyState
            icon={Search}
            title="Ready to match"
            message="Select a patient above and click Run Trial Matching to evaluate eligibility across all active trials."
          />
        </Card>
      )}
    </div>
  );
}
