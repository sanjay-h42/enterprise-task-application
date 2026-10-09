// src/components/ui/Input.jsx
import { cn } from '../../utils/cn';
import { Search } from 'lucide-react';

/**
 * Standard text input
 */
export function Input({ label, error, helpText, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-ink-secondary">{label}</label>
      )}
      <input
        className={cn('input', error && 'border-critical-DEFAULT focus:border-critical-DEFAULT', className)}
        {...props}
      />
      {error && <p className="text-xs text-critical-text">{error}</p>}
      {helpText && !error && <p className="text-xs text-ink-subtle">{helpText}</p>}
    </div>
  );
}

/**
 * Select dropdown
 */
export function Select({ label, error, helpText, className, children, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-ink-secondary">{label}</label>
      )}
      <select
        className={cn('input appearance-none cursor-pointer', error && 'border-critical-DEFAULT', className)}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-critical-text">{error}</p>}
      {helpText && !error && <p className="text-xs text-ink-subtle">{helpText}</p>}
    </div>
  );
}

/**
 * Textarea
 */
export function Textarea({ label, error, helpText, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-medium text-ink-secondary">{label}</label>
      )}
      <textarea
        className={cn('input resize-none min-h-[80px]', error && 'border-critical-DEFAULT', className)}
        {...props}
      />
      {error && <p className="text-xs text-critical-text">{error}</p>}
      {helpText && !error && <p className="text-xs text-ink-subtle">{helpText}</p>}
    </div>
  );
}

/**
 * Search input with icon
 */
export function SearchInput({ className, ...props }) {
  return (
    <div className={cn('search-input', className)}>
      <Search size={13} className="text-ink-muted" />
      <input type="search" {...props} />
    </div>
  );
}

export default Input;
