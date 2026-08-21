import { useState } from 'react';
import { FileText, ChevronLeft, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, Badge, Button, EmptyState } from '@/components/ui';
import { useNav } from '@/context/NavContext';
import { trials, getTrial } from '@/data/trials';
import { extractStructuredCriteria } from '@/lib/matching';

export function EligibilityExtractionPage() {
  const { params, navigate } = useNav();
  const [selectedTrialId, setSelectedTrialId] = useState(params.trialId || trials[0].trial_id);
  const trial = getTrial(selectedTrialId);

  if (!trial) {
    return (
      <Card className="p-8">
        <EmptyState icon={FileText} title="Trial not found" message="Select a trial to view criteria extraction." />
      </Card>
    );
  }

  const structured = extractStructuredCriteria(trial);
  const inclusion = structured.filter((c) => c.type === 'inclusion');
  const exclusion = structured.filter((c) => c.type === 'exclusion');

  return (
    <div className="space-y-5 animate-fade-in">
      {params.trialId && (
        <button
          onClick={() => navigate('trial-detail', { trialId: params.trialId })}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Trial
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Eligibility Criteria Extraction</h2>
          <p className="text-sm text-slate-500 mt-1">AI-powered structuring of raw trial eligibility text</p>
        </div>
        <select
          value={selectedTrialId}
          onChange={(e) => setSelectedTrialId(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm focus:border-navy-400 focus:outline-none"
        >
          {trials.map((t) => (
            <option key={t.trial_id} value={t.trial_id}>{t.trial_id} — {t.title}</option>
          ))}
        </select>
      </div>

      {/* AI extraction note */}
      <Card className="bg-navy-50 border-navy-100 p-4">
        <div className="flex items-start gap-3">
          <Cpu className="h-5 w-5 text-navy-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-navy-700">AI Extraction Layer</p>
            <p className="text-xs text-navy-600 mt-1">
              The extraction layer only structures and extracts criteria from raw text. It does NOT make the final eligibility decision.
              Final decisions are made by the deterministic matching engine.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Raw text */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-slate-400" />
            <h3 className="font-semibold text-navy-800 text-sm">Raw Trial Text</h3>
            <Badge variant="neutral" className="ml-auto">Source Document</Badge>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 max-h-[500px] overflow-y-auto scrollbar-thin">
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono leading-relaxed">{trial.raw_eligibility_text}</pre>
          </div>
        </Card>

        {/* Structured criteria */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-teal-500" />
            <h3 className="font-semibold text-navy-800 text-sm">Structured Criteria</h3>
            <Badge variant="teal" className="ml-auto">{structured.length} criteria</Badge>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            {/* Inclusion */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-teal-700 mb-2 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-white text-[10px]">+</span>
                Inclusion Criteria
              </h4>
              <div className="space-y-2">
                {inclusion.map((c) => (
                  <div key={c.id} className="rounded-lg border border-teal-100 bg-teal-50/30 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-navy-700">{c.text}</p>
                      <Badge variant="teal" className="shrink-0">{Math.round(c.confidence * 100)}%</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{c.category}</span>
                      <span>·</span>
                      <span className="font-mono">{c.structured_rule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusion */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-red-700 mb-2 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">−</span>
                Exclusion Criteria
              </h4>
              <div className="space-y-2">
                {exclusion.map((c) => (
                  <div key={c.id} className="rounded-lg border border-red-100 bg-red-50/30 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-navy-700">{c.text}</p>
                      <Badge variant="red" className="shrink-0">{Math.round(c.confidence * 100)}%</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{c.category}</span>
                      <span>·</span>
                      <span className="font-mono">{c.structured_rule}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Structured criteria table */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Extraction Results Table</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="font-medium px-3 py-2.5">Criterion</th>
                <th className="font-medium px-3 py-2.5">Type</th>
                <th className="font-medium px-3 py-2.5">Category</th>
                <th className="font-medium px-3 py-2.5">Structured Rule</th>
                <th className="font-medium px-3 py-2.5 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {structured.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-3 font-medium text-navy-700">{c.text}</td>
                  <td className="px-3 py-3">
                    <Badge variant={c.type === 'inclusion' ? 'teal' : 'red'}>{c.type}</Badge>
                  </td>
                  <td className="px-3 py-3 text-slate-500">{c.category}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-600">{c.structured_rule}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={`font-semibold ${c.confidence > 0.9 ? 'text-teal-600' : 'text-amber-600'}`}>
                      {Math.round(c.confidence * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Next step */}
      <Card className="p-5 bg-navy-50 border-navy-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-navy-700">Next Step: Deterministic Matching</p>
            <p className="text-xs text-navy-600 mt-1">Run the matching engine to evaluate these structured criteria against patient data.</p>
          </div>
          <Button variant="primary" onClick={() => navigate('matching', { trialId: selectedTrialId })}>
            Run Matching <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
