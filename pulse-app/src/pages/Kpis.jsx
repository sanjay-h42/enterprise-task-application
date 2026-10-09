// src/pages/Kpis.jsx
import { useState, useEffect } from 'react';
import {
  BarChart2,
  Plus,
  Edit2,
  Calculator,
  Percent,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Layers,
  Search,
  Filter,
  Sliders,
  Info,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge, { RatingBadge } from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Progress from '../components/ui/Progress';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { kpiApi } from '../api/kpiApi';
import { employeeApi } from '../api/employeeApi';
import { KPI_CATEGORIES, calculateWeightedScore } from '../data/kpiMock';
import { useToast } from '../context/ToastContext';
import { getAvatarColor, formatScore } from '../utils/cn';

export default function Kpis({ onMobileMenuOpen }) {
  const { success, error } = useToast();
  const [kpis, setKpis] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [search, setSearch] = useState('');

  // Edit KPI Modal
  const [editingKpi, setEditingKpi] = useState(null);
  const [editActual, setEditActual] = useState(0);
  const [editTarget, setEditTarget] = useState(0);
  const [editWeight, setEditWeight] = useState(0);
  const [saving, setSaving] = useState(false);

  // New KPI Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newKpi, setNewKpi] = useState({
    name: '',
    category: 'Productivity',
    employeeId: 1,
    target: 100,
    actual: 85,
    weight: 20,
    unit: '%',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [kpiRes, empRes] = await Promise.all([
        kpiApi.getAll(),
        employeeApi.getAll(),
      ]);
      setKpis(kpiRes || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      error('Failed to load KPI data');
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filteredKpis = kpis.filter((k) => {
    const matchesCategory = !selectedCategory || k.category === selectedCategory;
    const matchesEmp = !selectedEmployeeId || k.employeeId === Number(selectedEmployeeId);
    const matchesSearch =
      !search ||
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesEmp && matchesSearch;
  });

  // Calculate stats for current selection
  const totalKpis = filteredKpis.length;
  const avgAchievement =
    totalKpis > 0
      ? (filteredKpis.reduce((acc, k) => acc + (k.achievement || 0), 0) / totalKpis).toFixed(1)
      : 0;

  // Selected Employee Weighted Score Preview
  const activeEmpObj = selectedEmployeeId
    ? employees.find((e) => e.id === Number(selectedEmployeeId))
    : null;

  const empKpis = selectedEmployeeId
    ? kpis.filter((k) => k.employeeId === Number(selectedEmployeeId))
    : [];

  const empWeightedScore = empKpis.length > 0 ? calculateWeightedScore(empKpis) : null;

  // Open Edit KPI Modal
  const handleOpenEdit = (kpi) => {
    setEditingKpi(kpi);
    setEditActual(kpi.actual);
    setEditTarget(kpi.target);
    setEditWeight(kpi.weight);
  };

  // Save Edit KPI
  const handleSaveEdit = async () => {
    if (!editingKpi) return;
    setSaving(true);
    try {
      const achievement = Math.round((editActual / (editTarget || 1)) * 100);
      const updated = await kpiApi.update(editingKpi.id, {
        ...editingKpi,
        actual: Number(editActual),
        target: Number(editTarget),
        weight: Number(editWeight),
        achievement,
      });

      setKpis((prev) =>
        prev.map((k) =>
          k.id === editingKpi.id
            ? { ...k, actual: Number(editActual), target: Number(editTarget), weight: Number(editWeight), achievement }
            : k
        )
      );

      success(`Updated KPI "${editingKpi.name}"`);
      setEditingKpi(null);
    } catch (err) {
      error('Failed to update KPI');
    } finally {
      setSaving(false);
    }
  };

  // Create KPI
  const handleCreateKpi = async (e) => {
    e.preventDefault();
    if (!newKpi.name) {
      error('KPI name is required');
      return;
    }
    setCreating(true);
    try {
      const achievement = Math.round((Number(newKpi.actual) / (Number(newKpi.target) || 1)) * 100);
      const created = await kpiApi.create({
        ...newKpi,
        employeeId: Number(newKpi.employeeId),
        target: Number(newKpi.target),
        actual: Number(newKpi.actual),
        weight: Number(newKpi.weight),
        achievement,
      });

      setKpis((prev) => [created, ...prev]);
      success(`Created KPI "${newKpi.name}"`);
      setCreateModalOpen(false);
      setNewKpi({
        name: '',
        category: 'Productivity',
        employeeId: 1,
        target: 100,
        actual: 85,
        weight: 20,
        unit: '%',
        description: '',
      });
    } catch (err) {
      error('Failed to create KPI');
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageContainer
      title="KPI Scorecards & Weights"
      breadcrumb={['PULSE Enterprise', 'KPIs']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Header & New KPI */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">KPI Scorecards & Formulas</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Quantitative performance pillars, custom weight allocations, and real-time weighted index calculations.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Add New KPI Metric
          </Button>
        </div>

        {/* Formula Visualizer Box */}
        <div className="card p-5 bg-gradient-to-r from-amber-500/10 via-surface to-surface border-amber-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0 mt-0.5">
                <Calculator size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink flex items-center gap-2">
                  Weighted Score Algorithm:
                  <code className="px-2 py-0.5 bg-white border border-amber-200 rounded text-amber-700 text-xs font-mono">
                    Overall Score = Σ (Achievement % × Weight %)
                  </code>
                </h3>
                <p className="text-xs text-ink-muted mt-1 max-w-2xl">
                  Each employee's performance rating is systematically calculated from weighted KPI category achievement, ensuring objective, transparent evaluations.
                </p>
              </div>
            </div>

            {/* If employee selected, show live recalculated score */}
            {activeEmpObj && empWeightedScore !== null && (
              <div className="p-3 bg-white border border-amber-300 rounded-lg shadow-sm flex items-center gap-4 flex-shrink-0">
                <div
                  className="avatar"
                  style={{
                    width: 36,
                    height: 36,
                    background: getAvatarColor(activeEmpObj.name),
                    fontSize: 12,
                    color: 'white',
                  }}
                >
                  {activeEmpObj.avatar}
                </div>
                <div>
                  <div className="text-xs text-ink-muted font-medium">{activeEmpObj.name}'s Score</div>
                  <div className="text-xl font-bold text-ink flex items-center gap-2">
                    {formatScore(empWeightedScore)}%
                    <RatingBadge score={empWeightedScore} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-72 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search KPIs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface rounded-md border border-border focus:outline-none focus:border-amber-500 text-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Categories ({KPI_CATEGORIES.length})</option>
              {KPI_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Employee Filter */}
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Employees ({employees.length})</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
              ))}
            </select>

            {(search || selectedCategory || selectedEmployeeId) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                  setSelectedEmployeeId('');
                }}
                className="text-xs text-amber-600 hover:underline px-2 py-1 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* KPI Scorecards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredKpis.length === 0 ? (
          <EmptyState
            icon={BarChart2}
            title="No KPIs match criteria"
            description="Clear your category or employee filter to see more metrics."
            action={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedEmployeeId('');
                  setSearch('');
                }}
              >
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKpis.map((kpi) => {
              const assignedEmp = employees.find((e) => e.id === kpi.employeeId);
              const isExcellent = kpi.achievement >= 90;
              const isWarning = kpi.achievement < 70;

              return (
                <div
                  key={kpi.id}
                  className={`card p-5 card-hover border flex flex-col justify-between ${
                    isWarning ? 'border-rose-200 bg-rose-50/10' : 'border-border'
                  }`}
                >
                  <div>
                    {/* Category & Weight Top Bar */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-raised border border-border text-ink-secondary">
                        {kpi.category}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Weight: {kpi.weight}%
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-ink">{kpi.name}</h3>
                    <p className="text-xs text-ink-muted mt-1 line-clamp-2">{kpi.description}</p>

                    {/* Target vs Actual metric */}
                    <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-surface-raised rounded-lg border border-border text-xs">
                      <div>
                        <div className="text-ink-muted text-[10px] uppercase font-semibold">Target SLA</div>
                        <div className="text-sm font-bold text-ink mt-0.5">
                          {kpi.target}{kpi.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-ink-muted text-[10px] uppercase font-semibold">Actual Result</div>
                        <div className={`text-sm font-bold mt-0.5 ${isWarning ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {kpi.actual}{kpi.unit} ({kpi.achievement}%)
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <Progress
                        value={kpi.achievement}
                        size="xs"
                        color={isExcellent ? 'positive' : isWarning ? 'critical' : 'accent'}
                      />
                    </div>
                  </div>

                  {/* Card Footer: Assignee & Edit Button */}
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                    {assignedEmp ? (
                      <div className="flex items-center gap-1.5 text-ink-secondary">
                        <div
                          className="avatar"
                          style={{
                            width: 20,
                            height: 20,
                            background: getAvatarColor(assignedEmp.name),
                            fontSize: 8,
                            color: 'white',
                          }}
                        >
                          {assignedEmp.avatar}
                        </div>
                        <span className="font-medium truncate max-w-[120px]">{assignedEmp.name}</span>
                      </div>
                    ) : (
                      <span className="text-ink-muted">General KPI</span>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-ink-secondary hover:text-ink"
                      icon={<Edit2 size={12} />}
                      onClick={() => handleOpenEdit(kpi)}
                    >
                      Edit Actuals
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit KPI Modal */}
        {editingKpi && (
          <Modal
            isOpen={!!editingKpi}
            onClose={() => setEditingKpi(null)}
            title={`Edit KPI: ${editingKpi.name}`}
          >
            <div className="space-y-4">
              <p className="text-xs text-ink-muted">{editingKpi.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={`Target (${editingKpi.unit}) *`}
                  type="number"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                />
                <Input
                  label={`Actual Result (${editingKpi.unit}) *`}
                  type="number"
                  value={editActual}
                  onChange={(e) => setEditActual(e.target.value)}
                />
              </div>

              <div>
                <Input
                  label="Weight Allocation (%) *"
                  type="number"
                  min="1"
                  max="100"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                />
                <p className="text-[11px] text-ink-muted mt-1">
                  Weight represents the relative proportion of this KPI in the employee's overall score calculation.
                </p>
              </div>

              {/* Live Preview of Calculated Achievement */}
              <div className="p-3 bg-surface-raised rounded-lg border border-border text-xs flex items-center justify-between">
                <span>Calculated Achievement Rate:</span>
                <span className="font-bold text-sm text-ink">
                  {Math.round((Number(editActual) / (Number(editTarget) || 1)) * 100)}%
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => setEditingKpi(null)}>
                  Cancel
                </Button>
                <Button variant="primary" loading={saving} onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Create KPI Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Add New KPI Metric"
        >
          <form onSubmit={handleCreateKpi} className="space-y-4">
            <Input
              label="KPI Name *"
              placeholder="e.g. Code Review Pass Rate"
              value={newKpi.name}
              onChange={(e) => setNewKpi({ ...newKpi, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={newKpi.category}
                  onChange={(e) => setNewKpi({ ...newKpi, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  {KPI_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Assignee
                </label>
                <select
                  value={newKpi.employeeId}
                  onChange={(e) => setNewKpi({ ...newKpi, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Target *"
                type="number"
                value={newKpi.target}
                onChange={(e) => setNewKpi({ ...newKpi, target: e.target.value })}
                required
              />
              <Input
                label="Actual *"
                type="number"
                value={newKpi.actual}
                onChange={(e) => setNewKpi({ ...newKpi, actual: e.target.value })}
                required
              />
              <Input
                label="Weight (%) *"
                type="number"
                value={newKpi.weight}
                onChange={(e) => setNewKpi({ ...newKpi, weight: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Measurement methodology and SLA details..."
                value={newKpi.description}
                onChange={(e) => setNewKpi({ ...newKpi, description: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Create Metric
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
}
