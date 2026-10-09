// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Target,
  BarChart2,
  Calendar,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge, { RatingBadge, StatusBadge } from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import Skeleton from '../components/ui/Skeleton';
import { analyticsApi } from '../api/analyticsApi';
import { employeeApi } from '../api/employeeApi';
import { reviewApi } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, formatScore } from '../utils/cn';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export default function Dashboard({ onMobileMenuOpen }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashRes, empRes, cyclesRes] = await Promise.all([
          analyticsApi.getDashboard(),
          employeeApi.getAll(),
          reviewApi.getCycles(),
        ]);
        setDashboardData(dashRes);
        setEmployees(empRes.data || []);
        const active = cyclesRes.find((c) => c.status === 'ACTIVE') || cyclesRes[0];
        setActiveCycle(active);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !dashboardData) {
    return (
      <PageContainer title="Overview" breadcrumb={['Performance', 'Overview']} onMobileMenuOpen={onMobileMenuOpen}>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 lg:col-span-2 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
          </div>
        </div>
      </PageContainer>
    );
  }

  const { overview, signals, trend, kpiHealth, departmentPerformance } = dashboardData;

  // Filter top performers and needs attention
  const topPerformers = [...employees].sort((a, b) => b.overallScore - a.overallScore).slice(0, 4);
  const attentionEmployees = employees.filter((e) => e.overallScore < 75);

  return (
    <PageContainer
      title="Performance Overview"
      breadcrumb={['PULSE Enterprise', 'Overview']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Welcome & Review Cycle Banner */}
        <div className="card p-6 border-amber-200 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-amber-400/10 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge badge-excellent text-xs px-2.5 py-0.5 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Performance Cycle
                </span>
                <span className="text-xs text-ink-muted">· {activeCycle?.name || 'Q3 FY2026'}</span>
              </div>
              <h2 className="text-2xl font-bold text-ink tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Executive'}
              </h2>
              <p className="text-sm text-ink-muted mt-1 max-w-2xl">
                Enterprise performance index is at <strong className="text-ink font-semibold">{overview.overallScore}%</strong> (+{overview.trend}% vs last cycle). {overview.reviewEndDays} days remaining to finalize reviews.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                icon={<BarChart2 size={14} />}
                onClick={() => navigate('/analytics')}
              >
                Detailed Analytics
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Target size={14} />}
                onClick={() => navigate('/reviews')}
              >
                Review Cycle ({overview.reviewProgress || 72}%)
              </Button>
            </div>
          </div>

          {/* Quick cycle progress mini-bar */}
          <div className="mt-5 pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-secondary">
            <div className="flex items-center gap-3">
              <Clock size={14} className="text-amber-600" />
              <span>
                <strong>{activeCycle?.completed || 7} of {activeCycle?.total || 10} reviews submitted</strong>
              </span>
              <span className="text-ink-muted">({activeCycle?.pending || 3} pending approvals)</span>
            </div>
            <div className="w-full sm:w-64">
              <Progress value={activeCycle?.progress || 72} size="sm" color="accent" />
            </div>
          </div>
        </div>

        {/* 4 Hero Signal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {signals.map((sig) => (
            <div key={sig.id} className="card p-4 card-hover flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-label text-ink-muted">{sig.label}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    sig.change >= 0
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {sig.change >= 0 ? `+${sig.change}` : sig.change}
                  {sig.unit === '%' ? '%' : ''}
                </span>
              </div>
              <div className="my-2">
                <div className="text-score font-bold text-ink">
                  {sig.value}
                  <span className="text-sm font-normal text-ink-muted ml-1">{sig.unit}</span>
                </div>
              </div>
              <div className="text-xs text-ink-subtle flex items-center justify-between border-t border-border pt-2 mt-1">
                <span>{sig.interpretation}</span>
                <span className="text-ink-muted">Prev: {sig.previous}{sig.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Performance Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Index Trend Line (2 cols) */}
          <div className="card p-5 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Performance Trajectory</h3>
                <p className="text-xs text-ink-muted">Consolidated organization index vs target over 7 quarters</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-ink-secondary">
                  <span className="w-3 h-1 bg-amber-500 rounded" /> Org Index
                </span>
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <span className="w-3 h-1 bg-zinc-300 rounded" /> Target SLA
                </span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="period" tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7E5E4' }} />
                  <YAxis domain={[65, 100]} tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(val, name) => [`${val}%`, name === 'score' ? 'Org Score' : 'Target SLA']}
                  />
                  <Area type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                  <Area type="monotone" dataKey="target" stroke="#A8A29E" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-ink-secondary">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <TrendingUp size={13} /> Continuous upward velocity since Q1 FY25 (+13.4 pts)
              </span>
              <button onClick={() => navigate('/analytics')} className="text-amber-600 hover:underline font-medium">
                Open analytics →
              </button>
            </div>
          </div>

          {/* KPI Pillar Health (1 col) */}
          <div className="card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-ink">KPI Category Health</h3>
                  <p className="text-xs text-ink-muted">Weight-adjusted category achievement</p>
                </div>
                <button
                  onClick={() => navigate('/kpis')}
                  className="p-1 rounded hover:bg-surface-raised text-ink-muted hover:text-ink transition-colors"
                  title="View KPIs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-3.5">
                {kpiHealth.map((kpi) => (
                  <div key={kpi.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-ink flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: kpi.color }} />
                        {kpi.name}
                        <span className="text-ink-subtle">({kpi.weight}%)</span>
                      </span>
                      <span className="font-semibold text-ink">
                        {kpi.score}%{' '}
                        <span className={kpi.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          ({kpi.trend >= 0 ? `+${kpi.trend}` : kpi.trend}%)
                        </span>
                      </span>
                    </div>
                    <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden border border-border/50">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${kpi.score}%`, backgroundColor: kpi.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-ink-secondary"
                onClick={() => navigate('/kpis')}
                iconRight={<ArrowRight size={13} />}
              >
                Inspect All Scorecards & Weights
              </Button>
            </div>
          </div>
        </div>

        {/* Department Comparison & Top Talent Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Breakdown (1 col) */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Department Benchmark</h3>
                <p className="text-xs text-ink-muted">Overall performance by division</p>
              </div>
              <Badge variant="default">{departmentPerformance.length} Divisions</Badge>
            </div>

            <div className="space-y-4">
              {departmentPerformance.map((dept) => (
                <div key={dept.name} className="p-3 rounded-lg border border-border hover:bg-surface-raised transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-ink">{dept.name}</div>
                      <div className="text-xs text-ink-muted">{dept.employees} active team members</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-ink">{dept.score}%</div>
                      <div className={`text-xs ${dept.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {dept.change >= 0 ? `↑ +${dept.change}%` : `↓ ${dept.change}%`}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2.5">
                    <Progress value={dept.score} size="xs" color={dept.score >= 85 ? 'positive' : dept.score >= 75 ? 'accent' : 'warning'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers (1 col) */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Top Performers</h3>
                <p className="text-xs text-ink-muted">Leading contributors in Q3 FY26</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/employees')}
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {topPerformers.map((emp, i) => (
                <div
                  key={emp.id}
                  onClick={() => navigate('/employees')}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="avatar flex-shrink-0"
                      style={{
                        width: 34,
                        height: 34,
                        background: getAvatarColor(emp.name),
                        fontSize: 12,
                        color: 'white',
                      }}
                    >
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink flex items-center gap-1.5">
                        {emp.name}
                        {i === 0 && <Award size={13} className="text-amber-500" />}
                      </div>
                      <div className="text-xs text-ink-muted">{emp.title} · {emp.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-600">{emp.overallScore}%</div>
                    <RatingBadge score={emp.overallScore} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attention / Action Center (1 col) */}
          <div className="card p-5 border-rose-200/80 bg-rose-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-rose-100 text-rose-700">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">Support Needed</h3>
                    <p className="text-xs text-ink-muted">Employees below 75% threshold</p>
                  </div>
                </div>
                <Badge variant="critical">{attentionEmployees.length}</Badge>
              </div>

              <div className="space-y-3">
                {attentionEmployees.map((emp) => (
                  <div key={emp.id} className="p-3 bg-white rounded-lg border border-rose-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-ink">{emp.name}</span>
                      <span className="text-xs font-bold text-rose-600">{emp.overallScore}%</span>
                    </div>
                    <p className="text-xs text-ink-muted">{emp.title} · {emp.department}</p>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-ink-subtle">Goal completion: {emp.goalCompletion}%</span>
                      <button
                        onClick={() => navigate('/goals')}
                        className="text-amber-700 font-medium hover:underline"
                      >
                        Adjust Goals →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-200">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                icon={<Sparkles size={14} className="text-amber-500" />}
                onClick={() => navigate('/feedback')}
              >
                Initiate Performance Improvement Feedback
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Workflow Navigation Bar */}
        <div className="card p-4 bg-surface-raised flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-amber-500" />
            <div>
              <span className="text-sm font-semibold text-ink">Next recommended action:</span>
              <span className="text-xs text-ink-muted ml-2">Review pending self-assessments for Q3 FY26 cycle</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => navigate('/goals')}>Manage Goals</Button>
            <Button size="sm" variant="secondary" onClick={() => navigate('/feedback')}>360 Feedback</Button>
            <Button size="sm" variant="primary" onClick={() => navigate('/reviews')}>Open Review Matrix</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
