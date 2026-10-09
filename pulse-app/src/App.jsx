// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './components/layout/AppShell';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Goals from './pages/Goals';
import Kpis from './pages/Kpis';
import Feedback from './pages/Feedback';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Protected Route Wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-muted">Loading PULSE Enterprise...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Page route wrapper to forward mobile menu context
function PageWithOutletContext({ Component }) {
  const context = useOutletContext();
  return <Component onMobileMenuOpen={context?.onMobileMenuOpen} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected App Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<PageWithOutletContext Component={Dashboard} />} />
              <Route
                path="employees"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <PageWithOutletContext Component={Employees} />
                  </ProtectedRoute>
                }
              />
              <Route path="goals" element={<PageWithOutletContext Component={Goals} />} />
              <Route path="kpis" element={<PageWithOutletContext Component={Kpis} />} />
              <Route path="feedback" element={<PageWithOutletContext Component={Feedback} />} />
              <Route path="reviews" element={<PageWithOutletContext Component={Reviews} />} />
              <Route
                path="analytics"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                    <PageWithOutletContext Component={Analytics} />
                  </ProtectedRoute>
                }
              />
              <Route path="settings" element={<PageWithOutletContext Component={Settings} />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
