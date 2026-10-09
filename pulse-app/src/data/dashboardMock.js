// src/data/dashboardMock.js
// Mock data for the Performance Command Center dashboard

export const DASHBOARD_OVERVIEW = {
  overallScore: 87.6,
  previousScore: 83.4,
  trend: 4.2,
  performanceHealth: 'Strong',
  reviewCycle: 'Q3 FY2026',
  reviewCycleProgress: 72,
  reviewCompleted: 72,
  reviewPending: 28,
  reviewEndDays: 12,
};

export const PERFORMANCE_SIGNALS = [
  {
    id: 'avg-kpi',
    label: 'Average KPI Score',
    value: 87.6,
    previous: 83.4,
    change: 4.2,
    unit: '%',
    interpretation: 'Consistently above target',
    color: '#F59E0B',
  },
  {
    id: 'goal-completion',
    label: 'Goal Completion',
    value: 82,
    previous: 75.6,
    change: 6.4,
    unit: '%',
    interpretation: 'Strong improvement',
    color: '#16A34A',
  },
  {
    id: 'feedback-rating',
    label: 'Feedback Rating',
    value: 4.1,
    previous: 3.8,
    change: 0.3,
    unit: '/5',
    interpretation: 'Positive sentiment',
    color: '#8B5CF6',
  },
  {
    id: 'review-completion',
    label: 'Review Completion',
    value: 72,
    previous: 58,
    change: 14,
    unit: '%',
    interpretation: 'Cycle in progress',
    color: '#0EA5E9',
  },
];

export const PERFORMANCE_TREND = [
  { period: 'Q1 FY25', score: 74.2, target: 80 },
  { period: 'Q2 FY25', score: 79.6, target: 80 },
  { period: 'Q3 FY25', score: 81.3, target: 82 },
  { period: 'Q4 FY25', score: 83.4, target: 84 },
  { period: 'Q1 FY26', score: 84.8, target: 85 },
  { period: 'Q2 FY26', score: 85.9, target: 86 },
  { period: 'Q3 FY26', score: 87.6, target: 87 },
];

export const KPI_HEALTH = [
  { name: 'Productivity', score: 92, weight: 30, trend: 2.1, color: '#F59E0B' },
  { name: 'Quality', score: 87, weight: 25, trend: 1.4, color: '#0EA5E9' },
  { name: 'Attendance', score: 95, weight: 10, trend: 0.5, color: '#16A34A' },
  { name: 'Goal Achievement', score: 82, weight: 20, trend: 6.4, color: '#8B5CF6' },
  { name: 'Collaboration', score: 84, weight: 15, trend: -0.8, color: '#EC4899' },
];

export const DEPARTMENT_PERFORMANCE = [
  { name: 'Engineering', score: 91.2, employees: 4, change: 3.8 },
  { name: 'Product', score: 87.4, employees: 2, change: 2.1 },
  { name: 'Sales', score: 84.9, employees: 2, change: 1.6 },
  { name: 'Operations', score: 78.2, employees: 2, change: -1.2 },
];
