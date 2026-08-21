import { useState, useMemo } from 'react';
import { Search, ChevronRight, MapPin, Users, Building2, FileText } from 'lucide-react';
import { Card, Badge, Button, EmptyState, Tabs } from '@/components/ui';
import { useNav } from '@/context/NavContext';
import { trials } from '@/data/trials';
import type { TrialStatus } from '@/types';

const statusColors: Record<TrialStatus, 'teal' | 'amber' | 'blue' | 'neutral' | 'red'> = {
  RECRUITING: 'teal',
  NOT_YET_RECRUITING: 'amber',
  ACTIVE: 'blue',
  COMPLETED: 'neutral',
  CLOSED: 'red',
};

export function TrialsPage() {
  const { navigate } = useNav();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return trials.filter((t) => {
      const matchesSearch =
        !search ||
        t.trial_id.toLowerCase().includes(search.toLowerCase()) ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.conditions.some((c) => c.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchesPhase = phaseFilter === 'all' || t.phase === phaseFilter;
      return matchesSearch && matchesStatus && matchesPhase;
    });
  }, [search, statusFilter, phaseFilter]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Search + Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search trials, conditions, NCT ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-400"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm focus:border-navy-400 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="RECRUITING">Recruiting</option>
              <option value="NOT_YET_RECRUITING">Not Yet Recruiting</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm focus:border-navy-400 focus:outline-none"
            >
              <option value="all">All Phases</option>
              <option value="PHASE_1">Phase 1</option>
              <option value="PHASE_2">Phase 2</option>
              <option value="PHASE_3">Phase 3</option>
              <option value="PHASE_4">Phase 4</option>
              <option value="OBSERVATIONAL">Observational</option>
            </select>
          </div>
        </div>
      </Card>

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold text-navy-700">{filtered.length}</span> of {trials.length} trials
      </p>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Search}
            title="No trials found"
            message="Try adjusting your search or filter criteria."
            action={<Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); setPhaseFilter('all'); }}>Clear Filters</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((t) => (
            <Card key={t.trial_id} className="p-5 card-hover" onClick={() => navigate('trial-detail', { trialId: t.trial_id })}>
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{t.trial_id}</span>
                    <Badge variant={statusColors[t.status]}>{t.status}</Badge>
                  </div>
                  <h3 className="font-semibold text-navy-800 text-base leading-snug">{t.title}</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {t.conditions.map((c) => (
                  <Badge key={c} variant="navy">{c}</Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users className="h-3.5 w-3.5" />
                  <span>Age {t.age_min}-{t.age_max}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="capitalize">{t.gender}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{t.locations[0]?.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="truncate">{t.sponsor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">
                  {t.enrolled}/{t.target_enrollment} enrolled
                </span>
                <Button variant="ghost" size="sm">
                  View Trial <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function TrialDetailPage() {
  const { params, navigate } = useNav();
  const trial = trials.find((t) => t.trial_id === params.trialId);
  const [activeTab, setActiveTab] = useState('overview');

  if (!trial) {
    return (
      <Card>
        <EmptyState
          icon={FileText}
          title="Trial not found"
          message="The trial you're looking for doesn't exist."
          action={<Button onClick={() => navigate('trials')}>Back to Trials</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-slate-400">{trial.trial_id}</span>
            <Badge variant={statusColors[trial.status]}>{trial.status}</Badge>
            <Badge variant="blue">{trial.phase.replace('_', ' ')}</Badge>
          </div>
          <h2 className="text-xl font-bold text-navy-800 mb-2">{trial.title}</h2>
          <p className="text-sm text-slate-500">{trial.sponsor}</p>
        </div>
        <Button variant="primary" onClick={() => navigate('matching', { trialId: trial.trial_id })}>
          <Search className="h-4 w-4" />
          Find Matching Patients
        </Button>
      </div>

      {/* Quick info grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'NCT ID', value: trial.trial_id },
          { label: 'Phase', value: trial.phase.replace('_', ' ') },
          { label: 'Condition', value: trial.conditions.join(', ') },
          { label: 'Age Range', value: `${trial.age_min}-${trial.age_max}` },
          { label: 'Gender', value: trial.gender, capitalize: true },
          { label: 'Enrollment', value: `${trial.enrolled}/${trial.target_enrollment}` },
        ].map((item) => (
          <Card key={item.label} className="p-3">
            <p className="text-xs text-slate-400 mb-1">{item.label}</p>
            <p className={`text-sm font-semibold text-navy-700 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card className="p-0 overflow-hidden">
        <div className="px-5 pt-3">
          <Tabs
            active={activeTab}
            onChange={setActiveTab}
            tabs={[
              { key: 'overview', label: 'Overview' },
              { key: 'eligibility', label: 'Eligibility' },
              { key: 'locations', label: 'Locations' },
              { key: 'documents', label: 'Documents' },
              { key: 'matching', label: 'Matching Patients' },
            ]}
          />
        </div>

        <div className="p-5">
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-semibold text-navy-800 mb-2">Study Description</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{trial.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-navy-700 mb-2">Inclusion Criteria</h4>
                  <ul className="space-y-1.5">
                    {trial.inclusion_criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy-700 mb-2">Exclusion Criteria</h4>
                  <ul className="space-y-1.5">
                    {trial.exclusion_criteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h3 className="font-semibold text-navy-800 mb-3">Inclusion Criteria</h3>
                <div className="space-y-2">
                  {trial.inclusion_criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-teal-50/50 border border-teal-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-xs font-bold">{i + 1}</span>
                      <span className="text-sm text-navy-700">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-navy-800 mb-3">Exclusion Criteria</h3>
                <div className="space-y-2">
                  {trial.exclusion_criteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-50/50 border border-red-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">{i + 1}</span>
                      <span className="text-sm text-navy-700">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('eligibility-extraction', { trialId: trial.trial_id })}>
                <FileText className="h-4 w-4" />
                View AI Extraction
              </Button>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-3 animate-fade-in">
              {trial.locations.map((loc, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-navy-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-navy-700">{loc.facility}</p>
                      <p className="text-sm text-slate-500">{loc.city}, {loc.country}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy-800">Trial Documents</h3>
                <Button variant="outline" size="sm" onClick={() => navigate('documents')}>Upload Document</Button>
              </div>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-slate-300" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-700">{trial.trial_id}_Protocol_v3.pdf</p>
                    <p className="text-xs text-slate-400">Protocol document · 2.4 MB</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'matching' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy-800">Matching Patients</h3>
                <Button variant="primary" size="sm" onClick={() => navigate('matching', { trialId: trial.trial_id })}>
                  <Search className="h-4 w-4" />
                  Run Matching
                </Button>
              </div>
              <p className="text-sm text-slate-500">
                Navigate to the Trial Matching page to evaluate all patients against this trial's eligibility criteria.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
