// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, ArrowRight, TrendingUp, Users, Target, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Mini data viz for the left panel
function MiniKPICard({ label, value, trend, color }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-white/8 bg-white/4">
      <div>
        <div style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#71717A' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', marginTop: 2 }}>{value}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: trend > 0 ? '#4ADE80' : '#F87171' }}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
        <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <div style={{ width: `${Math.min(100, value)}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 1s ease' }} />
        </div>
      </div>
    </div>
  );
}

function TrendLine() {
  const pts = [40, 52, 48, 61, 58, 72, 69, 81, 87, 91];
  const w = 220, h = 56;
  const max = Math.max(...pts), min = Math.min(...pts);
  const range = max - min || 1;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map(p => h - ((p - min) / range) * (h - 8) - 4);
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x},${ys[i]}`).join(' ');
  const areaPath = `${path} L ${xs[xs.length - 1]},${h} L 0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#lg)" />
      <path d={path} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r={i === xs.length - 1 ? 4 : 2}
          fill={i === xs.length - 1 ? '#F59E0B' : '#92400E'}
          stroke={i === xs.length - 1 ? '#FDE68A' : 'none'} strokeWidth="2" />
      ))}
    </svg>
  );
}

const DEMO_ACCOUNTS = [
  { role: 'Manager', email: 'manager@pulse.io', color: '#F59E0B' },
  { role: 'Admin', email: 'admin@pulse.io', color: '#0EA5E9' },
  { role: 'Employee', email: 'employee@pulse.io', color: '#16A34A' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState({ email: 'manager@pulse.io', password: 'demo123', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  // Already logged in
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 3) e.password = 'Password must be at least 3 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const result = await login(form.email, form.password);
    if (result.success) {
      success(`Welcome back, ${result.user.name.split(' ')[0]}.`, 'Signed in');
      navigate('/dashboard');
    } else {
      toastError(result.error || 'Sign in failed. Please try again.', 'Authentication error');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* ── Left Panel ──────────────────────────────────── */}
      <div className="login-left" style={{ flex: '0 0 46%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '3rem', position: 'relative' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={22} style={{ color: '#F59E0B' }} />
          <span style={{ fontWeight: 800, fontSize: '1.375rem', letterSpacing: '-0.03em', color: '#FFFFFF' }}>
            PUL<span style={{ color: '#F59E0B' }}>SE</span>
          </span>
        </div>

        {/* Hero copy */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem', maxWidth: 380 }}>
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: '1rem' }}>
              Employee Performance Intelligence
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#FFFFFF', marginBottom: '0.75rem' }}>
              Measure.<br />Understand.<br />Improve.
            </h1>
            <p style={{ fontSize: '0.9375rem', color: '#71717A', lineHeight: 1.6, maxWidth: 300 }}>
              A unified platform for goals, KPIs, feedback, and performance reviews — built for enterprises that take people seriously.
            </p>
          </div>

          {/* Performance trend viz */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#52525B' }}>
                Performance Trend
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F59E0B' }}>91.2% <span style={{ color: '#4ADE80', fontSize: '0.75rem' }}>↑ 4.2%</span></div>
            </div>
            <TrendLine />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              {['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3'].map((q, i) => (
                <span key={i} style={{ fontSize: '0.625rem', color: '#52525B' }}>{q}</span>
              ))}
            </div>
          </div>

          {/* Mini KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <MiniKPICard label="KPI Score" value="87.6%" trend={4.2} color="#F59E0B" />
            <MiniKPICard label="Goals Done" value="82%" trend={6.4} color="#16A34A" />
            <MiniKPICard label="Feedback" value="4.1/5" trend={7.9} color="#8B5CF6" />
            <MiniKPICard label="Reviews" value="72%" trend={24.1} color="#0EA5E9" />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[{ icon: Users, label: '10 Employees' }, { icon: Target, label: '16 Goals' }, { icon: BarChart2, label: '25 KPIs' }].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#52525B', fontSize: '0.75rem' }}>
              <Icon size={12} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Panel ─────────────────────────────────── */}
      <div style={{ flex: 1, background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#1C1917', marginBottom: '0.5rem' }}>
              Sign in to PULSE
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#78716C' }}>
              Use a demo account to explore the platform.
            </p>
          </div>

          {/* Demo account shortcuts */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                onClick={() => setForm(f => ({ ...f, email: acc.email, password: 'demo123' }))}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: 6,
                  border: `1px solid ${form.email === acc.email ? acc.color : '#E7E5E4'}`,
                  background: form.email === acc.email ? acc.color + '14' : '#FFFFFF',
                  color: form.email === acc.email ? acc.color : '#78716C',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {acc.role}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#44403C' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input"
                placeholder="you@company.io"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span id="email-error" style={{ fontSize: '0.75rem', color: '#B91C1C' }}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#44403C' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input"
                  placeholder="Enter password"
                  style={{ paddingRight: '2.5rem' }}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: '#A8A29E', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span id="password-error" style={{ fontSize: '0.75rem', color: '#B91C1C' }}>{errors.password}</span>}
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                id="remember"
                type="checkbox"
                checked={form.remember}
                onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
                style={{ accentColor: '#F59E0B', width: 14, height: 14 }}
              />
              <label htmlFor="remember" style={{ fontSize: '0.8125rem', color: '#78716C', cursor: 'pointer' }}>
                Remember me
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.5rem',
                background: loading ? '#FDE68A' : '#F59E0B',
                color: '#1C1917',
                border: '1px solid #D97706',
                borderRadius: 6,
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.12s ease',
                fontFamily: 'Inter, sans-serif',
                marginTop: '0.25rem',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#D97706'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#F59E0B'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Sign in <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Demo note */}
          <div style={{ marginTop: '1.75rem', padding: '0.875rem 1rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B45309', marginBottom: '0.25rem' }}>Demo credentials</div>
            <div style={{ fontSize: '0.75rem', color: '#92400E', lineHeight: 1.6 }}>
              Email: <span style={{ fontFamily: 'monospace', background: '#FFFBEB', padding: '1px 4px', borderRadius: 3 }}>manager@pulse.io</span><br />
              Password: <span style={{ fontFamily: 'monospace', background: '#FFFBEB', padding: '1px 4px', borderRadius: 3 }}>demo123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
