// src/components/ui/EmptyState.jsx
import { cn } from '../../utils/cn';

/**
 * Empty state component shown when no data exists
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Lucide icon component
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {React.ReactNode} [props.action]
 * @param {string} [props.className]
 */
export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-overlay flex items-center justify-center mb-4">
          <Icon size={20} className="text-ink-subtle" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-xs">{description}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
}

/**
 * Error state with retry action
 */
export function ErrorState({ message = 'Unable to load data.', onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      <div className="w-12 h-12 rounded-xl bg-critical-bg flex items-center justify-center mb-4">
        <span className="text-critical-text text-xl">!</span>
      </div>
      <h3 className="text-sm font-semibold text-ink mb-1">Something went wrong</h3>
      <p className="text-sm text-ink-muted mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary btn-sm"
        >
          Retry
        </button>
      )}
    </div>
  );
}
