// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart as PieIcon,
  Download,
  Calendar,
  Layers,
  Award,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import Skeleton from '../components/ui/Skeleton';
import { analyticsApi } from '../api/analyticsApi';
import { useToast } from '../context/ToastContext';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#10B981', '#0EA5E9', '#8B5CF6', '#F59E0B', '#EF4444'];

export default function Analytics({ onMobileMenuOpen }) {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState([]);
  const [kpiCategoryData, setKpiCategoryData] = useState([]);
  const [goalTrendData, setGoalTrendData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [deptBreakdownData, setDeptBreakdownData] = useState([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [trend, kpiCat, goalTrend, dist, dept] = await Promise.all([
          analyticsApi.getPerformanceTrend(),
          analyticsApi.getKpiCategoryComparison(),
          analyticsApi.getGoalCompletion(),
          analyticsApi.getPerformanceDistribution(),
          analyticsApi.getDepartmentBreakdown(),
        ]);
        setTrendData(trend || []);
        setKpiCategoryData(kpiCat || []);
        setGoalTrendData(goalTrend || []);
        setDistributionData(dist || []);
        setDeptBreakdownData(dept || []);
      } catch (err) {
        error('Failed to load analytics datasets');
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const handleExport = (format) => {
    success(`Generated ${format} executive analytics report`);
  };

  if (loading) {
    return (
      <PageContainer title="Analytics & Insights" breadcrumb={['PULSE Enterprise', 'Analytics']} onMobileMenuOpen={onMobileMenuOpen}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Enterprise Analytics & BI"
      breadcrumb={['PULSE Enterprise', 'Analytics']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Top Header & Export Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Performance Analytics & Intelligence</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Multi-dimensional longitudinal performance trends, department benchmarks, and KPI distributions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<FileSpreadsheet size={14} className="text-emerald-600" />}
              onClick={() => handleExport('CSV')}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => handleExport('PDF')}
            >
              Export Executive Deck
            </Button>
          </div>
        </div>

        {/* Top 2 Charts: Department Longitudinal Trend + Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Performance Trend Line (2 cols) */}
          <div className="card p-5 lg:col-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Department Performance Trajectory</h3>
                <p className="text-xs text-ink-muted">Historical scores by division across 7 quarters</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="period" tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7E5E4' }} />
                  <YAxis domain={[60, 100]} tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(val) => [`${val}%`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Area type="monotone" dataKey="engineering" name="Engineering" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="product" name="Product" stroke="#0EA5E9" fill="#0EA5E9" fillOpacity={0.05} strokeWidth={2} />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.05} strokeWidth={2} />
                  <Area type="monotone" dataKey="operations" name="Operations" stroke="#10B981" fill="#10B981" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Performance Distribution Donut/Bar (1 col) */}
          <div className="card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-ink">Talent Tier Distribution</h3>
                <Badge variant="default">Q3 FY26</Badge>
              </div>
              <p className="text-xs text-ink-muted mb-4">Percentage of workforce in each rating band</p>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      dataKey="percentage"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, color: '#fff', fontSize: 11 }}
                      formatter={(val, name) => [`${val}% (${distributionData.find(d => d.label === name)?.count} people)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="space-y-1.5 mt-2">
                {distributionData.map((d, i) => (
                  <div key={d.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-ink-secondary">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="truncate max-w-[180px]">{d.label}</span>
                    </span>
                    <span className="font-bold text-ink">{d.percentage}% ({d.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 2 Charts: KPI Pillar Benchmark + Goal Completion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KPI Pillar Average Scores */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-ink">KPI Category Benchmark</h3>
                <p className="text-xs text-ink-muted">Organization-wide average score by pillar</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="category" tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7E5E4' }} />
                  <YAxis domain={[60, 100]} tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(val) => [`${val}%`, 'Average Achievement']}
                  />
                  <Bar dataKey="score" fill="#F59E0B" radius={[4, 4, 0, 0]}>
                    {kpiCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 88 ? '#10B981' : entry.score >= 80 ? '#F59E0B' : '#0EA5E9'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Goal Completion Velocity */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-ink">Strategic Goal Velocity</h3>
                <p className="text-xs text-ink-muted">Target vs actual delivery across quarters</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="period" tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#E7E5E4' }} />
                  <YAxis domain={[50, 100]} tick={{ fill: '#78716C', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, color: '#fff', fontSize: 12 }}
                    formatter={(val) => [`${val}%`]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="completion" name="Delivered Completion" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Objective" fill="#E7E5E4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Department KPI Matrix Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold text-ink">Department Pillar Breakdown Matrix</h3>
            <p className="text-xs text-ink-muted">Detailed score breakdown across all quantitative KPI categories</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-secondary">
              <thead className="bg-surface-raised border-b border-border text-ink-muted uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Division</th>
                  <th className="px-4 py-3 text-center">Productivity</th>
                  <th className="px-4 py-3 text-center">Quality</th>
                  <th className="px-4 py-3 text-center">Attendance</th>
                  <th className="px-4 py-3 text-center">Goal Achievement</th>
                  <th className="px-4 py-3 text-center">Collaboration</th>
                  <th className="px-4 py-3 text-right">Composite Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deptBreakdownData.map((d) => (
                  <tr key={d.department} className="hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3 font-bold text-ink">{d.department}</td>
                    <td className="px-4 py-3 text-center">{d.kpis.productivity}%</td>
                    <td className="px-4 py-3 text-center">{d.kpis.quality}%</td>
                    <td className="px-4 py-3 text-center">{d.kpis.attendance}%</td>
                    <td className="px-4 py-3 text-center">{d.kpis.goalAchievement}%</td>
                    <td className="px-4 py-3 text-center">{d.kpis.collaboration}%</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-sm text-ink">{d.overall}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
