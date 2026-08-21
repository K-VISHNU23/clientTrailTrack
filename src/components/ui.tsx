import type { ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import type { CriterionResult, ScreeningStatus } from '@/types';

// Badge — small status pill
export function Badge({
  children,
  variant = 'neutral',
  className = '',
}: {
  children: ReactNode;
  variant?: 'neutral' | 'navy' | 'teal' | 'amber' | 'red' | 'green' | 'blue';
  className?: string;
}) {
  const variants: Record<string, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    navy: 'bg-navy-100 text-navy-700',
    teal: 'bg-teal-100 text-teal-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// StatusBadge — PASS / FAIL / NEEDS_REVIEW with icon
export function StatusBadge({ status, size = 'md' }: { status: CriterionResult | ScreeningStatus; size?: 'sm' | 'md' }) {
  const normalized = status === 'NOT_SCREENED' ? 'NEEDS_REVIEW' : status;
  const config: Record<string, { icon: typeof CheckCircle2; classes: string; label: string }> = {
    PASS: { icon: CheckCircle2, classes: 'bg-teal-50 text-teal-700 border-teal-200', label: 'PASS' },
    ELIGIBLE: { icon: CheckCircle2, classes: 'bg-teal-50 text-teal-700 border-teal-200', label: 'ELIGIBLE' },
    FAIL: { icon: XCircle, classes: 'bg-red-50 text-red-700 border-red-200', label: 'FAIL' },
    INELIGIBLE: { icon: XCircle, classes: 'bg-red-50 text-red-700 border-red-200', label: 'INELIGIBLE' },
    NEEDS_REVIEW: { icon: AlertCircle, classes: 'bg-amber-50 text-amber-700 border-amber-200', label: 'NEEDS REVIEW' },
  };
  const cfg = config[normalized] || config['NEEDS_REVIEW'];
  const Icon = cfg.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${cfg.classes} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

// Button — primary/secondary/ghost variants
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants: Record<string, string> = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800 shadow-sm',
    secondary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm',
    ghost: 'text-navy-700 hover:bg-navy-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    outline: 'border border-slate-300 text-navy-700 hover:bg-slate-50 bg-white',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-navy-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

// Card — container with optional hover
export function Card({
  children,
  className = '',
  hover = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// EmptyState — friendly empty placeholder
export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: typeof CheckCircle2;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Icon className="h-8 w-8 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-navy-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

// ProgressBar — for loading/matching states
export function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full rounded-full bg-slate-200 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-navy-600 transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// Tabs — simple tab switcher
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string; icon?: typeof CheckCircle2 }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none ${
              isActive
                ? 'border-navy-600 text-navy-700'
                : 'border-transparent text-slate-500 hover:text-navy-600 hover:border-slate-300'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// Modal — overlay dialog
export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  if (!open) return null;
  const sizes: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-elevated animate-scale-in scrollbar-thin`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 z-10">
          <h2 className="text-lg font-semibold text-navy-800">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-navy-400" aria-label="Close">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ScoreRing — circular progress for match scores
export function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#28a085' : score >= 50 ? '#f99407' : '#dc2626';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>
        {Math.round(score)}%
      </span>
    </div>
  );
}
