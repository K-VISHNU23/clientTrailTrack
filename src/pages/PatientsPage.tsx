import { useState, useMemo } from 'react';
import { Search, Filter, ChevronRight, MapPin, Pill, AlertTriangle, FileText } from 'lucide-react';
import { Card, Badge, Button, StatusBadge, EmptyState } from '@/components/ui';
import { useNav } from '@/context/NavContext';
import { patients } from '@/data/patients';
import type { ScreeningStatus } from '@/types';

export function PatientsPage() {
  const { navigate } = useNav();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        !search ||
        p.patient_id.toLowerCase().includes(search.toLowerCase()) ||
        p.conditions.some((c) => c.toLowerCase().includes(search.toLowerCase())) ||
        p.medications.some((m) => m.toLowerCase().includes(search.toLowerCase())) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.screeningStatus === statusFilter;
      const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
      return matchesSearch && matchesStatus && matchesGender;
    });
  }, [search, statusFilter, genderFilter]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Search + Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search patient ID, condition, medication..."
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
              <option value="ELIGIBLE">Eligible</option>
              <option value="INELIGIBLE">Ineligible</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="NOT_SCREENED">Not Screened</option>
            </select>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white py-2.5 px-3 text-sm focus:border-navy-400 focus:outline-none"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-navy-700">{filtered.length}</span> of {patients.length} patients
        </p>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={Filter}
            title="No patients found"
            message="Try adjusting your search or filter criteria."
            action={<Button variant="outline" onClick={() => { setSearch(''); setStatusFilter('all'); setGenderFilter('all'); }}>Clear Filters</Button>}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-400 border-b border-slate-100 bg-slate-50">
                  <th className="font-semibold px-4 py-3">Patient ID</th>
                  <th className="font-semibold px-4 py-3 text-right">Age</th>
                  <th className="font-semibold px-4 py-3">Gender</th>
                  <th className="font-semibold px-4 py-3">Conditions</th>
                  <th className="font-semibold px-4 py-3">Key Labs</th>
                  <th className="font-semibold px-4 py-3">Location</th>
                  <th className="font-semibold px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.patient_id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate('patient-detail', { patientId: p.patient_id })}
                  >
                    <td className="px-4 py-3 font-semibold text-navy-700">{p.patient_id}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{p.age}</td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{p.gender}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.conditions.map((c) => (
                          <Badge key={c} variant="navy">{c}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {p.labs['HbA1c'] ? `HbA1c ${p.labs['HbA1c'].value}%` : '—'}
                      {p.labs['eGFR'] ? `, eGFR ${p.labs['eGFR'].value}` : ''}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.location}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.screeningStatus as ScreeningStatus} size="sm" /></td>
                    <td className="px-4 py-3"><ChevronRight className="h-4 w-4 text-slate-300" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export function PatientDetailPage() {
  const { params, navigate } = useNav();
  const patient = patients.find((p) => p.patient_id === params.patientId);

  if (!patient) {
    return (
      <Card>
        <EmptyState
          icon={FileText}
          title="Patient not found"
          message="The patient you're looking for doesn't exist."
          action={<Button onClick={() => navigate('patients')}>Back to Patients</Button>}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-100 text-navy-700 text-lg font-bold">
            {patient.patient_id}
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-800">Patient {patient.patient_id}</h2>
            <p className="text-sm text-slate-500">
              {patient.age} years old · {patient.gender === 'female' ? 'Female' : 'Male'} · {patient.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={patient.screeningStatus as ScreeningStatus} />
          <Button variant="primary" onClick={() => navigate('matching', { patientId: patient.patient_id })}>
            <Search className="h-4 w-4" />
            Run Matching
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Conditions</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.conditions.map((c) => (
              <Badge key={c} variant="navy">{c}</Badge>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Pill className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Medications</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.medications.length > 0 ? (
              patient.medications.map((m) => (
                <Badge key={m} variant="teal">{m}</Badge>
              ))
            ) : (
              <span className="text-sm text-slate-400">None recorded</span>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Allergies</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.allergies.length > 0 ? (
              patient.allergies.map((a) => (
                <Badge key={a} variant="amber">{a}</Badge>
              ))
            ) : (
              <span className="text-sm text-slate-400">None recorded</span>
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <MapPin className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Location</span>
          </div>
          <p className="text-sm font-medium text-navy-700">{patient.location}</p>
        </Card>
      </div>

      {/* Recent Labs */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Recent Laboratory Results</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(patient.labs).map(([key, lab]) => (
            <div key={key} className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-slate-600">{key}</span>
                <Badge variant={
                  lab.status === 'normal' ? 'green' :
                  lab.status === 'abnormal' ? 'red' :
                  lab.status === 'outdated' ? 'amber' : 'neutral'
                }>{lab.status}</Badge>
              </div>
              <p className="text-xl font-bold text-navy-800">{lab.value}<span className="text-sm font-normal text-slate-400 ml-1">{lab.unit}</span></p>
              <p className="text-xs text-slate-400 mt-1">Date: {lab.date}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Lab Timeline */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Laboratory Timeline</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="font-medium px-3 py-2">Test</th>
                <th className="font-medium px-3 py-2 text-right">Value</th>
                <th className="font-medium px-3 py-2">Unit</th>
                <th className="font-medium px-3 py-2">Date</th>
                <th className="font-medium px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(patient.labs).map(([key, lab]) => (
                <tr key={key} className="border-b border-slate-50">
                  <td className="px-3 py-2.5 font-medium text-navy-700">{key}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-navy-700">{lab.value}</td>
                  <td className="px-3 py-2.5 text-slate-500">{lab.unit}</td>
                  <td className="px-3 py-2.5 text-slate-500">{lab.date}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={
                      lab.status === 'normal' ? 'green' :
                      lab.status === 'abnormal' ? 'red' :
                      lab.status === 'outdated' ? 'amber' : 'neutral'
                    }>{lab.status || 'unknown'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Clinical Notes */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-slate-400" />
          <h3 className="font-semibold text-navy-800">Clinical Notes</h3>
        </div>
        <p className="text-sm text-slate-600 italic leading-relaxed">"{patient.notes}"</p>
      </Card>
    </div>
  );
}
