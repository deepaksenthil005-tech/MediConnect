import React from 'react';
import { FileText, X, CheckCircle, Download } from 'lucide-react';

/**
 * Shared Report Viewer Modal
 * Props:
 *   record       - { id, name, date, size }
 *   healthData   - { weight, height, heartRate, bloodOxygen, stressLevel }
 *   patientId    - number/string
 *   patientName  - string
 *   onClose      - () => void
 */
export default function ReportViewerModal({ record, healthData = {}, patientId, patientName, onClose }) {
  if (!record) return null;

  const bmi = healthData.height
    ? (healthData.weight / ((healthData.height / 100) ** 2)).toFixed(1)
    : '—';

  const metrics = [
    { label: 'Weight', value: healthData.weight ? `${healthData.weight} kg` : '—' },
    { label: 'Height', value: healthData.height ? `${healthData.height} cm` : '—' },
    { label: 'BMI', value: bmi },
    { label: 'Heart Rate', value: healthData.heartRate ? `${healthData.heartRate} bpm` : '—' },
    { label: 'Blood Oxygen', value: healthData.bloodOxygen ? `${healthData.bloodOxygen}%` : '—' },
    { label: 'Stress Level', value: healthData.stressLevel || '—' },
  ];

  const handleDownload = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Medical Report — ${record.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; color: #1e293b; }
    .page { max-width: 720px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669, #10b981); padding: 32px 40px; color: #fff; }
    .header-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #d1fae5; margin-bottom: 6px; }
    .header h1 { font-size: 22px; font-weight: 800; word-break: break-all; }
    .header h1 a { color: white; text-decoration: underline; word-break: break-all; }
    .header .patient-info { font-size: 13px; color: #a7f3d0; margin-top: 6px; }
    .body { padding: 32px 40px; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 24px 0 12px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .meta-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px; }
    .meta-card .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #059669; margin-bottom: 4px; }
    .meta-card .value { font-size: 16px; font-weight: 700; color: #111827; word-break: break-word; }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .metric-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; text-align: center; }
    .metric-card .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
    .metric-card .value { font-size: 19px; font-weight: 800; color: #111827; }
    .badge { display: flex; align-items: center; gap: 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px 18px; margin-top: 24px; }
    .badge p { font-size: 13px; font-weight: 700; color: #065f46; }
    .footer { background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 18px 40px; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 11px; color: #94a3b8; font-weight: 600; }
    .footer .brand { font-size: 14px; font-weight: 800; color: #10b981; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-badge">MediConnect — Medical Report</div>
      ${record.image || record.url
        ? `<h1><a href="${record.image || record.url}" target="_blank" rel="noopener noreferrer">${record.name}</a></h1>`
        : `<h1>${record.name}</h1>`
      }
      ${patientName ? `<div class="patient-info">Patient: ${patientName}</div>` : ''}
    </div>
    <div class="body">
      <div class="section-title">File Information</div>
      <div class="meta-grid">
        <div class="meta-card"><div class="label">Date Filed</div><div class="value">${record.date || new Date().toLocaleString("en-IN")}</div></div>
        <div class="meta-card"><div class="label">File Size</div><div class="value">${record.size || '—'}</div></div>
        <div class="meta-card"><div class="label">Patient ID</div><div class="value">#${patientId || '—'}</div></div>
      </div>
      <div class="section-title">Patient Health Summary</div>
      <div class="metrics-grid">
        ${metrics.map(m => `<div class="metric-card"><div class="label">${m.label}</div><div class="value">${m.value}</div></div>`).join('')}
      </div>
      <div class="badge">
        <span>✅</span>
        <p>This report is verified and filed with MediConnect Health Records. Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
      </div>
    </div>
    <div class="footer">
      <p>Generated by MediConnect Health Portal • ${new Date().toLocaleString('en-IN')}</p>
      <div class="brand">MediConnect</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediConnect_Report_${record.name.replace(/[^a-zA-Z0-9.]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '1rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: '1.25rem', width: '100%', maxWidth: 600,
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={22} style={{ color: '#fff' }} />
            <div>
              <p style={{ color: '#d1fae5', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Medical Report</p>
              <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{record.name}</h3>
              {patientName && <p style={{ color: '#a7f3d0', fontSize: '0.72rem', margin: '2px 0 0' }}>Patient: {patientName}</p>}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.75rem 2rem', overflowY: 'auto', maxHeight: '65vh' }}>
          {/* File meta */}
          <h4 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.6rem' }}>File Information</h4>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Date Filed', value: record.date || '—' },
              { label: 'File Size', value: record.size || '—' },
              { label: 'Patient ID', value: `#${patientId || '—'}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ flex: 1, minWidth: 140, background: '#f0fdf4', borderRadius: '0.6rem', padding: '0.7rem 0.9rem', border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: '0.6rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.2rem' }}>{label}</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827', margin: 0, wordBreak: 'break-all' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Health metrics */}
          <h4 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.6rem' }}>Patient Health Summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {metrics.map(({ label, value }) => (
              <div key={label} style={{ background: '#f9fafb', borderRadius: '0.5rem', padding: '0.6rem 0.5rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 0.2rem' }}>{label}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827', margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Verified badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#ecfdf5', borderRadius: '0.6rem', border: '1px solid #a7f3d0' }}>
            <CheckCircle size={18} style={{ color: '#10b981', flexShrink: 0 }} />
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065f46', margin: 0 }}>This report is verified and filed with MediConnect Health Records.</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onClose} style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
            Close
          </button>
          <button
            onClick={handleDownload}
            style={{ padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: '#059669', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Download size={14} /> Download Report
          </button>
        </div>
      </div>
    </div>
  );
}
