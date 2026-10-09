// src/components/ui/Progress.jsx
import { cn, getProgressColor } from '../../utils/cn';

/**
 * Progress bar component
 *
 * @param {object} props
 * @param {number} props.value - 0-100
 * @param {string} [props.color] - Override color class: positive|accent|warning|critical|blue|purple
 * @param {boolean} [props.auto] - Auto-pick color based on value
 * @param {'xs'|'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.label]
 * @param {boolean} [props.showValue]
 */
export function ProgressBar({ value = 0, color, auto = false, size = 'sm', label, showValue = false, className }) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const fillColor = color || (auto ? getProgressColor(clampedValue) : 'accent');

  const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-ink-muted">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-ink-secondary">{clampedValue.toFixed(0)}%</span>}
        </div>
      )}
      <div className={cn('progress-track', heights[size])} role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div
          className={cn('progress-fill', `progress-fill-${fillColor}`)}
          style={{ width: `${clampedValue}%`, transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </div>
    </div>
  );
}

/**
 * Circular ring progress indicator (SVG-based)
 */
export function CircularProgress({ value = 0, size = 120, strokeWidth = 10, color = '#F59E0B', bgColor = '#F0EEE9', children, className }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-label={`${clampedValue}% progress`} role="img">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/**
 * KPI progress bar with label and score
 */
export function KPIProgress({ label, value, weight, color, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-secondary">{label}</span>
        <div className="flex items-center gap-3">
          {weight !== undefined && (
            <span className="text-xs text-ink-subtle">{weight}% weight</span>
          )}
          <span className="text-sm font-bold text-ink" style={{ minWidth: '3rem', textAlign: 'right' }}>{value.toFixed(1)}%</span>
        </div>
      </div>
      <ProgressBar value={value} auto size="md" />
    </div>
  );
}

export const Progress = ProgressBar;
export default ProgressBar;
