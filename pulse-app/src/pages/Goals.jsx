// src/pages/Goals.jsx
import { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Link as LinkIcon,
  Sliders,
  Filter,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge, { StatusBadge } from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Progress from '../components/ui/Progress';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { goalApi } from '../api/goalApi';
import { employeeApi } from '../api/employeeApi';
import { kpiApi } from '../api/kpiApi';
import { useToast } from '../context/ToastContext';
import { getAvatarColor } from '../utils/cn';

export default function Goals({ onMobileMenuOpen }) {
  const { success, error } = useToast();
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updateModalGoal, setUpdateModalGoal] = useState(null);
  const [newProgress, setNewProgress] = useState(0);

  // New Goal Form State
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    employeeId: 1,
    department: 'Engineering',
    priority: 'HIGH',
    target: 100,
    unit: '%',
    deadline: '2026-09-30',
    linkedKpiId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [goalsRes, empRes, kpiRes] = await Promise.all([
        goalApi.getAll(),
        employeeApi.getAll(),
        kpiApi.getAll(),
      ]);
      setGoals(goalsRes || []);
      setEmployees(empRes.data || []);
      setKpis(kpiRes || []);
    } catch (err) {
      error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filteredGoals = goals.filter((g) => {
    const matchesSearch =
      !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || g.status === statusFilter;
    const matchesPriority = !priorityFilter || g.priority === priorityFilter;
    const matchesDept = !deptFilter || g.department === deptFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDept;
  });

  // Calculate goal stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length;
  const onTrackGoals = goals.filter((g) => g.status === 'ON_TRACK' || g.status === 'IN_PROGRESS').length;
  const atRiskGoals = goals.filter((g) => g.status === 'AT_RISK' || g.status === 'BEHIND').length;
  const avgCompletion = totalGoals > 0 ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / totalGoals) : 0;

  // Handle Create Goal
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title) {
      error('Goal title is required');
      return;
    }
    setCreating(true);
    try {
      const emp = employees.find(e => e.id === Number(newGoal.employeeId));
      const linkedKpi = kpis.find(k => k.id === Number(newGoal.linkedKpiId));

      const created = await goalApi.create({
        ...newGoal,
        employeeId: Number(newGoal.employeeId),
        department: emp?.department || newGoal.department,
        linkedKpiName: linkedKpi?.name || '',
        linkedKpiTarget: linkedKpi?.target || null,
        linkedKpiCurrent: linkedKpi?.actual || null,
        progress: 0,
        actual: 0,
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString().split('T')[0],
      });

      setGoals(prev => [created, ...prev]);
      success('Goal created and assigned successfully');
      setCreateModalOpen(false);
      setNewGoal({
        title: '',
        description: '',
        employeeId: 1,
        department: 'Engineering',
        priority: 'HIGH',
        target: 100,
        unit: '%',
        deadline: '2026-09-30',
        linkedKpiId: '',
      });
    } catch (err) {
      error('Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  // Handle Update Progress
  const handleUpdateProgress = async () => {
    if (!updateModalGoal) return;
    try {
      const updatedStatus = newProgress >= 100 ? 'COMPLETED' : newProgress < 60 ? 'AT_RISK' : 'ON_TRACK';
      const updated = await goalApi.update(updateModalGoal.id, {
        progress: newProgress,
        actual: newProgress,
        status: updatedStatus,
      });

      setGoals(prev => prev.map(g => (g.id === updateModalGoal.id ? { ...g, progress: newProgress, actual: newProgress, status: updatedStatus } : g)));
      success(`Updated goal progress to ${newProgress}%`);
      setUpdateModalGoal(null);
    } catch (err) {
      error('Failed to update goal');
    }
  };

  return (
    <PageContainer
      title="Strategic Goals & OKRs"
      breadcrumb={['PULSE Enterprise', 'Goals']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Header & New Goal Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Goals & OKRs Management</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Align team objectives with corporate strategy and map direct impact to KPI scorecards.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New Goal
          </Button>
        </div>

        {/* Goal Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">Average Progress</div>
            <div className="text-2xl font-bold text-ink mt-1">{avgCompletion}%</div>
            <div className="mt-2">
              <Progress value={avgCompletion} size="xs" color="accent" />
            </div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">Completed Goals</div>
            <div className="text-2xl font-bold text-emerald-600 mt-1">{completedGoals}</div>
            <div className="text-xs text-ink-subtle mt-1">{Math.round((completedGoals / (totalGoals || 1)) * 100)}% of total goals</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">On Track / In Progress</div>
            <div className="text-2xl font-bold text-sky-600 mt-1">{onTrackGoals}</div>
            <div className="text-xs text-ink-subtle mt-1">Active delivery cycles</div>
          </div>
          <div className="card p-4 border-rose-200 bg-rose-50/20">
            <div className="text-xs text-rose-700 font-medium">At Risk / Attention Needed</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{atRiskGoals}</div>
            <div className="text-xs text-rose-600/80 mt-1">Requires manager review</div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search goals by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface rounded-md border border-border focus:outline-none focus:border-amber-500 text-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Statuses</option>
              <option value="ON_TRACK">On Track</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="AT_RISK">At Risk</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>

            {/* Department Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>

            {(search || statusFilter || priorityFilter || deptFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPriorityFilter('');
                  setDeptFilter('');
                }}
                className="text-xs text-amber-600 hover:underline px-2 py-1 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Goals List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredGoals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No goals found"
            description="Adjust your search filters or create a new strategic goal."
            action={
              <Button size="sm" variant="primary" onClick={() => setCreateModalOpen(true)}>
                Create New Goal
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredGoals.map((goal) => {
              const assignedEmp = employees.find(e => e.id === goal.employeeId);
              return (
                <div
                  key={goal.id}
                  className="card p-5 card-hover border border-border hover:border-amber-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <StatusBadge status={goal.status} />
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        goal.priority === 'HIGH'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : goal.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}>
                        {goal.priority} Priority
                      </span>
                      <span className="text-xs text-ink-muted">· {goal.department}</span>
                    </div>

                    <h3 className="text-base font-bold text-ink">{goal.title}</h3>
                    <p className="text-xs text-ink-muted mt-1 line-clamp-2 max-w-2xl">{goal.description}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-ink-secondary">
                      {assignedEmp && (
                        <div className="flex items-center gap-2">
                          <div
                            className="avatar"
                            style={{
                              width: 22,
                              height: 22,
                              background: getAvatarColor(assignedEmp.name),
                              fontSize: 9,
                              color: 'white',
                            }}
                          >
                            {assignedEmp.avatar}
                          </div>
                          <span>{assignedEmp.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-ink-muted">
                        <Calendar size={13} />
                        <span>Due: {goal.deadline}</span>
                      </div>

                      {goal.linkedKpiName && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                          <LinkIcon size={11} />
                          <span>Linked KPI: {goal.linkedKpiName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress & Quick Action */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 w-full md:w-60 border-t md:border-t-0 pt-3 md:pt-0 border-border">
                    <div className="w-full">
                      <div className="flex items-center justify-between text-xs font-semibold text-ink mb-1.5">
                        <span>Progress</span>
                        <span className="text-sm font-bold">{goal.progress}%</span>
                      </div>
                      <Progress
                        value={goal.progress}
                        size="sm"
                        color={goal.progress >= 85 ? 'positive' : goal.progress >= 60 ? 'accent' : 'warning'}
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs flex-shrink-0"
                      icon={<Sliders size={13} />}
                      onClick={() => {
                        setUpdateModalGoal(goal);
                        setNewProgress(goal.progress || 0);
                      }}
                    >
                      Update Progress
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Update Progress Modal */}
        {updateModalGoal && (
          <Modal
            isOpen={!!updateModalGoal}
            onClose={() => setUpdateModalGoal(null)}
            title={`Update Progress: ${updateModalGoal.title}`}
          >
            <div className="space-y-5">
              <p className="text-xs text-ink-muted">{updateModalGoal.description}</p>

              <div>
                <div className="flex items-center justify-between text-sm font-bold text-ink mb-2">
                  <span>Current Completion Percentage</span>
                  <span className="text-xl text-amber-600">{newProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-ink-muted mt-1 font-mono">
                  <span>0% (Not started)</span>
                  <span>50% (In Progress)</span>
                  <span>100% (Completed)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => setUpdateModalGoal(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateProgress}>
                  Save Progress
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Create Goal Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create Strategic Goal"
          size="lg"
        >
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <Input
              label="Goal Title *"
              placeholder="e.g. Optimize Cloud Infrastructure Costs by 25%"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Description & Success Criteria
              </label>
              <textarea
                rows={3}
                placeholder="Outline specific milestones, deliverables, and measurable outcomes..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Assignee
                </label>
                <select
                  value={newGoal.employeeId}
                  onChange={(e) => setNewGoal({ ...newGoal, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Priority
                </label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Deadline *"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Link to KPI Scorecard
                </label>
                <select
                  value={newGoal.linkedKpiId}
                  onChange={(e) => setNewGoal({ ...newGoal, linkedKpiId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  <option value="">None (Standalone Goal)</option>
                  {kpis.map((kpi) => (
                    <option key={kpi.id} value={kpi.id}>
                      {kpi.name} ({kpi.category}) - Target: {kpi.target}{kpi.unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Save Goal
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
}
