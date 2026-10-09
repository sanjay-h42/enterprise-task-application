// src/components/ui/Skeleton.jsx
import { cn } from '../../utils/cn';

/**
 * Skeleton loader base element
 */
export function Skeleton({ className, style }) {
  return <div className={cn('skeleton', className)} style={style} aria-hidden="true" />;
}

/**
 * Pre-built skeleton for a stat/metric card
 */
export function SkeletonMetricCard() {
  return (
    <div className="card p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

/**
 * Pre-built skeleton for a table row
 */
export function SkeletonTableRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" style={{ width: `${60 + (i * 10) % 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Full page loading skeleton for an employee list
 */
export function SkeletonEmployeeList({ rows = 5 }) {
  return (
    <div className="card">
      <table className="data-table w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-surface-overlay last:border-0">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5"><Skeleton className="h-3 w-20" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-3 w-16" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-3 w-24" /></td>
              <td className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Dashboard hero skeleton
 */
export function SkeletonDashboardHero() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-16 w-48" />
        <Skeleton className="h-3 w-80" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <SkeletonMetricCard key={i} />)}
      </div>
    </div>
  );
}

export default Skeleton;
