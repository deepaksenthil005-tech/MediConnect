import React, { useState } from 'react';
import { Lock, Bell, Shield } from 'lucide-react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('password');
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, push: true, reminders: true });
  const [privacy, setPrivacy] = useState({ profileVisible: true, shareReports: false });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New passwords do not match');
      return;
    }
    alert('Password updated (demo)');
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  return (
    <>
      <div className="pd-card">
        <h3 className="pd-card-title">Settings</h3>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button type="button" className={`pd-btn ${activeSection === 'password' ? 'pd-btn-primary' : 'pd-btn-secondary'}`} onClick={() => setActiveSection('password')}>
            <Lock size={18} style={{ marginRight: '0.5rem' }} />
            Change Password
          </button>
          <button type="button" className={`pd-btn ${activeSection === 'notifications' ? 'pd-btn-primary' : 'pd-btn-secondary'}`} onClick={() => setActiveSection('notifications')}>
            <Bell size={18} style={{ marginRight: '0.5rem' }} />
            Notifications
          </button>
          <button type="button" className={`pd-btn ${activeSection === 'privacy' ? 'pd-btn-primary' : 'pd-btn-secondary'}`} onClick={() => setActiveSection('privacy')}>
            <Shield size={18} style={{ marginRight: '0.5rem' }} />
            Privacy
          </button>
        </div>

        {activeSection === 'password' && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="pd-form-group">
              <label className="pd-form-label">Current Password</label>
              <input type="password" className="pd-form-input" value={passwordForm.current} onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div className="pd-form-group">
              <label className="pd-form-label">New Password</label>
              <input type="password" className="pd-form-input" value={passwordForm.new} onChange={(e) => setPasswordForm((f) => ({ ...f, new: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div className="pd-form-group">
              <label className="pd-form-label">Confirm New Password</label>
              <input type="password" className="pd-form-input" value={passwordForm.confirm} onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="••••••••" required />
            </div>
            <button type="submit" className="pd-btn pd-btn-primary">Update Password</button>
          </form>
        )}

        {activeSection === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['email', 'push', 'reminders'].map((key) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
                <span style={{ textTransform: 'capitalize' }}>{key} notifications</span>
                <button
                  type="button"
                  onClick={() => setNotifications((n) => ({ ...n, [key]: !n[key] }))}
                  style={{
                    width: 48,
                    height: 26,
                    borderRadius: 13,
                    border: 'none',
                    background: notifications[key] ? 'var(--primary)' : '#cbd5e1',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'absolute', top: 2, left: notifications[key] ? 'auto' : 2, right: notifications[key] ? 2 : 'auto', width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left 0.2s, right 0.2s' }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
              <span>Profile visible to doctors</span>
              <input type="checkbox" checked={privacy.profileVisible} onChange={() => setPrivacy((p) => ({ ...p, profileVisible: !p.profileVisible }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
              <span>Share health reports with doctors</span>
              <input type="checkbox" checked={privacy.shareReports} onChange={() => setPrivacy((p) => ({ ...p, shareReports: !p.shareReports }))} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
