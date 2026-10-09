// src/pages/Employees.jsx
import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart2,
  MessageSquare,
  Mail,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Briefcase,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge, { RatingBadge, StatusBadge } from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Progress from '../components/ui/Progress';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { employeeApi, departmentApi } from '../api/employeeApi';
import { kpiApi } from '../api/kpiApi';
import { goalApi } from '../api/goalApi';
import { feedbackApi } from '../api/feedbackApi';
import { useToast } from '../context/ToastContext';
import { getAvatarColor, formatScore } from '../utils/cn';

export default function Employees({ onMobileMenuOpen }) {
  const { success, error } = useToast();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & View state
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedPerf, setSelectedPerf] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Drawer / Details Modal state
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [empDetails, setEmpDetails] = useState({ kpis: [], goals: [], feedback: [], loading: false });

  // Add Employee Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    title: '',
    department: 'Engineering',
    departmentId: 1,
  });

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        employeeApi.getAll(),
        departmentApi.getAll(),
      ]);
      setEmployees(empRes.data || []);
      setDepartments(deptRes || []);
    } catch (err) {
      error('Failed to load employee directory');
    } finally {
      setLoading(false);
    }
  }

  // Open employee detail drawer and fetch their KPIs, goals, and feedback
  const handleSelectEmployee = async (emp) => {
    setSelectedEmp(emp);
    setEmpDetails({ kpis: [], goals: [], feedback: [], loading: true });
    try {
      const [kpiData, goalData, fbData] = await Promise.all([
        kpiApi.getByEmployee(emp.id),
        goalApi.getAll({ employeeId: emp.id }),
        feedbackApi.getAll({ employeeId: emp.id }),
      ]);
      setEmpDetails({
        kpis: kpiData.kpis || [],
        goals: goalData || [],
        feedback: fbData || [],
        loading: false,
      });
    } catch (err) {
      console.error('Error fetching employee details:', err);
      setEmpDetails(prev => ({ ...prev, loading: false }));
    }
  };

  // Filtered employees list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.title.toLowerCase().includes(search.toLowerCase());

    const matchesDept = !selectedDept || emp.department === selectedDept;

    let matchesPerf = true;
    if (selectedPerf === 'EXCELLENT') matchesPerf = emp.overallScore >= 90;
    else if (selectedPerf === 'VERY_GOOD') matchesPerf = emp.overallScore >= 80 && emp.overallScore < 90;
    else if (selectedPerf === 'GOOD') matchesPerf = emp.overallScore >= 70 && emp.overallScore < 80;
    else if (selectedPerf === 'NEEDS_IMPROVEMENT') matchesPerf = emp.overallScore < 70;

    return matchesSearch && matchesDept && matchesPerf;
  });

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.title) {
      error('Please fill in all required fields');
      return;
    }
    setCreating(true);
    try {
      const deptObj = departments.find(d => d.name === newEmployee.department) || departments[0];
      const created = await employeeApi.create({
        ...newEmployee,
        departmentId: deptObj?.id || 1,
        status: 'ACTIVE',
        overallScore: 82.5,
        previousScore: 80.0,
        trend: 2.5,
        rating: 'VERY_GOOD',
        goalCompletion: 75,
        feedbackRating: 4.2,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: newEmployee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      });
      setEmployees(prev => [created, ...prev]);
      success(`Added employee ${newEmployee.name} successfully`);
      setAddModalOpen(false);
      setNewEmployee({ name: '', email: '', title: '', department: 'Engineering', departmentId: 1 });
    } catch (err) {
      error('Failed to create employee');
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageContainer
      title="People & Talent"
      breadcrumb={['PULSE Enterprise', 'People']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Header summary & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Employee Directory</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Manage organization workforce, performance tiers, KPI alignment, and feedback records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-raised border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                }`}
                title="Table view"
              >
                <List size={14} />
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Employee
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, role, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface rounded-md border border-border focus:outline-none focus:border-amber-500 text-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Department selector */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name} ({d.headcount})</option>
              ))}
            </select>

            {/* Performance Tier Selector */}
            <select
              value={selectedPerf}
              onChange={(e) => setSelectedPerf(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Performance Tiers</option>
              <option value="EXCELLENT">Excellent (90%+)</option>
              <option value="VERY_GOOD">Very Good (80–89%)</option>
              <option value="GOOD">Good (70–79%)</option>
              <option value="NEEDS_IMPROVEMENT">Needs Attention (&lt;70%)</option>
            </select>

            {(search || selectedDept || selectedPerf) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedDept('');
                  setSelectedPerf('');
                }}
                className="text-xs text-amber-600 hover:underline px-2 py-1 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Directory Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No matching employees found"
            description="Try changing your search keywords or filter criteria."
            action={
              <Button size="sm" variant="secondary" onClick={() => { setSearch(''); setSelectedDept(''); setSelectedPerf(''); }}>
                Clear Filters
              </Button>
            }
          />
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => handleSelectEmployee(emp)}
                className="card p-5 card-hover cursor-pointer border border-border hover:border-amber-400 flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="avatar flex-shrink-0"
                        style={{
                          width: 40,
                          height: 40,
                          background: getAvatarColor(emp.name),
                          fontSize: 13,
                          color: 'white',
                        }}
                      >
                        {emp.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-ink hover:text-amber-600 transition-colors">
                          {emp.name}
                        </h3>
                        <p className="text-xs text-ink-muted">{emp.title}</p>
                      </div>
                    </div>
                    <RatingBadge score={emp.overallScore} />
                  </div>

                  {/* Meta tags */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60 text-xs text-ink-secondary">
                    <span className="px-2 py-0.5 rounded bg-surface-raised border border-border">
                      {emp.department}
                    </span>
                    <span className="text-ink-subtle">{emp.employeeId}</span>
                  </div>

                  {/* Key Metrics row */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/60 text-center">
                    <div>
                      <div className="text-xs text-ink-muted">Overall KPI</div>
                      <div className="text-sm font-bold text-ink mt-0.5">{emp.overallScore}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-muted">Goals</div>
                      <div className="text-sm font-bold text-ink mt-0.5">{emp.goalCompletion}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-ink-muted">Feedback</div>
                      <div className="text-sm font-bold text-amber-600 mt-0.5">{emp.feedbackRating} / 5</div>
                    </div>
                  </div>

                  {/* Mini Progress */}
                  <div className="mt-3">
                    <Progress value={emp.overallScore} size="xs" color={emp.overallScore >= 85 ? 'positive' : emp.overallScore >= 70 ? 'accent' : 'warning'} />
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-amber-600 font-medium">
                  <span>View performance dossier</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink-secondary">
                <thead className="bg-surface-raised border-b border-border text-ink-muted uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3 text-center">Overall Score</th>
                    <th className="px-4 py-3 text-center">Rating</th>
                    <th className="px-4 py-3 text-center">Goal Progress</th>
                    <th className="px-4 py-3 text-center">360 Feedback</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => handleSelectEmployee(emp)}
                      className="hover:bg-amber-50/20 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="avatar flex-shrink-0"
                            style={{
                              width: 32,
                              height: 32,
                              background: getAvatarColor(emp.name),
                              fontSize: 11,
                              color: 'white',
                            }}
                          >
                            {emp.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-ink text-sm">{emp.name}</div>
                            <div className="text-xs text-ink-muted">{emp.title} · {emp.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{emp.department}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-sm text-ink">{emp.overallScore}%</span>
                        <div className="w-16 mx-auto mt-1">
                          <Progress value={emp.overallScore} size="xs" color={emp.overallScore >= 85 ? 'positive' : 'accent'} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RatingBadge score={emp.overallScore} />
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-ink">
                        {emp.goalCompletion}%
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-amber-600">
                        ★ {emp.feedbackRating}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700">
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employee Performance Dossier Modal */}
        {selectedEmp && (
          <Modal
            isOpen={!!selectedEmp}
            onClose={() => setSelectedEmp(null)}
            title={`Performance Dossier: ${selectedEmp.name}`}
            size="xl"
          >
            <div className="space-y-6">
              {/* Top Banner Profile */}
              <div className="p-4 bg-surface-raised rounded-lg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="avatar flex-shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      background: getAvatarColor(selectedEmp.name),
                      fontSize: 18,
                      color: 'white',
                    }}
                  >
                    {selectedEmp.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-ink">{selectedEmp.name}</h3>
                      <span className="text-xs font-mono text-ink-muted">({selectedEmp.employeeId})</span>
                    </div>
                    <p className="text-xs text-ink-secondary">{selectedEmp.title} · {selectedEmp.department}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{selectedEmp.email} · Joined {selectedEmp.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs text-ink-muted">Overall Performance</div>
                    <div className="text-2xl font-bold text-ink">{selectedEmp.overallScore}%</div>
                  </div>
                  <RatingBadge score={selectedEmp.overallScore} />
                </div>
              </div>

              {/* Breakdown Tabs / Sections */}
              {empDetails.loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* KPIs Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                        <BarChart2 size={16} className="text-amber-500" />
                        Key Performance Indicators ({empDetails.kpis.length})
                      </h4>
                      <span className="text-xs text-ink-muted">Weighted calculation active</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {empDetails.kpis.map((kpi) => (
                        <div key={kpi.id} className="p-3 bg-white border border-border rounded-lg shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-ink">{kpi.name}</span>
                            <Badge variant="default" className="text-[10px]">Weight: {kpi.weight}%</Badge>
                          </div>
                          <p className="text-[11px] text-ink-muted mt-0.5">{kpi.description}</p>
                          <div className="mt-3 flex items-center justify-between text-xs">
                            <span className="text-ink-secondary">Target: {kpi.target}{kpi.unit}</span>
                            <span className="font-bold text-ink">Actual: {kpi.actual}{kpi.unit} ({kpi.achievement}%)</span>
                          </div>
                          <div className="mt-1.5">
                            <Progress value={kpi.achievement} size="xs" color={kpi.achievement >= 85 ? 'positive' : kpi.achievement >= 70 ? 'accent' : 'warning'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Goals Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-ink flex items-center gap-2">
                        <Target size={16} className="text-blue-500" />
                        Assigned Strategic Goals ({empDetails.goals.length})
                      </h4>
                    </div>

                    <div className="space-y-2.5">
                      {empDetails.goals.map((goal) => (
                        <div key={goal.id} className="p-3 bg-white border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-ink">{goal.title}</span>
                              <StatusBadge status={goal.status} />
                            </div>
                            <p className="text-[11px] text-ink-muted mt-0.5">{goal.description}</p>
                          </div>
                          <div className="w-full sm:w-36 text-right">
                            <div className="text-xs font-bold text-ink mb-1">{goal.progress}% Complete</div>
                            <Progress value={goal.progress} size="xs" color={goal.progress >= 80 ? 'positive' : 'accent'} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 360 Feedback Summary */}
                  <div>
                    <h4 className="text-sm font-bold text-ink flex items-center gap-2 mb-3">
                      <MessageSquare size={16} className="text-purple-500" />
                      Recent 360 Feedback ({empDetails.feedback.length})
                    </h4>

                    <div className="space-y-3">
                      {empDetails.feedback.map((fb) => (
                        <div key={fb.id} className="p-3 bg-white border border-border rounded-lg shadow-sm">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-ink">{fb.reviewerName}</span>
                              <Badge variant={fb.type === 'MANAGER' ? 'primary' : 'info'} className="text-[10px]">
                                {fb.type} REVIEW
                              </Badge>
                            </div>
                            <span className="text-xs font-bold text-amber-600">★ {fb.rating} / 5</span>
                          </div>
                          <p className="text-xs text-ink-secondary italic">"{fb.summary}"</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {fb.strengths?.map((str, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ✓ {str}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal footer */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="secondary" onClick={() => setSelectedEmp(null)}>Close</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Employee Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add New Employee"
        >
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Meera Ramanathan"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              required
            />
            <Input
              label="Corporate Email *"
              type="email"
              placeholder="e.g. meera.r@acme.io"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              required
            />
            <Input
              label="Job Title / Role *"
              placeholder="e.g. Senior Product Designer"
              value={newEmployee.title}
              onChange={(e) => setNewEmployee({ ...newEmployee, title: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Department
              </label>
              <select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={creating}>
                Save Employee
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
}
