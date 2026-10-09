// src/components/ui/Badge.jsx
import { cn, getPerformanceRating } from '../../utils/cn';

const VARIANT_CLASSES = {
  default: 'bg-surface-overlay text-ink-secondary border-border',
  primary: 'bg-amber-50 text-amber-700 border-amber-200',
  success: 'bg-positive-bg text-positive-text border-positive-border',
  warning: 'bg-warning-bg text-warning-text border-warning-border',
  critical: 'bg-critical-bg text-critical-text border-critical-border',
  info: 'bg-sky-50 text-sky-700 border-sky-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

/**
 * Versatile badge component.
 */
export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn('badge', VARIANT_CLASSES[variant], className)}>
      {children}
    </span>
  );
}

/**
 * Auto-selects badge style from a numeric performance score.
 */
export function RatingBadge({ score, className }) {
  const { label, badgeClass } = getPerformanceRating(score);
  return (
    <span className={cn('badge', badgeClass, className)}>
      {label}
    </span>
  );
}

/**
 * Status badge for goals/reviews
 */
export function StatusBadge({ status, className }) {
  const MAP = {
    ACTIVE:      { label: 'Active',       cls: 'badge-excellent' },
    IN_PROGRESS: { label: 'In Progress',  cls: 'badge-verygood' },
    COMPLETED:   { label: 'Completed',    cls: 'badge-excellent' },
    PENDING:     { label: 'Pending',      cls: 'badge-needsimprovement' },
    OVERDUE:     { label: 'Overdue',      cls: 'badge-poor' },
    DRAFT:       { label: 'Draft',        cls: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
    APPROVED:    { label: 'Approved',     cls: 'badge-excellent' },
    SUBMITTED:   { label: 'Submitted',    cls: 'badge-verygood' },
    INACTIVE:    { label: 'Inactive',     cls: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
    ON_TRACK:    { label: 'On Track',     cls: 'badge-excellent' },
    AT_RISK:     { label: 'At Risk',      cls: 'badge-needsimprovement' },
    BEHIND:      { label: 'Behind',       cls: 'badge-poor' },
  };
  const config = MAP[status] || { label: status, cls: 'bg-zinc-100 text-zinc-500 border border-zinc-200' };
  return (
    <span className={cn('badge', config.cls, className)}>
      {config.label}
    </span>
  );
}
