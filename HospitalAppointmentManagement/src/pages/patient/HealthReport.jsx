import React, { useEffect, useState } from 'react';
import { Activity, Heart, Scale, Ruler, Droplets, Brain, FileText, Upload, Trash2, ExternalLink, Download, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { localDb } from '../../services/localDb';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReportViewerModal from '../../components/ReportViewerModal';


export default function HealthReport() {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingRecord, setViewingRecord] = useState(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    heartRate: '',
    bloodOxygen: '',
    stressLevel: 'Low'
  });

  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user]);

  const refreshData = () => {
    localDb.getHealthReport(user.id).then(data => {
      setReport(data);
      setFormData({
        weight: data.weight,
        height: data.height,
        heartRate: data.heartRate,
        bloodOxygen: data.bloodOxygen,
        stressLevel: data.stressLevel
      });
      setLoading(false);
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await localDb.saveHealthReport(user.id, {
      ...formData,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      heartRate: parseInt(formData.heartRate),
      bloodOxygen: parseInt(formData.bloodOxygen)
    });
    setShowUpdateModal(false);
    refreshData();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const record = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    };

    await localDb.addMedicalRecord(user.id, record);
    refreshData();
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm('Remove this medical record?')) return;
    const reports = JSON.parse(localStorage.getItem('mediconnect_health_reports') || '[]');
    const idx = reports.findIndex((r) => r.patient_id === user.id);
    if (idx !== -1) {
      reports[idx].medicalRecords = (reports[idx].medicalRecords || []).filter((r) => r.id !== recordId);
      localStorage.setItem('mediconnect_health_reports', JSON.stringify(reports));
    }
    refreshData();
  };

  const handleDownloadReport = (record) => {
    const bmiVal = report.height ? (report.weight / ((report.height / 100) ** 2)).toFixed(1) : '—';
    const metrics = [
      { label: 'Weight', value: `${report.weight} kg` },
      { label: 'Height', value: `${report.height} cm` },
      { label: 'BMI', value: bmiVal },
      { label: 'Heart Rate', value: `${report.heartRate} bpm` },
      { label: 'Blood Oxygen (SpO2)', value: `${report.bloodOxygen}%` },
      { label: 'Stress Level', value: report.stressLevel },
    ];

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
    .body { padding: 32px 40px; }
    .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin: 28px 0 12px; }
    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .meta-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px; }
    .meta-card .label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #059669; margin-bottom: 4px; }
    .meta-card .value { font-size: 16px; font-weight: 700; color: #111827; }
    .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .metric-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; text-align: center; }
    .metric-card .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9ca3af; margin-bottom: 6px; }
    .metric-card .value { font-size: 19px; font-weight: 800; color: #111827; }
    .badge { display: flex; align-items: center; gap: 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px 18px; margin-top: 28px; }
    .badge-icon { font-size: 20px; flex-shrink: 0; }
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
      <h1>${record.name}</h1>
    </div>
    <div class="body">
      <div class="section-title">File Information</div>
      <div class="meta-grid">
        <div class="meta-card"><div class="label">Date Filed</div><div class="value">${record.date}</div></div>
        <div class="meta-card"><div class="label">File Size</div><div class="value">${record.size}</div></div>
        <div class="meta-card"><div class="label">Patient ID</div><div class="value">#${user?.id || '—'}</div></div>
      </div>

      <div class="section-title">Patient Health Summary</div>
      <div class="metrics-grid">
        ${metrics.map(m => `<div class="metric-card"><div class="label">${m.label}</div><div class="value">${m.value}</div></div>`).join('')}
      </div>

      <div class="badge">
        <div class="badge-icon">✅</div>
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

  if (loading || !report) {
    return (
      <div className="pd-card">
        <h3 className="pd-card-title">Health Report</h3>
        <p style={{ color: 'var(--text-muted)' }}>Loading health data...</p>
      </div>
    );
  }

  const bmi = report.height ? (report.weight / ((report.height / 100) ** 2)).toFixed(1) : '—';
  const bmiTrendData = (report.bmiHistory || []).map((p) => ({ name: p.label, value: p.value }));

  return (
    <>
      <div className="pd-card" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="pd-card-title" style={{ margin: 0 }}>Health Report</h3>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified by Admin</span>
          </div>
        </div>

        <div className="pd-health-grid">
          <div className="pd-metric-card">
            <Scale size={24} style={{ color: 'var(--text-muted)', marginBottom: 4 }} />
            <div className="pd-metric-card-label">Weight</div>
            <div className="pd-metric-card-value font-bold">{report.weight} kg</div>
          </div>
          <div className="pd-metric-card">
            <Ruler size={24} style={{ color: 'var(--text-muted)', marginBottom: 4 }} />
            <div className="pd-metric-card-label">Height</div>
            <div className="pd-metric-card-value font-bold">{report.height} cm</div>
          </div>
          <div className="pd-metric-card">
            <Activity size={24} style={{ color: 'var(--text-muted)', marginBottom: 4 }} />
            <div className="pd-metric-card-label">BMI</div>
            <div className="pd-metric-card-value font-bold">BMI = {bmi}</div>
            <span className="pd-metric-card-status normal">Normal</span>
          </div>
          <div className="pd-metric-card">
            <Heart size={24} style={{ color: 'var(--danger)', marginBottom: 4 }} />
            <div className="pd-metric-card-label">Heart Rate</div>
            <div className="pd-metric-card-value font-bold">{report.heartRate} bpm</div>
          </div>
          <div className="pd-metric-card">
            <Droplets size={24} style={{ color: 'var(--success)', marginBottom: 4 }} />
            <div className="pd-metric-card-label">Blood Oxygen (SpO2)</div>
            <div className="pd-metric-card-value font-bold">{report.bloodOxygen}%</div>
          </div>
          <div className="pd-metric-card">
            <Brain size={24} style={{ color: 'var(--warning)', marginBottom: 4 }} />
            <div className="pd-metric-card-label">Stress Level</div>
            <div className="pd-metric-card-value font-bold">{report.stressLevel}</div>
          </div>
        </div>
      </div>

      {showUpdateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="pd-card" style={{ width: '100%', maxWidth: '500px', margin: 0 }}>
            <h3 className="pd-card-title">Update Health Metrics</h3>
            <form onSubmit={handleUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="pd-form-group">
                  <label className="pd-form-label">Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="pd-form-input" 
                    value={formData.weight} 
                    onChange={e => setFormData({...formData, weight: e.target.value})}
                    required
                  />
                </div>
                <div className="pd-form-group">
                  <label className="pd-form-label">Height (cm)</label>
                  <input 
                    type="number" 
                    className="pd-form-input" 
                    value={formData.height} 
                    onChange={e => setFormData({...formData, height: e.target.value})}
                    required
                  />
                </div>
                <div className="pd-form-group">
                  <label className="pd-form-label">Heart Rate (bpm)</label>
                  <input 
                    type="number" 
                    className="pd-form-input" 
                    value={formData.heartRate} 
                    onChange={e => setFormData({...formData, heartRate: e.target.value})}
                    required
                  />
                </div>
                <div className="pd-form-group">
                  <label className="pd-form-label">Blood Oxygen (%)</label>
                  <input 
                    type="number" 
                    className="pd-form-input" 
                    value={formData.bloodOxygen} 
                    onChange={e => setFormData({...formData, bloodOxygen: e.target.value})}
                    required
                  />
                </div>
                <div className="pd-form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="pd-form-label">Stress Level</label>
                  <select 
                    className="pd-form-input" 
                    value={formData.stressLevel} 
                    onChange={e => setFormData({...formData, stressLevel: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="pd-btn pd-btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                <button type="submit" className="pd-btn pd-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pd-card">
        <h3 className="pd-card-title">BMI Trend</h3>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bmiTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--card-border)' }} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="pd-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="pd-card-title" style={{ margin: 0 }}>Medical Records & Reports</h3>
        </div>

        <div className="pd-record-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {report.medicalRecords && report.medicalRecords.length > 0 ? (
            report.medicalRecords.map((record) => (
              <div key={record.id} className="pd-record-card" style={{ 
                padding: '1.25rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '1rem', 
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '10px', 
                  background: 'var(--card-bg)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {record.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {record.date} • {record.size}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    className="pd-btn-icon"
                    style={{ padding: '6px', borderRadius: '8px', color: 'var(--primary)' }}
                    title="View Report"
                    onClick={() => setViewingRecord(record)}
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button
                    className="pd-btn-icon"
                    style={{ padding: '6px', borderRadius: '8px', color: 'var(--danger)' }}
                    title="Delete"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px dashed var(--card-border)' }}>
              <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No medical records uploaded yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Report Viewer Modal — shared component */}
      {viewingRecord && (
        <ReportViewerModal
          record={viewingRecord}
          healthData={report}
          patientId={user?.id}
          patientName={user?.name}
          onClose={() => setViewingRecord(null)}
        />
      )}
    </>
  );
}
