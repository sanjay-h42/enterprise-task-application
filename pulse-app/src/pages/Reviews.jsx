// src/pages/Reviews.jsx
import { useState, useEffect } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Calendar,
  Award,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  Send,
  AlertCircle,
  BarChart2,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import Badge, { RatingBadge, StatusBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Progress from '../components/ui/Progress';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { reviewApi } from '../api/reviewApi';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { getAvatarColor, formatScore } from '../utils/cn';

export default function Reviews({ onMobileMenuOpen }) {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [cycles, setCycles] = useState([]);
  const [selectedCycleId, setSelectedCycleId] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Details Modal
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadCycles() {
      try {
        setLoading(true);
        const cycleList = await reviewApi.getCycles();
        setCycles(cycleList || []);
        if (cycleList && cycleList.length > 0) {
          setSelectedCycleId(cycleList[0].id);
          const reviewList = await reviewApi.getReviews({ cycleId: cycleList[0].id });
          setReviews(reviewList || []);
        }
      } catch (err) {
        error('Failed to load review cycles');
      } finally {
        setLoading(false);
      }
    }
    loadCycles();
  }, []);

  const handleCycleChange = async (cycleId) => {
    setSelectedCycleId(Number(cycleId));
    try {
      setLoading(true);
      const reviewList = await reviewApi.getReviews({ cycleId: Number(cycleId) });
      setReviews(reviewList || []);
    } catch (err) {
      error('Failed to load reviews for cycle');
    } finally {
      setLoading(false);
    }
  };

  const currentCycle = cycles.find((c) => c.id === selectedCycleId) || cycles[0];

  // Handle Approve Review
  const handleApprove = async (reviewId) => {
    setActionLoading(true);
    try {
      await reviewApi.approve(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: 'APPROVED' } : r))
      );
      if (selectedReview?.id === reviewId) {
        setSelectedReview((prev) => ({ ...prev, status: 'APPROVED' }));
      }
      success('Performance review approved and signed off');
    } catch (err) {
      error('Failed to approve review');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Submit Review
  const handleSubmit = async (reviewId) => {
    setActionLoading(true);
    try {
      await reviewApi.submit(reviewId);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: 'SUBMITTED' } : r))
      );
      if (selectedReview?.id === reviewId) {
        setSelectedReview((prev) => ({ ...prev, status: 'SUBMITTED' }));
      }
      success('Review submitted for executive sign-off');
    } catch (err) {
      error('Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageContainer
      title="Performance Reviews"
      breadcrumb={['PULSE Enterprise', 'Reviews']}
      onMobileMenuOpen={onMobileMenuOpen}
    >
      <div className="space-y-6">
        {/* Header & Cycle Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Performance Appraisals & Cycles</h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Formal review workflows, multi-source score synthesis, executive calibration, and approvals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink-muted uppercase">Active Cycle:</span>
            <select
              value={selectedCycleId}
              onChange={(e) => handleCycleChange(e.target.value)}
              className="px-3 py-1.5 text-xs bg-surface rounded-md border border-amber-300 font-semibold text-ink focus:outline-none focus:border-amber-500 shadow-sm"
            >
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cycle Overview Banner */}
        {currentCycle && (
          <div className="card p-5 border-amber-200 bg-gradient-to-r from-amber-500/10 to-surface">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={currentCycle.status === 'ACTIVE' ? 'primary' : 'success'}>
                    {currentCycle.status} CYCLE
                  </Badge>
                  <span className="text-xs text-ink-muted">
                    {currentCycle.startDate} to {currentCycle.endDate}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink">{currentCycle.name}</h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Synthesizing Quantitative KPIs (50%), Strategic Goals (30%), and 360 Continuous Feedback (20%).
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-ink-muted">Cycle Completion</div>
                  <div className="text-xl font-bold text-ink">{currentCycle.progress}%</div>
                </div>
                <div className="w-36">
                  <Progress value={currentCycle.progress} size="sm" color="accent" />
                </div>
                <div className="text-right border-l border-border pl-4">
                  <div className="text-xs text-ink-muted">Finalized</div>
                  <div className="text-sm font-bold text-emerald-600">
                    {currentCycle.completed} / {currentCycle.total}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9-Box / Performance Synthesis Quadrants */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-ink">Talent Calibration Matrix</h3>
              <p className="text-xs text-ink-muted">Synthesis of Employee KPIs vs Goal Execution Delivery</p>
            </div>
            <Badge variant="default">Distribution Overview</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Top Tier (90%+)</span>
                <span className="badge badge-excellent text-[10px]">High Impact</span>
              </div>
              <p className="text-xs text-emerald-900/80 mb-3">Exceeds KPI targets with outstanding leadership.</p>
              <div className="text-sm font-bold text-emerald-700">Ananya S., Rahul K.</div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Core Contributors (75–89%)</span>
                <span className="badge badge-verygood text-[10px]">Solid Delivery</span>
              </div>
              <p className="text-xs text-amber-900/80 mb-3">Reliable performance aligned with quarterly OKRs.</p>
              <div className="text-sm font-bold text-amber-700">Kiran D., Divya K., Sanjay M.</div>
            </div>

            <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Coaching Track (&lt;75%)</span>
                <span className="badge badge-poor text-[10px]">Action Needed</span>
              </div>
              <p className="text-xs text-rose-900/80 mb-3">Targeted improvement plans and coaching support.</p>
              <div className="text-sm font-bold text-rose-700">Priya N., Vikram S.</div>
            </div>
          </div>
        </div>

        {/* Formal Reviews Table */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">Review Submissions & Calibration ({reviews.length})</h3>
            <span className="text-xs text-ink-muted">Click row to open appraisal dossier</span>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No reviews in this cycle"
              description="Review cycles will populate automatically as appraisals are initiated."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ink-secondary">
                <thead className="bg-surface-raised border-b border-border text-ink-muted uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Reviewer</th>
                    <th className="px-4 py-3 text-center">KPI (50%)</th>
                    <th className="px-4 py-3 text-center">Goals (30%)</th>
                    <th className="px-4 py-3 text-center">360 Feedback (20%)</th>
                    <th className="px-4 py-3 text-center">Overall Index</th>
                    <th className="px-4 py-3 text-center">Rating</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.map((rev) => (
                    <tr
                      key={rev.id}
                      onClick={() => setSelectedReview(rev)}
                      className="hover:bg-amber-50/20 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-ink text-sm">{rev.employeeName}</div>
                        <div className="text-xs text-ink-muted">{rev.employeeTitle} · {rev.employeeDept}</div>
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{rev.reviewerName}</td>
                      <td className="px-4 py-3 text-center font-bold text-ink">{rev.kpiScore}%</td>
                      <td className="px-4 py-3 text-center font-bold text-ink">{rev.goalScore}%</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-600">★ {rev.feedbackScore}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-ink">{rev.overallScore}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <RatingBadge score={rev.overallScore} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={rev.status} />
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {rev.status === 'COMPLETED' || rev.status === 'SUBMITTED' ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                              icon={<ShieldCheck size={12} />}
                              onClick={() => handleApprove(rev.id)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              className="text-xs"
                              onClick={() => setSelectedReview(rev)}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Formal Review Dossier Modal */}
        {selectedReview && (
          <Modal
            isOpen={!!selectedReview}
            onClose={() => setSelectedReview(null)}
            title={`Performance Review: ${selectedReview.employeeName}`}
            size="lg"
          >
            <div className="space-y-5">
              {/* Header profile */}
              <div className="p-4 bg-surface-raised rounded-lg border border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink">{selectedReview.employeeName}</h3>
                  <p className="text-xs text-ink-muted">
                    {selectedReview.employeeTitle} · {selectedReview.employeeDept} | Reviewer: {selectedReview.reviewerName}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-ink-muted">Synthesized Score</div>
                  <div className="text-xl font-bold text-ink">{selectedReview.overallScore}%</div>
                  <RatingBadge score={selectedReview.overallScore} />
                </div>
              </div>

              {/* Three Pillar Synthesis Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-ink-muted">KPI Achievement (50%)</div>
                  <div className="text-base font-bold text-ink mt-1">{selectedReview.kpiScore}%</div>
                </div>
                <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-ink-muted">Goal Completion (30%)</div>
                  <div className="text-base font-bold text-ink mt-1">{selectedReview.goalScore}%</div>
                </div>
                <div className="p-3 bg-white border border-border rounded-lg shadow-sm">
                  <div className="text-[10px] uppercase font-bold text-ink-muted">360 Feedback (20%)</div>
                  <div className="text-base font-bold text-amber-600 mt-1">★ {selectedReview.feedbackScore}</div>
                </div>
              </div>

              {/* Manager Evaluation Comments */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary mb-1.5">
                  Manager Executive Assessment
                </h4>
                <div className="p-3 bg-surface-raised rounded-lg border border-border text-xs text-ink-secondary leading-relaxed italic">
                  "{selectedReview.managerComments || 'Exceeded quarterly deliverables and demonstrated continuous alignment with organizational objectives.'}"
                </div>
              </div>

              {/* Strengths & Growth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5">
                    Demonstrated Strengths
                  </h4>
                  <div className="space-y-1">
                    {selectedReview.strengths?.map((s, i) => (
                      <div key={i} className="text-xs p-1.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200">
                        ✓ {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                    Key Development Opportunities
                  </h4>
                  <div className="space-y-1">
                    {selectedReview.improvements?.map((imp, i) => (
                      <div key={i} className="text-xs p-1.5 bg-amber-50 text-amber-800 rounded border border-amber-200">
                        ↗ {imp}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <StatusBadge status={selectedReview.status} />

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setSelectedReview(null)}>
                    Close
                  </Button>
                  {selectedReview.status !== 'APPROVED' && (
                    <Button
                      variant="primary"
                      loading={actionLoading}
                      icon={<ShieldCheck size={14} />}
                      onClick={() => handleApprove(selectedReview.id)}
                    >
                      Sign Off & Approve Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </PageContainer>
  );
}
