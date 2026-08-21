import { ShieldCheck, FileWarning, FlaskConical, Clock, History, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, Badge, Button, StatusBadge, EmptyState } from '@/components/ui';
import { useNav } from '@/context/NavContext';
import { complianceIssues } from '@/data/auxiliary';
import { complianceMetrics } from '@/data/dashboard';

const severityConfig: Record<string, { variant: 'red' | 'amber' | 'green'; label: string }> = {
  high: { variant: 'red', label: 'Critical' },
  medium: { variant: 'amber', label: 'Attention' },
  low: { variant: 'green', label: 'Low' },
};

const statusConfig: Record<string, { variant: 'neutral' | 'amber' | 'green'; label: string }> = {
  open: { variant: 'amber', label: 'Open' },
  in_progress: { variant: 'neutral', label: 'In Progress' },
  resolved: { variant: 'green', label: 'Resolved' },
};

export function CompliancePage() {
  const { navigate } = useNav();

  const metrics = [
    { label: 'Screening Compliance', value: `${complianceMetrics.screeningCompliance}%`, icon: ShieldCheck, color: 'teal' },
    { label: 'Missing Documentation', value: complianceMetrics.missingDocumentation, icon: FileWarning, color: 'amber' },
    { label: 'Outdated Labs', value: complianceMetrics.outdatedLabs, icon: FlaskConical, color: 'amber' },
    { label: 'Pending Reviews', value: complianceMetrics.pendingReviews, icon: Clock, color: 'navy' },
    { label: 'Audit Events', value: complianceMetrics.auditEvents, icon: History, color: 'navy' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-navy-800">Compliance & Screening</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor compliance indicators and screening quality</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label} className="p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-3 ${
                m.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                m.color === 'amber' ? 'bg-amber-100 text-amber-600' :
                'bg-navy-100 text-navy-600'
              }`}>
                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              </div>
              <p className="text-2xl font-bold text-navy-800">{m.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{m.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Compliance gauge */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Screening Compliance Rate</h3>
        <div className="flex items-center gap-4">
          <div className="relative h-8 flex-1 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-700"
              style={{ width: `${complianceMetrics.screeningCompliance}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-teal-600">{complianceMetrics.screeningCompliance}%</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Percentage of screenings that meet all documentation and data quality requirements.
        </p>
      </Card>

      {/* Issues table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy-800">Compliance Issues</h3>
          <Badge variant="amber">{complianceIssues.filter((i) => i.status !== 'resolved').length} active</Badge>
        </div>

        {complianceIssues.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="No compliance issues" message="All screenings are fully compliant." />
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="font-medium px-3 py-2.5">Patient</th>
                  <th className="font-medium px-3 py-2.5">Trial</th>
                  <th className="font-medium px-3 py-2.5">Issue</th>
                  <th className="font-medium px-3 py-2.5">Severity</th>
                  <th className="font-medium px-3 py-2.5">Status</th>
                  <th className="font-medium px-3 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {complianceIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate('eligibility-review', { patientId: issue.patient_id, trialId: issue.trial_id })}
                  >
                    <td className="px-3 py-3 font-medium text-navy-700">{issue.patient_id}</td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-500">{issue.trial_id}</td>
                    <td className="px-3 py-3 text-slate-600">{issue.issue}</td>
                    <td className="px-3 py-3">
                      <Badge variant={severityConfig[issue.severity].variant}>{severityConfig[issue.severity].label}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant={statusConfig[issue.status].variant}>{statusConfig[issue.status].label}</Badge>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">{issue.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Green = Compliant</span>
          <span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Amber = Needs Attention</span>
          <span className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-red-500" /> Red = Critical Review</span>
        </div>
      </Card>
    </div>
  );
}
