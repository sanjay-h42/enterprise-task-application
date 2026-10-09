// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  BarChart2,
  MessageSquare,
  ClipboardList,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAvatarColor } from '../../utils/cn';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/employees', icon: Users, label: 'People', roles: ['ADMIN', 'MANAGER'] },
  { to: '/goals', icon: Target, label: 'Goals', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/kpis', icon: BarChart2, label: 'KPIs', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/feedback', icon: MessageSquare, label: 'Feedback', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/reviews', icon: ClipboardList, label: 'Reviews', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', roles: ['ADMIN', 'MANAGER'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout, hasRole } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    success('Signed out successfully.');
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter(item =>
    !user || item.roles.includes(user.role)
  );

  const avatarBg = user ? getAvatarColor(user.name) : '#F59E0B';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Main navigation">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
        {!collapsed && (
          <div className="pulse-logo flex items-center gap-2">
            <Activity size={18} className="text-amber-400" />
            <span>PUL<span className="text-amber-400">SE</span></span>
          </div>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <Activity size={18} className="text-amber-400" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Collapsed toggle */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-zinc-800">
          <button
            onClick={onToggle}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Navigation section label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-1">
          <span className="text-label" style={{ color: '#52525B', fontSize: '0.625rem' }}>
            Navigation
          </span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto" role="navigation">
        {visibleItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={16} className="nav-icon flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-zinc-800" />

      {/* User section */}
      <div className="p-3">
        {user && (
          <div className={`flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800 transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <div
              className="avatar flex-shrink-0"
              style={{
                width: collapsed ? '32px' : '30px',
                height: collapsed ? '32px' : '30px',
                background: avatarBg,
                fontSize: collapsed ? '11px' : '10px',
                color: 'white',
              }}
              aria-label={user.name}
            >
              {user.avatar}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-zinc-100 text-xs font-semibold truncate">{user.name}</div>
                <div className="text-zinc-500 text-xs truncate">{user.role}</div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-1 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 transition-colors"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        )}
        {collapsed && user && (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-1.5 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors mt-1"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={13} />
          </button>
        )}
      </div>
    </aside>
  );
}
