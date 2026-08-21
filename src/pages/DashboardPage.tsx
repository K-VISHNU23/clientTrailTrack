import {
  Users, FlaskConical, Target, AlertCircle, CheckCircle, Activity,
  TrendingUp, TrendingDown, ArrowRight, Play, FileWarning,
} from 'lucide-react';
import { Card, Badge, Button, StatusBadge } from '@/components/ui';
import { LineChart, DonutChart, HorizontalBarChart } from '@/components/charts';
import { useNav } from '@/context/NavContext';
import {
  dashboardKPIs, screeningTrend, matchDistribution, topConditions,
  recentScreening,
} from '@/data/dashboard';
import { alerts } from '@/data/auxiliary';

const iconMap: Record<string, typeof Users> = {
  Users, FlaskConical, Target, AlertCircle, CheckCircle, Activity,
};

export function DashboardPage() {
  const { navigate } = useNav();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo banner */}
      <Card className="bg-gradient-to-r from-navy-700 to-navy-800 border-navy-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 shrink-0">
              <Play className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Quick Demo Mode</h3>
              <p className="text-sm text-navy-200 mt-0.5">
                Run a guided eligibility screening from P001 (eligible) to P009 (needs review) in under 2 minutes.
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={() => navigate('matching', { demo: 'true' })} className="shrink-0">
            <Play className="h-4 w-4" />
            Launch Demo
          </Button>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dashboardKPIs.map((kpi) => {
          const Icon = iconMap[kpi.icon] || Users;
          return (
            <Card key={kpi.key} className="p-4 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  kpi.color === 'navy' ? 'bg-navy-100 text-navy-600' :
                  kpi.color === 'teal' ? 'bg-teal-100 text-teal-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                </div>
                <Badge variant={kpi.trendUp ? 'green' : 'amber'}>
                  {kpi.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.trend}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-navy-800">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{kpi.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Screening trend */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-navy-800">Patient Screening Overview</h3>
              <p className="text-xs text-slate-500">Last 7 days</p>
            </div>
            <Badge variant="navy">Daily</Badge>
          </div>
          <LineChart
            data={screeningTrend}
            series={[
              { key: 'eligible', label: 'Eligible', color: '#28a085' },
              { key: 'ineligible', label: 'Ineligible', color: '#dc2626' },
              { key: 'needsReview', label: 'Needs Review', color: '#f99407' },
            ]}
          />
        </Card>

        {/* Donut */}
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-navy-800">Trial Matching Distribution</h3>
            <p className="text-xs text-slate-500">All screening results</p>
          </div>
          <DonutChart data={matchDistribution} />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top conditions */}
        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-semibold text-navy-800">Top Trial Conditions</h3>
            <p className="text-xs text-slate-500">By patient count</p>
          </div>
          <HorizontalBarChart data={topConditions} />
        </Card>

        {/* Recent screening */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-navy-800">Recent Screening Activity</h3>
              <p className="text-xs text-slate-500">Latest eligibility evaluations</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('audit')}>
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="overflow-x-auto scrollbar-thin -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                  <th className="font-medium px-2 py-2">Patient</th>
                  <th className="font-medium px-2 py-2">Trial</th>
                  <th className="font-medium px-2 py-2">Result</th>
                  <th className="font-medium px-2 py-2 text-right">Score</th>
                  <th className="font-medium px-2 py-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentScreening.map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate('eligibility-review', { patientId: row.patient, trialId: row.trial })}
                  >
                    <td className="px-2 py-2.5 font-medium text-navy-700">{row.patient}</td>
                    <td className="px-2 py-2.5 text-slate-600">{row.trial}</td>
                    <td className="px-2 py-2.5"><StatusBadge status={row.result as 'ELIGIBLE' | 'INELIGIBLE' | 'NEEDS_REVIEW'} size="sm" /></td>
                    <td className="px-2 py-2.5 text-right font-semibold text-navy-700">{row.score}%</td>
                    <td className="px-2 py-2.5 text-right text-slate-400 text-xs">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-navy-800">Active Alerts</h3>
          </div>
          <Badge variant="amber">{alerts.length} alerts</Badge>
        </div>
        <div className="space-y-3">
          {alerts.slice(0, 4).map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                alert.severity === 'critical' ? 'bg-red-500' :
                alert.severity === 'warning' ? 'bg-amber-500' :
                alert.severity === 'success' ? 'bg-teal-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-navy-700 text-sm">{alert.title}</span>
                  <span className="text-xs text-slate-400">{alert.timestamp}</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Disclaimer */}
      <div className="rounded-lg bg-slate-100 border border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500">
          <strong className="text-slate-600">Research Decision Support.</strong> This prototype uses synthetic/de-identified data and is intended to assist research screening. Eligibility results require qualified researcher/clinical review and should not be treated as medical advice or an autonomous enrollment decision.
        </p>
      </div>
    </div>
  );
}
