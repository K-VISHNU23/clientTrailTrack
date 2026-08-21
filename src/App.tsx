import { NavProvider, useNav } from '@/context/NavContext';
import { Sidebar, Topbar, PageContainer } from '@/components/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { PatientsPage, PatientDetailPage } from '@/pages/PatientsPage';
import { TrialsPage, TrialDetailPage } from '@/pages/TrialsPage';
import { TrialMatchingPage } from '@/pages/TrialMatchingPage';
import { EligibilityReviewPage } from '@/pages/EligibilityReviewPage';
import { EligibilityExtractionPage } from '@/pages/EligibilityExtractionPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { CompliancePage } from '@/pages/CompliancePage';
import { MonitoringPage } from '@/pages/MonitoringPage';
import { ResearchAssistantPage } from '@/pages/ResearchAssistantPage';
import { AuditTrailPage } from '@/pages/AuditTrailPage';
import { SettingsPage } from '@/pages/SettingsPage';
import type { PageKey } from '@/types';

const pageTitles: Record<PageKey, { title: string; subtitle?: string }> = {
  dashboard: { title: 'Clinical Trial Matching Dashboard', subtitle: 'AI-assisted patient screening and clinical trial discovery' },
  patients: { title: 'Patients', subtitle: 'Manage and review synthetic patient records' },
  'patient-detail': { title: 'Patient 360', subtitle: 'Complete patient profile and laboratory history' },
  trials: { title: 'Clinical Trials', subtitle: 'Discover and review active clinical trials' },
  'trial-detail': { title: 'Trial Details', subtitle: 'Comprehensive trial information and eligibility criteria' },
  matching: { title: 'Trial Matching', subtitle: 'AI-assisted patient-to-trial eligibility matching' },
  'eligibility-review': { title: 'Eligibility Review', subtitle: 'Criterion-level eligibility breakdown with evidence' },
  'eligibility-extraction': { title: 'Eligibility Criteria Extraction', subtitle: 'AI-powered structuring of raw trial eligibility text' },
  documents: { title: 'Research Document Intelligence', subtitle: 'Upload and analyze clinical research documents' },
  compliance: { title: 'Compliance & Screening', subtitle: 'Monitor compliance indicators and data quality' },
  monitoring: { title: 'Clinical Trial Monitoring', subtitle: 'Track recruitment progress and trial performance' },
  assistant: { title: 'Research Assistant', subtitle: 'AI-powered Q&A for clinical trial eligibility' },
  audit: { title: 'Audit Trail', subtitle: 'Complete record of all system and user actions' },
  settings: { title: 'Settings', subtitle: 'Configure platform preferences and matching parameters' },
};

function PageRouter() {
  const { page } = useNav();
  const { title, subtitle } = pageTitles[page];

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage />;
      case 'patients': return <PatientsPage />;
      case 'patient-detail': return <PatientDetailPage />;
      case 'trials': return <TrialsPage />;
      case 'trial-detail': return <TrialDetailPage />;
      case 'matching': return <TrialMatchingPage />;
      case 'eligibility-review': return <EligibilityReviewPage />;
      case 'eligibility-extraction': return <EligibilityExtractionPage />;
      case 'documents': return <DocumentsPage />;
      case 'compliance': return <CompliancePage />;
      case 'monitoring': return <MonitoringPage />;
      case 'assistant': return <ResearchAssistantPage />;
      case 'audit': return <AuditTrailPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar title={title} subtitle={subtitle} />
        <PageContainer>
          {renderPage()}
        </PageContainer>
      </div>
    </div>
  );
}

function App() {
  return (
    <NavProvider>
      <PageRouter />
    </NavProvider>
  );
}

export default App;
