// src/components/layout/AppShell.jsx
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '../../utils/cn';

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on tablet
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e) => setCollapsed(e.matches);
    handler(mq);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-ink/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
      />

      <div
        className={cn(
          'main-layout flex-1 min-w-0',
          collapsed ? 'sidebar-collapsed' : ''
        )}
        style={{
          marginLeft: collapsed ? 'var(--sidebar-collapsed-w)' : 'var(--sidebar-w)',
        }}
      >
        <Outlet context={{ sidebarCollapsed: collapsed, onMobileMenuOpen: () => setMobileOpen(true) }} />
      </div>
    </div>
  );
}
