// src/data/goalMock.js
// 15-20 goals across employees and departments

export const GOALS = [
  {
    id: 1, employeeId: 1, title: 'Launch Customer Portal v2.0', description: 'Deliver the redesigned customer portal with new authentication and dashboard features.',
    department: 'Engineering', priority: 'HIGH', progress: 82, target: 100, actual: 82, unit: '%',
    deadline: '2026-09-24', status: 'ON_TRACK', linkedKpiId: 1, linkedKpiName: 'Task Completion',
    linkedKpiTarget: 90, linkedKpiCurrent: 86, createdAt: '2026-07-01',
  },
  {
    id: 2, employeeId: 1, title: 'Reduce API Response Time by 40%', description: 'Performance optimization initiative to improve backend API latency.',
    department: 'Engineering', priority: 'HIGH', progress: 95, target: 100, actual: 95, unit: '%',
    deadline: '2026-08-31', status: 'COMPLETED', linkedKpiId: 3, linkedKpiName: 'Sprint Velocity',
    linkedKpiTarget: 95, linkedKpiCurrent: 95, createdAt: '2026-07-01',
  },
  {
    id: 3, employeeId: 1, title: 'Complete AWS Certification', description: 'Achieve AWS Solutions Architect Associate certification.',
    department: 'Engineering', priority: 'MEDIUM', progress: 60, target: 100, actual: 60, unit: '%',
    deadline: '2026-10-15', status: 'IN_PROGRESS', createdAt: '2026-07-15',
  },
  {
    id: 4, employeeId: 2, title: 'Define Q4 Product Roadmap', description: 'Collaborate with engineering and stakeholders to finalize the Q4 roadmap.',
    department: 'Product', priority: 'HIGH', progress: 100, target: 100, actual: 100, unit: '%',
    deadline: '2026-08-15', status: 'COMPLETED', createdAt: '2026-07-01',
  },
  {
    id: 5, employeeId: 2, title: 'Improve NPS Score to 72', description: 'Drive product changes that improve customer Net Promoter Score.',
    department: 'Product', priority: 'HIGH', progress: 65, target: 72, actual: 46, unit: 'NPS',
    deadline: '2026-09-30', status: 'AT_RISK', createdAt: '2026-07-01',
  },
  {
    id: 6, employeeId: 2, title: 'Launch Analytics Feature', description: 'Ship the in-product analytics dashboard by end of Q3.',
    department: 'Product', priority: 'MEDIUM', progress: 80, target: 100, actual: 80, unit: '%',
    deadline: '2026-09-20', status: 'ON_TRACK', createdAt: '2026-07-10',
  },
  {
    id: 7, employeeId: 3, title: 'Migrate to React 19', description: 'Upgrade the frontend codebase to React 19 with concurrent features.',
    department: 'Engineering', priority: 'HIGH', progress: 70, target: 100, actual: 70, unit: '%',
    deadline: '2026-09-15', status: 'ON_TRACK', createdAt: '2026-07-05',
  },
  {
    id: 8, employeeId: 3, title: 'Improve Lighthouse Score to 95+', description: 'Optimize performance and accessibility to achieve Lighthouse score above 95.',
    department: 'Engineering', priority: 'MEDIUM', progress: 88, target: 95, actual: 84, unit: 'score',
    deadline: '2026-08-31', status: 'AT_RISK', createdAt: '2026-07-01',
  },
  {
    id: 9, employeeId: 4, title: 'Close 40 Enterprise Accounts', description: 'Outreach and close enterprise accounts in the healthcare and finance verticals.',
    department: 'Sales', priority: 'HIGH', progress: 60, target: 40, actual: 24, unit: 'accounts',
    deadline: '2026-09-30', status: 'AT_RISK', createdAt: '2026-07-01',
  },
  {
    id: 10, employeeId: 4, title: 'Achieve ₹2.5 Cr Revenue Target', description: 'Quarterly revenue target for the sales team.',
    department: 'Sales', priority: 'HIGH', progress: 72, target: 250, actual: 180, unit: '₹ lakh',
    deadline: '2026-09-30', status: 'ON_TRACK', createdAt: '2026-07-01',
  },
  {
    id: 11, employeeId: 5, title: 'Reduce Operational Costs by 15%', description: 'Identify and implement cost reduction opportunities across operations.',
    department: 'Operations', priority: 'HIGH', progress: 55, target: 15, actual: 8.2, unit: '% savings',
    deadline: '2026-09-30', status: 'AT_RISK', createdAt: '2026-07-01',
  },
  {
    id: 12, employeeId: 5, title: 'Implement ISO 27001 Controls', description: 'Complete implementation of 30 required ISO 27001 security controls.',
    department: 'Operations', priority: 'MEDIUM', progress: 80, target: 30, actual: 24, unit: 'controls',
    deadline: '2026-10-31', status: 'ON_TRACK', createdAt: '2026-06-15',
  },
  {
    id: 13, employeeId: 6, title: 'Build Cohort Analysis Model', description: 'Develop and deploy a cohort retention analysis model for product team.',
    department: 'Product', priority: 'HIGH', progress: 40, target: 100, actual: 40, unit: '%',
    deadline: '2026-09-30', status: 'BEHIND', createdAt: '2026-07-15',
  },
  {
    id: 14, employeeId: 7, title: 'API Gateway Migration', description: 'Migrate all services to the new API gateway architecture.',
    department: 'Engineering', priority: 'HIGH', progress: 65, target: 100, actual: 65, unit: '%',
    deadline: '2026-09-30', status: 'IN_PROGRESS', createdAt: '2026-07-01',
  },
  {
    id: 15, employeeId: 9, title: 'Build End-to-End Test Suite', description: 'Create comprehensive E2E test coverage for core user flows.',
    department: 'Engineering', priority: 'HIGH', progress: 35, target: 100, actual: 35, unit: '%',
    deadline: '2026-09-30', status: 'BEHIND', createdAt: '2026-07-01',
  },
  {
    id: 16, employeeId: 10, title: 'Process Automation Initiative', description: 'Automate 10 manual operational workflows using RPA tools.',
    department: 'Operations', priority: 'MEDIUM', progress: 30, target: 10, actual: 3, unit: 'workflows',
    deadline: '2026-10-15', status: 'BEHIND', createdAt: '2026-07-10',
  },
];
