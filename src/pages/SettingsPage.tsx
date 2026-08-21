import { Settings, User, Bell, Shield, Database, FlaskConical, Save } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { useState } from 'react';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    eligibilityAlerts: true,
    complianceWarnings: true,
    trialUpdates: true,
    weeklyReports: false,
  });

  const [matching, setMatching] = useState({
    autoExtract: true,
    requireRecentLabs: true,
    labFreshnessDays: 30,
    minConfidence: 85,
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-navy-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure platform preferences and matching parameters</p>
      </div>

      {/* Profile */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-navy-500" />
          <h3 className="font-semibold text-navy-800">Researcher Profile</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Full Name</label>
            <input
              type="text"
              defaultValue="Dr. Priya Sharma"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Role</label>
            <input
              type="text"
              defaultValue="Principal Investigator"
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2.5 px-3 text-sm text-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              defaultValue="p.sharma@research.org"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Institution</label>
            <input
              type="text"
              defaultValue="Apollo Research Center"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Matching settings */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="h-5 w-5 text-navy-500" />
          <h3 className="font-semibold text-navy-800">Matching Engine Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700">Auto-extract criteria</p>
              <p className="text-xs text-slate-400">Automatically structure raw trial eligibility text</p>
            </div>
            <Toggle checked={matching.autoExtract} onChange={(v) => setMatching({ ...matching, autoExtract: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700">Require recent labs</p>
              <p className="text-xs text-slate-400">Flag labs older than the freshness threshold as NEEDS REVIEW</p>
            </div>
            <Toggle checked={matching.requireRecentLabs} onChange={(v) => setMatching({ ...matching, requireRecentLabs: v })} />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Lab Freshness (days)</label>
              <input
                type="number"
                value={matching.labFreshnessDays}
                onChange={(e) => setMatching({ ...matching, labFreshnessDays: parseInt(e.target.value) || 30 })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Min Extraction Confidence (%)</label>
              <input
                type="number"
                value={matching.minConfidence}
                onChange={(e) => setMatching({ ...matching, minConfidence: parseInt(e.target.value) || 85 })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-navy-500" />
          <h3 className="font-semibold text-navy-800">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700">Eligibility alerts</p>
              <p className="text-xs text-slate-400">Get notified when a patient passes or fails screening</p>
            </div>
            <Toggle checked={notifications.eligibilityAlerts} onChange={(v) => setNotifications({ ...notifications, eligibilityAlerts: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700">Compliance warnings</p>
              <p className="text-xs text-slate-400">Alerts for missing documentation and outdated labs</p>
            </div>
            <Toggle checked={notifications.complianceWarnings} onChange={(v) => setNotifications({ ...notifications, complianceWarnings: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700">Trial updates</p>
              <p className="text-xs text-slate-400">Notifications when trial status changes</p>
            </div>
            <Toggle checked={notifications.trialUpdates} onChange={(v) => setNotifications({ ...notifications, trialUpdates: v })} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-navy-700">Weekly reports</p>
              <p className="text-xs text-slate-400">Summary of screening activity every Monday</p>
            </div>
            <Toggle checked={notifications.weeklyReports} onChange={(v) => setNotifications({ ...notifications, weeklyReports: v })} />
          </div>
        </div>
      </Card>

      {/* Integration status */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-navy-500" />
          <h3 className="font-semibold text-navy-800">Integration Status</h3>
        </div>
        <div className="space-y-3">
          <IntegrationRow name="ClinicalTrials.gov API" status="ready" description="Live trial lookup (future-ready)" />
          <IntegrationRow name="FHIR / EHR Integration" status="ready" description="Patient data import (future-ready)" />
          <IntegrationRow name="LLM Extraction Service" status="active" description="Criteria structuring via deterministic parser" />
          <IntegrationRow name="PostgreSQL Database" status="active" description="Synthetic data storage (local mock)" />
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="primary">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg bg-slate-100 border border-slate-200 px-4 py-3">
        <p className="text-xs text-slate-500">
          <strong className="text-slate-600">Research Decision Support.</strong> This prototype uses synthetic/de-identified data and is intended to assist research screening. Eligibility results require qualified researcher/clinical review and should not be treated as medical advice or an autonomous enrollment decision.
        </p>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-teal-500' : 'bg-slate-300'}`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function IntegrationRow({ name, status, description }: { name: string; status: 'active' | 'ready'; description: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
      <div>
        <p className="text-sm font-medium text-navy-700">{name}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <Badge variant={status === 'active' ? 'green' : 'neutral'}>
        {status === 'active' ? 'Active' : 'Ready'}
      </Badge>
    </div>
  );
}
