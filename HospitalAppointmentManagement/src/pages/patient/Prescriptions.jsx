import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';

const MOCK_PRESCRIPTIONS = [
  { id: 1, doctorName: 'Dr. Sarah Johnson', date: '2024-03-10', notes: 'Vitamin D3 1000 IU daily. Continue current blood pressure medication.' },
  { id: 2, doctorName: 'Dr. Michael Chen', date: '2024-02-28', notes: 'Follow-up in 2 weeks. Rest and avoid strenuous activity.' },
];

export default function Prescriptions() {
  const [prescriptions] = useState(MOCK_PRESCRIPTIONS);

  const handleDownload = (id) => {
    const p = prescriptions.find((x) => x.id === id);
    if (!p) return;
    const content = [
      'Prescription',
      '============',
      '',
      `Doctor: ${p.doctorName}`,
      `Date: ${p.date}`,
      '',
      'Notes:',
      p.notes,
      '',
      'Generated from MediConnect Patient Dashboard',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prescription-${id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="pd-card">
        <h3 className="pd-card-title">Prescriptions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {prescriptions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No prescriptions yet.</p>
          ) : (
            prescriptions.map((p) => (
              <div key={p.id} className="pd-next-apt" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{p.doctorName}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: {p.date}</p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.notes}</p>
                </div>
                <button type="button" className="pd-btn pd-btn-primary" onClick={() => handleDownload(p.id)}>
                  <Download size={18} style={{ marginRight: '0.5rem' }} />
                  Download PDF
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
