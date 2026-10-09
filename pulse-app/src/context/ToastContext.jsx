// src/context/ToastContext.jsx
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ toast, onDismiss }) {
  const Icon = ICONS[toast.type] || Info;

  return (
    <div className={`toast toast-${toast.type}`} role="alert">
      <Icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: toast.type === 'success' ? '#16A34A' : toast.type === 'error' ? '#DC2626' : toast.type === 'warning' ? '#F59E0B' : '#0EA5E9' }} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <div className="font-semibold text-sm text-white mb-0.5">{toast.title}</div>
        )}
        <div className="text-sm text-zinc-300">{toast.message}</div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 ml-1 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const success = useCallback((message, title) => toast({ type: 'success', message, title }), [toast]);
  const error = useCallback((message, title) => toast({ type: 'error', message, title, duration: 6000 }), [toast]);
  const warning = useCallback((message, title) => toast({ type: 'warning', message, title }), [toast]);
  const info = useCallback((message, title) => toast({ type: 'info', message, title }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
