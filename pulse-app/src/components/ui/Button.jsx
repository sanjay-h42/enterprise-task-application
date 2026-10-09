// src/components/ui/Button.jsx
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const SIZES = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

/**
 * Unified Button component.
 *
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='secondary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.loading]
 * @param {React.ReactNode} [props.icon] - Lucide icon element
 * @param {boolean} [props.iconRight] - Places icon after label
 */
export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  iconRight = false,
  className,
  disabled,
  ...rest
}) {
  return (
    <button
      className={cn('btn', VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        !iconRight && icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && iconRight && icon && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
