import { useState } from 'react';
import { Upload, FileText, FileCheck, FlaskConical, Pill, Calendar, ShieldAlert, ScrollText, Eye } from 'lucide-react';
import { Card, Badge, Button, EmptyState, Modal } from '@/components/ui';
import { researchDocuments } from '@/data/auxiliary';
import type { ResearchDocument } from '@/types';

const typeConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
  protocol: { icon: ScrollText, label: 'Trial Protocol', color: 'navy' },
  eligibility: { icon: FileCheck, label: 'Eligibility Doc', color: 'teal' },
  clinical_note: { icon: FileText, label: 'Clinical Note', color: 'blue' },
  lab_report: { icon: FlaskConical, label: 'Lab Report', color: 'amber' },
  consent: { icon: FileCheck, label: 'Consent Form', color: 'green' },
  research: { icon: FileText, label: 'Research Doc', color: 'neutral' },
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<ResearchDocument[]>(researchDocuments);
  const [viewDoc, setViewDoc] = useState<ResearchDocument | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleUpload() {
    const newDoc: ResearchDocument = {
      id: `D${Date.now()}`,
      name: `New_Document_${documents.length + 1}.pdf`,
      type: 'research',
      upload_date: '2026-08-15',
      size: '1.2 MB',
      status: 'processing',
      summary: 'Document is being processed. Extracted information will appear shortly.',
      extracted: { conditions: [], medications: [], lab_values: [], eligibility_criteria: [], dates: [], restrictions: [] },
    };
    setDocuments([newDoc, ...documents]);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-navy-800">Research Document Intelligence</h2>
        <p className="text-sm text-slate-500 mt-1">Upload and analyze clinical trial documents with AI extraction</p>
      </div>

      {/* Upload area */}
      <Card
        className={`p-8 border-2 border-dashed transition-colors ${dragOver ? 'border-navy-400 bg-navy-50' : 'border-slate-200'}`}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
          className="flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4 rounded-full bg-navy-100 p-4">
            <Upload className="h-8 w-8 text-navy-500" />
          </div>
          <h3 className="font-semibold text-navy-700 mb-1">Upload Research Document</h3>
          <p className="text-sm text-slate-400 mb-4 max-w-md">
            Drag and drop trial protocols, eligibility documents, clinical notes, or lab reports here.
            The system will extract key entities automatically.
          </p>
          <Button variant="primary" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
            Choose File to Upload
          </Button>
          <p className="text-xs text-slate-400 mt-3">Supports PDF, DOCX, TXT · Max 10MB</p>
        </div>
      </Card>

      {/* Document list */}
      {documents.length === 0 ? (
        <Card>
          <EmptyState icon={FileText} title="No documents uploaded" message="Upload a research document to see AI-extracted information." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const cfg = typeConfig[doc.type] || typeConfig.research;
            const Icon = cfg.icon;
            return (
              <Card key={doc.id} className="p-5 card-hover">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 shrink-0">
                    <Icon className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy-700 text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant={cfg.color as 'navy'}>{cfg.label}</Badge>
                      <span className="text-xs text-slate-400">{doc.size}</span>
                      <span className="text-xs text-slate-400">{doc.upload_date}</span>
                    </div>
                  </div>
                  <Badge variant={doc.status === 'processed' ? 'green' : doc.status === 'processing' ? 'amber' : 'neutral'}>
                    {doc.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate-500 mb-3">{doc.summary}</p>

                {/* Extracted info */}
                {doc.status === 'processed' && (
                  <div className="space-y-2 mb-4">
                    {doc.extracted.conditions.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Pill className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {doc.extracted.conditions.map((c) => <Badge key={c} variant="navy">{c}</Badge>)}
                        </div>
                      </div>
                    )}
                    {doc.extracted.medications.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Pill className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {doc.extracted.medications.map((m) => <Badge key={m} variant="teal">{m}</Badge>)}
                        </div>
                      </div>
                    )}
                    {doc.extracted.lab_values.length > 0 && (
                      <div className="flex items-start gap-2">
                        <FlaskConical className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {doc.extracted.lab_values.map((v) => <Badge key={v} variant="amber">{v}</Badge>)}
                        </div>
                      </div>
                    )}
                    {doc.extracted.eligibility_criteria.length > 0 && (
                      <div className="flex items-start gap-2">
                        <FileCheck className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex flex-wrap gap-1">
                          {doc.extracted.eligibility_criteria.map((c) => <Badge key={c} variant="blue">{c}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex gap-2 text-xs text-slate-400">
                    {doc.patient_id && <span>Patient: {doc.patient_id}</span>}
                    {doc.trial_id && <span>Trial: {doc.trial_id}</span>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setViewDoc(doc)}>
                    <Eye className="h-3.5 w-3.5" />
                    View Source
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* View source modal */}
      <Modal open={!!viewDoc} onClose={() => setViewDoc(null)} title="Document Details" size="md">
        {viewDoc && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Document</p>
              <p className="font-semibold text-navy-800">{viewDoc.name}</p>
              <p className="text-sm text-slate-500 mt-1">{viewDoc.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-1">Type</p>
                <p className="text-sm font-medium text-navy-700">{typeConfig[viewDoc.type]?.label || viewDoc.type}</p>
              </div>
              <div className="rounded-lg border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-1">Upload Date</p>
                <p className="text-sm font-medium text-navy-700">{viewDoc.upload_date}</p>
              </div>
              {viewDoc.patient_id && (
                <div className="rounded-lg border border-slate-100 p-3">
                  <p className="text-xs text-slate-400 mb-1">Patient</p>
                  <p className="text-sm font-medium text-navy-700">{viewDoc.patient_id}</p>
                </div>
              )}
              {viewDoc.trial_id && (
                <div className="rounded-lg border border-slate-100 p-3">
                  <p className="text-xs text-slate-400 mb-1">Trial</p>
                  <p className="text-sm font-medium text-navy-700">{viewDoc.trial_id}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Extracted Information</p>
              <div className="space-y-3">
                {viewDoc.extracted.conditions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Conditions</p>
                    <div className="flex flex-wrap gap-1">{viewDoc.extracted.conditions.map((c) => <Badge key={c} variant="navy">{c}</Badge>)}</div>
                  </div>
                )}
                {viewDoc.extracted.medications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Medications</p>
                    <div className="flex flex-wrap gap-1">{viewDoc.extracted.medications.map((m) => <Badge key={m} variant="teal">{m}</Badge>)}</div>
                  </div>
                )}
                {viewDoc.extracted.lab_values.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Lab Values</p>
                    <div className="flex flex-wrap gap-1">{viewDoc.extracted.lab_values.map((v) => <Badge key={v} variant="amber">{v}</Badge>)}</div>
                  </div>
                )}
                {viewDoc.extracted.eligibility_criteria.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Eligibility Criteria</p>
                    <div className="flex flex-wrap gap-1">{viewDoc.extracted.eligibility_criteria.map((c) => <Badge key={c} variant="blue">{c}</Badge>)}</div>
                  </div>
                )}
                {viewDoc.extracted.dates.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> Dates</p>
                    <div className="flex flex-wrap gap-1">{viewDoc.extracted.dates.map((d) => <Badge key={d} variant="neutral">{d}</Badge>)}</div>
                  </div>
                )}
                {viewDoc.extracted.restrictions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Restrictions</p>
                    <div className="flex flex-wrap gap-1">{viewDoc.extracted.restrictions.map((r) => <Badge key={r} variant="red">{r}</Badge>)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
