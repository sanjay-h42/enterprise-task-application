// src/pages/Settings.jsx
import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  RefreshCw,
  CheckCircle2,
  Server,
  Sliders,
  Calendar,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAvatarColor } from '../utils/cn';

export default function Settings({ onMobileMenuOpen }) {
  const { user, login } = useAuth();
  const { success } = useToast();

  const [notifications, setNotifications] = useState({
    reviewReminders: true,
    feedbackAlerts: true,
    goalMilestones: true,
    weeklyDigest: false,
  });

  const [apiConfig, setApiConfig] = useState({
    useMock: true,
    apiUrl: 'http://localhost:8080/api/v1',
  });

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      success('System settings saved successfully');
    }, 400);
  };

  const handleRoleSwitch = (role) => {
    const roleAccounts = {
      ADMIN: { id: 100, name: 'Sanjay Mehta', email: 'admin@pulse.io', role: 'ADMIN', avatar: 'SM' },
      MANAGER: { id: 101, name: 'Rahul Kumar', email: 'manager@pulse.io', role: 'MANAGER', avatar: 'RK' },
      EMPLOYEE: { id: 102, name: 'Ananya Sharma', email: 'employee@pulse.io', role: 'EMPLOYEE', avatar: 'AS' },
    };
    const targetUser = roleAccounts[role];
    if (targetUser) {
      localStorage.setItem('pulse_auth_user', JSON.stringify(targetUser));
      localStorage.setItem('pulse_auth_token', 'mock-jwt-token-demo');
      window.location.reload();
    }
  };

  return (
    <PageContainer
      title="System Settings & Profiles"
      breadcrumb={['PULSE Enterprise', 'Settings']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-ink">Configuration & Workspace Settings</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage your account identity, role credentials, review cycle rules, and backend connectivity.
          </p>
        </div>

        {/* Current Active User Profile Card */}
        {user && (
          <div className="card p-5 border-amber-200 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="avatar flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  background: getAvatarColor(user.name),
                  fontSize: 16,
                  color: 'white',
                }}
              >
                {user.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{user.name}</h3>
                  <Badge variant="primary">{user.role}</Badge>
                </div>
                <p className="text-xs text-ink-secondary">{user.email}</p>
                <p className="text-xs text-ink-muted mt-0.5">Active Session · Organization ID: ACME-GLOBAL</p>
              </div>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="flex flex-col sm:items-end gap-1.5 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
              <span className="text-[10px] uppercase font-bold text-ink-muted">Simulate Role View:</span>
              <div className="flex items-center gap-1.5">
                {['ADMIN', 'MANAGER', 'EMPLOYEE'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSwitch(r)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                      user.role === r
                        ? 'bg-amber-500 text-zinc-950 border-amber-600'
                        : 'bg-surface-raised text-ink-secondary border-border hover:bg-surface-overlay'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Notification Preferences */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Bell size={16} className="text-amber-500" />
              <h3 className="text-sm font-bold text-ink">Notification & Alert Preferences</h3>
            </div>

            <div className="space-y-3">
              {[
                { key: 'reviewReminders', title: 'Performance Review Deadlines', desc: 'Receive automated notifications 14, 7, and 2 days before cycle closure.' },
                { key: 'feedbackAlerts', title: '360 Feedback Notifications', desc: 'Alert when a manager or peer posts continuous feedback on your profile.' },
                { key: 'goalMilestones', title: 'Goal Status & Milestone Updates', desc: 'Notify on goal progress updates and status transitions.' },
                { key: 'weeklyDigest', title: 'Weekly Performance Executive Digest', desc: 'Consolidated weekly summary email with KPI velocity metrics.' },
              ].map((item) => (
                <label key={item.key} className="flex items-start justify-between gap-4 p-2.5 rounded-lg hover:bg-surface-raised transition-colors cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-ink">{item.title}</div>
                    <div className="text-xs text-ink-muted">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded mt-0.5 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Backend Connectivity & API Configuration */}
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Server size={16} className="text-sky-500" />
              <h3 className="text-sm font-bold text-ink">Backend Architecture & Data Mode</h3>
            </div>

            <p className="text-xs text-ink-muted">
              PULSE comes equipped with a mock API engine and real Spring Boot REST client interfaces.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-surface-raised rounded-lg border border-border">
                <div>
                  <div className="text-xs font-semibold text-ink">Use High-Fidelity Mock Engine</div>
                  <div className="text-xs text-ink-muted">Runs standalone in-browser with mock delays and state emulation.</div>
                </div>
                <Badge variant={apiConfig.useMock ? 'success' : 'default'}>
                  {apiConfig.useMock ? 'Mock Engine Active' : 'Real API'}
                </Badge>
              </div>

              <Input
                label="Spring Boot REST API Endpoint (When VITE_USE_MOCK=false)"
                value={apiConfig.apiUrl}
                onChange={(e) => setApiConfig({ ...apiConfig, apiUrl: e.target.value })}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" loading={saving}>
              Save All Preferences
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
