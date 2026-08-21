import { Users, Target, CheckCircle2, Activity, TrendingUp } from 'lucide-react';
import { Card, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { FunnelChart } from '@/components/charts';
import { trialPerformance, funnelData } from '@/data/dashboard';

export function MonitoringPage() {
  const recruitment = { target: 100, screened: 68, eligible: 31, enrolled: 24 };

  const stats = [
    { label: 'Target Enrollment', value: recruitment.target, icon: Target, color: 'navy' },
    { label: 'Screened', value: recruitment.screened, icon: Users, color: 'navy' },
    { label: 'Eligible', value: recruitment.eligible, icon: CheckCircle2, color: 'teal' },
    { label: 'Enrolled', value: recruitment.enrolled, icon: Activity, color: 'teal' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-navy-800">Clinical Trial Monitoring</h2>
        <p className="text-sm text-slate-500 mt-1">Track recruitment progress and trial performance</p>
      </div>

      {/* Recruitment stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg mb-3 ${
                s.color === 'navy' ? 'bg-navy-100 text-navy-600' : 'bg-teal-100 text-teal-600'
              }`}>
                <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
              </div>
              <p className="text-2xl font-bold text-navy-800">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Recruitment progress */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-navy-800">Trial Recruitment Progress</h3>
          <Badge variant="navy">NCT00000001</Badge>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-600">Screened</span>
              <span className="text-sm font-semibold text-navy-700">{recruitment.screened} / {recruitment.target}</span>
            </div>
            <ProgressBar value={(recruitment.screened / recruitment.target) * 100} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-600">Eligible</span>
              <span className="text-sm font-semibold text-teal-600">{recruitment.eligible} / {recruitment.target}</span>
            </div>
            <ProgressBar value={(recruitment.eligible / recruitment.target) * 100} className="[&>div]:bg-teal-500" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-600">Enrolled</span>
              <span className="text-sm font-semibold text-teal-600">{recruitment.enrolled} / {recruitment.target}</span>
            </div>
            <ProgressBar value={(recruitment.enrolled / recruitment.target) * 100} className="[&>div]:bg-teal-600" />
          </div>
        </div>
      </Card>

      {/* Funnel */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Recruitment Funnel</h3>
        <div className="py-2">
          <FunnelChart data={funnelData} />
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Conversion rates show the percentage of patients advancing from each stage to the next.
        </p>
      </Card>

      {/* Trial performance table */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Trial Performance</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="font-medium px-3 py-2.5">Trial</th>
                <th className="font-medium px-3 py-2.5 text-right">Screened</th>
                <th className="font-medium px-3 py-2.5 text-right">Eligible</th>
                <th className="font-medium px-3 py-2.5 text-right">Enrolled</th>
                <th className="font-medium px-3 py-2.5 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {trialPerformance.map((t) => {
                const conversion = t.screened > 0 ? ((t.enrolled / t.screened) * 100).toFixed(0) : '0';
                return (
                  <tr key={t.trial} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <p className="font-medium text-navy-700">{t.trial}</p>
                      <p className="text-xs text-slate-400">{t.title}</p>
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600">{t.screened}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{t.eligible}</td>
                    <td className="px-3 py-3 text-right text-slate-600">{t.enrolled}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-teal-600">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {conversion}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
