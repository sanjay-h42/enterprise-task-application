// src/pages/Feedback.jsx
import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Star,
  ThumbsUp,
  TrendingUp,
  Sparkles,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Heart,
  Lightbulb,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { feedbackApi } from '../api/feedbackApi';
import { employeeApi } from '../api/employeeApi';
import { useToast } from '../context/ToastContext';
import { getAvatarColor } from '../utils/cn';

export default function Feedback({ onMobileMenuOpen }) {
  const { success, error } = useToast();
  const [feedbacks, setFeedbacks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [quarterFilter, setQuarterFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [search, setSearch] = useState('');

  // Give Feedback Modal
  const [giveModalOpen, setGiveModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    employeeId: 1,
    reviewerName: 'Sanjay Mehta',
    reviewerTitle: 'Engineering Manager',
    type: 'MANAGER',
    rating: 5,
    quarter: 'Q3 FY2026',
    summary: '',
    strengthsText: '',
    improvementsText: '',
    comments: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [fbRes, empRes] = await Promise.all([
        feedbackApi.getAll(),
        employeeApi.getAll(),
      ]);
      setFeedbacks(fbRes || []);
      setEmployees(empRes.data || []);
    } catch (err) {
      error('Failed to load feedback records');
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filteredFeedback = feedbacks.filter((f) => {
    const matchesType = !typeFilter || f.type === typeFilter;
    const matchesQuarter = !quarterFilter || f.quarter === quarterFilter;
    const matchesEmp = !employeeFilter || f.employeeId === Number(employeeFilter);
    const matchesSearch =
      !search ||
      f.summary.toLowerCase().includes(search.toLowerCase()) ||
      f.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
      (f.comments && f.comments.toLowerCase().includes(search.toLowerCase()));

    return matchesType && matchesQuarter && matchesEmp && matchesSearch;
  });

  // Calculate quick stats
  const totalCount = feedbacks.length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0) / totalCount).toFixed(1)
      : '0.0';
  const managerFeedbackCount = feedbacks.filter((f) => f.type === 'MANAGER').length;
  const peerFeedbackCount = feedbacks.filter((f) => f.type === 'PEER').length;

  // Handle Submit Feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newFeedback.summary) {
      error('Please provide a feedback summary');
      return;
    }
    setSubmitting(true);
    try {
      const strengths = newFeedback.strengthsText
        ? newFeedback.strengthsText.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Technical proficiency', 'Collaborative attitude'];
      const improvements = newFeedback.improvementsText
        ? newFeedback.improvementsText.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Continue mentoring juniors'];

      const created = await feedbackApi.create({
        ...newFeedback,
        employeeId: Number(newFeedback.employeeId),
        rating: Number(newFeedback.rating),
        strengths,
        improvements,
      });

      setFeedbacks((prev) => [created, ...prev]);
      success('360 feedback recorded successfully');
      setGiveModalOpen(false);
      setNewFeedback({
        employeeId: 1,
        reviewerName: 'Sanjay Mehta',
        reviewerTitle: 'Engineering Manager',
        type: 'MANAGER',
        rating: 5,
        quarter: 'Q3 FY2026',
        summary: '',
        strengthsText: '',
        improvementsText: '',
        comments: '',
      });
    } catch (err) {
      error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="360 Continuous Feedback"
      breadcrumb={['PULSE Enterprise', 'Feedback']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Header & Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">360° Continuous Feedback Stream</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Multi-perspective evaluations, peer commendations, constructive coaching, and development areas.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setGiveModalOpen(true)}
          >
            Give Continuous Feedback
          </Button>
        </div>

        {/* Feedback Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">Total Feedback Entries</div>
            <div className="text-2xl font-bold text-ink mt-1">{totalCount}</div>
            <div className="text-xs text-ink-subtle mt-1">Across all active quarters</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">Average 360 Score</div>
            <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
              <Star size={20} className="fill-amber-500 text-amber-500" />
              {avgRating} <span className="text-sm font-normal text-ink-muted">/ 5.0</span>
            </div>
            <div className="text-xs text-ink-subtle mt-1">High cultural alignment</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">Manager Appraisals</div>
            <div className="text-2xl font-bold text-sky-600 mt-1">{managerFeedbackCount}</div>
            <div className="text-xs text-ink-subtle mt-1">Formal leadership feedback</div>
          </div>
          <div className="card p-4">
            <div className="text-xs text-ink-muted font-medium">Peer & Team Reviews</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">{peerFeedbackCount}</div>
            <div className="text-xs text-ink-subtle mt-1">Cross-functional recognitions</div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-72 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search feedback comments or reviewers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface rounded-md border border-border focus:outline-none focus:border-amber-500 text-ink"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Review Types</option>
              <option value="MANAGER">Manager Reviews</option>
              <option value="PEER">Peer Reviews</option>
            </select>

            {/* Quarter Filter */}
            <select
              value={quarterFilter}
              onChange={(e) => setQuarterFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Cycles</option>
              <option value="Q3 FY2026">Q3 FY2026</option>
              <option value="Q2 FY2026">Q2 FY2026</option>
            </select>

            {/* Employee Recipient Filter */}
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-border text-ink-secondary focus:outline-none focus:border-amber-500"
            >
              <option value="">All Recipient Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>

            {(search || typeFilter || quarterFilter || employeeFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setTypeFilter('');
                  setQuarterFilter('');
                  setEmployeeFilter('');
                }}
                className="text-xs text-amber-600 hover:underline px-2 py-1 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Feedback Cards List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredFeedback.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No feedback records match"
            description="Adjust your filters or submit a new continuous feedback note."
            action={
              <Button size="sm" variant="primary" onClick={() => setGiveModalOpen(true)}>
                Give Feedback
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((item) => {
              const recipient = employees.find((e) => e.id === item.employeeId);

              return (
                <div key={item.id} className="card p-5 card-hover border border-border space-y-3">
                  {/* Top Bar: Reviewer, Recipient & Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div
                        className="avatar flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          background: getAvatarColor(item.reviewerName),
                          fontSize: 12,
                          color: 'white',
                        }}
                      >
                        {item.reviewerName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-ink">{item.reviewerName}</span>
                          <Badge variant={item.type === 'MANAGER' ? 'primary' : 'purple'} className="text-[10px]">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-ink-muted">
                          {item.reviewerTitle} → Recipient: <strong className="text-ink font-semibold">{recipient?.name || `Employee #${item.employeeId}`}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-ink-muted font-mono">{item.quarter || 'Q3 FY2026'} · {item.date}</span>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <p className="text-sm text-ink-secondary font-medium italic bg-surface-raised p-3 rounded-md border-l-4 border-amber-400">
                    "{item.summary}"
                  </p>

                  {/* Comments body if present */}
                  {item.comments && (
                    <p className="text-xs text-ink-secondary leading-relaxed">
                      {item.comments}
                    </p>
                  )}

                  {/* Strengths & Improvement Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {item.strengths && item.strengths.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                          <ThumbsUp size={11} /> Demonstrated Strengths
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.strengths.map((str, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-xs bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                              ✓ {str}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.improvements && item.improvements.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                          <Lightbulb size={11} /> Areas for Growth & Coaching
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.improvements.map((imp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200"
                            >
                              ↗ {imp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Give Feedback Modal */}
        <Modal
          isOpen={giveModalOpen}
          onClose={() => setGiveModalOpen(false)}
          title="Provide 360 Continuous Feedback"
          size="lg"
        >
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Recipient Employee *
                </label>
                <select
                  value={newFeedback.employeeId}
                  onChange={(e) => setNewFeedback({ ...newFeedback, employeeId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Feedback Relationship *
                </label>
                <select
                  value={newFeedback.type}
                  onChange={(e) => setNewFeedback({ ...newFeedback, type: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
                >
                  <option value="MANAGER">Manager Review</option>
                  <option value="PEER">Peer / Colleague Review</option>
                </select>
              </div>
            </div>

            {/* Rating Stars Selector */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Performance Rating (1 to 5 Stars) *
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-raised rounded-md border border-border">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      className={star <= newFeedback.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}
                    />
                  </button>
                ))}
                <span className="text-sm font-bold text-ink ml-3">
                  {newFeedback.rating === 5 ? '5.0 - Exceptional' : newFeedback.rating === 4 ? '4.0 - Strong Performer' : newFeedback.rating === 3 ? '3.0 - Meets Expectations' : 'Needs Support'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Executive Feedback Summary *
              </label>
              <textarea
                rows={2}
                placeholder="High-level evaluation or commendation summary..."
                value={newFeedback.summary}
                onChange={(e) => setNewFeedback({ ...newFeedback, summary: e.target.value })}
                required
                className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
              />
            </div>

            <Input
              label="Key Strengths (Comma-separated tags)"
              placeholder="e.g. Rapid execution, Mentorship, System architecture"
              value={newFeedback.strengthsText}
              onChange={(e) => setNewFeedback({ ...newFeedback, strengthsText: e.target.value })}
            />

            <Input
              label="Areas for Growth (Comma-separated tags)"
              placeholder="e.g. Cross-team documentation, Delegation"
              value={newFeedback.improvementsText}
              onChange={(e) => setNewFeedback({ ...newFeedback, improvementsText: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Detailed Comments & Actionable Coaching
              </label>
              <textarea
                rows={3}
                placeholder="Specific examples, milestone achievements, or development recommendations..."
                value={newFeedback.comments}
                onChange={(e) => setNewFeedback({ ...newFeedback, comments: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface rounded-md border border-border text-ink focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button type="button" variant="secondary" onClick={() => setGiveModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Record Feedback
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </PageContainer>
  );
}
