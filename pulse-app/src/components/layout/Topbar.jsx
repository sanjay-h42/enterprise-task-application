// src/components/layout/Topbar.jsx
import { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, Calendar, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAvatarColor } from '../../utils/cn';

export default function Topbar({ title, breadcrumb, onMobileMenuOpen }) {
  const { user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const avatarBg = user ? getAvatarColor(user.name) : '#F59E0B';

  return (
    <header className="topbar" role="banner">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-1.5 rounded text-ink-muted hover:text-ink hover:bg-surface-overlay transition-colors"
        onClick={onMobileMenuOpen}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Page Title / Breadcrumb */}
      <div className="flex-1 min-w-0">
        {breadcrumb && breadcrumb.length > 1 ? (
          <div className="flex items-center gap-1.5 text-sm">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-ink-faint">/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-ink font-semibold' : 'text-ink-muted'}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <h1 className="text-sm font-semibold text-ink">{title || 'PULSE'}</h1>
        )}
      </div>

      {/* Review cycle indicator */}
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-xs font-medium text-amber-700">
        <Calendar size={11} />
        <span>Q3 FY2026 Review</span>
        <span className="w-1 h-1 rounded-full bg-amber-400" />
        <span className="text-amber-500">Active</span>
      </div>

      {/* Search */}
      <div className={`search-input hidden sm:flex w-48 lg:w-64 transition-all ${searchFocused ? 'lg:w-72' : ''}`}>
        <Search size={13} className="text-ink-muted flex-shrink-0" />
        <input
          type="search"
          placeholder="Search people, goals..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          aria-label="Search"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          className="relative p-2 rounded text-ink-muted hover:text-ink hover:bg-surface-overlay transition-colors"
          onClick={() => setNotifOpen(o => !o)}
          aria-label="Notifications"
          aria-expanded={notifOpen}
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent" aria-label="3 unread notifications" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-1 w-72 card shadow-modal z-50 animate-fade-in" role="dialog" aria-label="Notifications panel">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">Notifications</span>
              <span className="badge badge-excellent">3 new</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { icon: Activity, msg: 'Q3 review cycle deadline in 12 days', time: '2h ago', color: '#F59E0B' },
                { icon: Activity, msg: 'Priya N. submitted self-assessment', time: '4h ago', color: '#0EA5E9' },
                { icon: Activity, msg: 'New feedback received from Rahul K.', time: '1d ago', color: '#16A34A' },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-surface-raised transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: n.color + '18' }}>
                      <n.icon size={12} style={{ color: n.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-ink-secondary leading-snug">{n.msg}</p>
                      <p className="text-xs text-ink-subtle mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-border">
              <button className="text-xs text-accent font-medium hover:underline">View all notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* User profile */}
      {user && (
        <button className="flex items-center gap-2 p-1.5 pl-2 rounded hover:bg-surface-overlay transition-colors" aria-label="User profile menu">
          <div
            className="avatar"
            style={{ width: 26, height: 26, background: avatarBg, fontSize: '10px', color: 'white' }}
          >
            {user.avatar}
          </div>
          <span className="hidden md:block text-xs font-medium text-ink">{user.name.split(' ')[0]}</span>
          <ChevronDown size={12} className="text-ink-muted hidden md:block" />
        </button>
      )}
    </header>
  );
}
