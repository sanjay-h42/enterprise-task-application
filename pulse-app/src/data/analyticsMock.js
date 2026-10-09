// src/data/analyticsMock.js
// Analytics data for charts

export const ANALYTICS_PERFORMANCE_TREND = [
  { period: 'Q1 FY25', engineering: 70.1, product: 72.3, sales: 68.4, operations: 71.2 },
  { period: 'Q2 FY25', engineering: 74.8, product: 76.1, sales: 73.2, operations: 73.5 },
  { period: 'Q3 FY25', engineering: 78.3, product: 79.4, sales: 76.8, operations: 75.1 },
  { period: 'Q4 FY25', engineering: 82.9, product: 83.2, sales: 80.4, operations: 77.8 },
  { period: 'Q1 FY26', engineering: 86.4, product: 84.9, sales: 82.1, operations: 78.4 },
  { period: 'Q2 FY26', engineering: 89.1, product: 86.2, sales: 83.7, operations: 79.6 },
  { period: 'Q3 FY26', engineering: 91.2, product: 87.4, sales: 84.9, operations: 78.2 },
];

export const KPI_CATEGORY_COMPARISON = [
  { category: 'Productivity', score: 89.2 },
  { category: 'Quality', score: 84.6 },
  { category: 'Attendance', score: 92.4 },
  { category: 'Goal Achievement', score: 78.8 },
  { category: 'Collaboration', score: 85.1 },
];

export const GOAL_COMPLETION_TREND = [
  { period: 'Q1 FY26', completion: 68.4, target: 80 },
  { period: 'Q2 FY26', completion: 74.2, target: 80 },
  { period: 'Q3 FY26', completion: 82.0, target: 82 },
];

export const PERFORMANCE_DISTRIBUTION = [
  { label: 'Excellent (90–100)', count: 2, percentage: 20 },
  { label: 'Very Good (80–89)', count: 3, percentage: 30 },
  { label: 'Good (70–79)', count: 3, percentage: 30 },
  { label: 'Needs Improvement (60–69)', count: 1, percentage: 10 },
  { label: 'Poor (<60)', count: 1, percentage: 10 },
];

export const DEPARTMENT_KPI_BREAKDOWN = [
  {
    department: 'Engineering', overall: 91.2,
    kpis: { productivity: 92, quality: 89, attendance: 96, goalAchievement: 86, collaboration: 91 }
  },
  {
    department: 'Product', overall: 87.4,
    kpis: { productivity: 91, quality: 85, attendance: 94, goalAchievement: 79, collaboration: 86 }
  },
  {
    department: 'Sales', overall: 84.9,
    kpis: { productivity: 83, quality: 79, attendance: 91, goalAchievement: 78, collaboration: 88 }
  },
  {
    department: 'Operations', overall: 78.2,
    kpis: { productivity: 75, quality: 74, attendance: 88, goalAchievement: 67, collaboration: 81 }
  },
];
