import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard, Users, FlaskConical, Target, FileCheck2, FileText,
  ShieldCheck, Activity, MessageSquare, History, Settings,
  HelpCircle, LogOut, Menu, X, Search, Bell, ChevronRight,
} from 'lucide-react';
import { useNav } from '@/context/NavContext';
import type { PageKey } from '@/types';

const navItems: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'patients', label: 'Patients', icon: Users },
  { key: 'trials', label: 'Clinical Trials', icon: FlaskConical },
  { key: 'matching', label: 'Trial Matching', icon: Target },
  { key: 'eligibility-review', label: 'Eligibility Review', icon: FileCheck2 },
  { key: 'eligibility-extraction', label: 'Criteria Extraction', icon: FileText },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { key: 'monitoring', label: 'Monitoring', icon: Activity },
  { key: 'assistant', label: 'Research Assistant', icon: MessageSquare },
  { key: 'audit', label: 'Audit Trail', icon: History },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { page, navigate, sidebarOpen, setSidebarOpen } = useNav();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-navy-900 text-navy-100 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500 text-white">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">TrialMatch AI</h1>
              <p className="text-[11px] text-navy-300 leading-tight">Clinical Research Assistant</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-navy-300 hover:text-white" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.key || (item.key === 'patients' && page === 'patient-detail') || (item.key === 'trials' && page === 'trial-detail');
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border-l-2 border-teal-400'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" style={{ width: 18, height: 18 }} aria-hidden="true" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-navy-800 px-3 py-3 space-y-0.5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-200 hover:bg-navy-800 hover:text-white transition-colors">
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Help
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-200 hover:bg-navy-800 hover:text-white transition-colors">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mt-2 bg-navy-800/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-white text-sm font-bold">
              PS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Dr. Priya Sharma</p>
              <p className="text-[11px] text-navy-300 truncate">Principal Investigator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { setSidebarOpen } = useNav();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-navy-800 truncate">{title}</h2>
            {subtitle && <p className="text-sm text-slate-500 truncate hidden sm:block">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search patients, trials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 lg:w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-navy-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy-400"
            />
          </div>

          {/* Date */}
          <div className="hidden lg:block text-right">
            <p className="text-xs text-slate-400">Today</p>
            <p className="text-sm font-medium text-navy-700">Aug 15, 2026</p>
          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-700 text-white text-sm font-bold">
              PS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="px-4 lg:px-6 py-6 max-w-[1400px] mx-auto w-full">{children}</div>;
}
