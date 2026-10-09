// src/components/layout/PageContainer.jsx
import { useEffect } from 'react';
import Topbar from './Topbar';

/**
 * PageContainer wraps every page with the topbar and consistent padding.
 *
 * @param {object} props
 * @param {string} props.title - Page title shown in topbar
 * @param {string[]} [props.breadcrumb] - Breadcrumb array e.g. ['Performance', 'Overview']
 * @param {React.ReactNode} props.children
 * @param {string} [props.className] - Extra classes for the inner container
 * @param {boolean} [props.fluid] - Remove max-width constraint
 */
export default function PageContainer({ title, breadcrumb, children, className = '', fluid = false, onMobileMenuOpen }) {
  useEffect(() => {
    document.title = title ? `${title} — PULSE` : 'PULSE';
  }, [title]);

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title={title} breadcrumb={breadcrumb} onMobileMenuOpen={onMobileMenuOpen} />
      <main
        id="main-content"
        className={`page-container ${fluid ? '' : 'max-w-screen-xl'} ${className}`}
        role="main"
      >
        {children}
      </main>
    </div>
  );
}
