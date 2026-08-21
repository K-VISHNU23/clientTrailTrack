import { History, Filter, Download } from 'lucide-react';
import { Card, Badge, Button, StatusBadge, EmptyState } from '@/components/ui';
import { auditTrail } from '@/data/auxiliary';
import { useState } from 'react';

export function AuditTrailPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = auditTrail.filter((entry) => {
    const matchesFilter = filter === 'all' || (filter === 'screening' && entry.action.includes('screening')) ||
      (filter === 'documents' && (entry.action.includes('document') || entry.action.includes('Uploaded'))) ||
      (filter === 'system' && entry.user === 'System');
    const matchesSearch = !search ||
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      (entry.patient_id?.toLowerCase().includes(search.toLowerCase())) ||
      (entry.trial_id?.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Audit Trail</h2>
          <p className="text-sm text-slate-500 mt-1">Complete record of all system and user actions</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, action, patient, or trial..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm focus:border-navy-400 focus:outline-none"
          >
            <option value="all">All Activities</option>
            <option value="screening">Screening</option>
            <option value="documents">Documents</option>
            <option value="system">System Events</option>
          </select>
        </div>
      </Card>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={History} title="No audit entries found" message="Try adjusting your search or filter." />
        </Card>
      ) : (
        <Card className="p-5">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />

            <div className="space-y-4">
              {filtered.map((entry) => (
                <div key={entry.id} className="relative flex gap-4 animate-fade-in">
                  {/* Dot */}
                  <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                    entry.user === 'System' ? 'bg-navy-100 text-navy-600' : 'bg-teal-100 text-teal-600'
                  }`}>
                    <History className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-2">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-navy-700">{entry.user}</span>
                      <span className="text-xs text-slate-400">{entry.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-600">{entry.action}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {entry.patient_id && (
                        <Badge variant="navy">Patient: {entry.patient_id}</Badge>
                      )}
                      {entry.trial_id && (
                        <Badge variant="blue">{entry.trial_id}</Badge>
                      )}
                      {entry.result && (
                        <StatusBadge status={entry.result as 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW'} size="sm" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Summary */}
      <Card className="p-4">
        <p className="text-xs text-slate-400">
          <strong className="text-slate-500">Audit Trail:</strong> {auditTrail.length} total events recorded.
          This log demonstrates full traceability of all eligibility decisions and system actions for regulatory compliance.
        </p>
      </Card>
    </div>
  );
}
