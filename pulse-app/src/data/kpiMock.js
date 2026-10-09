// src/data/kpiMock.js
// KPI mock data — 20+ KPIs across employees and categories

export const KPI_CATEGORIES = ['Productivity', 'Quality', 'Attendance', 'Goal Achievement', 'Collaboration'];

export const KPIS = [
  // Ananya Sharma (id: 1)
  { id: 1, employeeId: 1, name: 'Task Completion', category: 'Productivity', target: 100, actual: 96, achievement: 96, weight: 30, unit: '%', description: 'Percentage of assigned tasks completed on time' },
  { id: 2, employeeId: 1, name: 'Code Quality Score', category: 'Quality', target: 100, actual: 92, achievement: 92, weight: 25, unit: '%', description: 'Code review pass rate and maintainability index' },
  { id: 3, employeeId: 1, name: 'Sprint Velocity', category: 'Productivity', target: 100, actual: 95, achievement: 95, weight: 20, unit: '%', description: 'Story points delivered vs. planned per sprint' },
  { id: 4, employeeId: 1, name: 'Attendance', category: 'Attendance', target: 100, actual: 98, achievement: 98, weight: 10, unit: '%', description: 'Days present vs. working days' },
  { id: 5, employeeId: 1, name: 'Goal Achievement', category: 'Goal Achievement', target: 100, actual: 94, achievement: 94, weight: 15, unit: '%', description: 'Percentage of quarterly goals achieved' },

  // Rahul Kumar (id: 2)
  { id: 6, employeeId: 2, name: 'Product Roadmap Delivery', category: 'Goal Achievement', target: 100, actual: 91, achievement: 91, weight: 30, unit: '%', description: 'Features shipped vs. roadmap commitment' },
  { id: 7, employeeId: 2, name: 'Stakeholder Satisfaction', category: 'Quality', target: 5, actual: 4.6, achievement: 92, weight: 25, unit: '/5', description: 'Stakeholder feedback rating across quarters' },
  { id: 8, employeeId: 2, name: 'Sprint Planning Accuracy', category: 'Productivity', target: 100, actual: 94, achievement: 94, weight: 20, unit: '%', description: 'Accuracy of sprint capacity planning' },
  { id: 9, employeeId: 2, name: 'Attendance', category: 'Attendance', target: 100, actual: 97, achievement: 97, weight: 10, unit: '%', description: 'Days present vs. working days' },
  { id: 10, employeeId: 2, name: 'Cross-team Collaboration', category: 'Collaboration', target: 100, actual: 89, achievement: 89, weight: 15, unit: '%', description: 'Multi-team project participation score' },

  // Kiran Desai (id: 3)
  { id: 11, employeeId: 3, name: 'UI Delivery', category: 'Productivity', target: 100, actual: 88, achievement: 88, weight: 30, unit: '%', description: 'Frontend features delivered on schedule' },
  { id: 12, employeeId: 3, name: 'Design Accuracy', category: 'Quality', target: 100, actual: 91, achievement: 91, weight: 25, unit: '%', description: 'Pixel accuracy vs. design specs' },
  { id: 13, employeeId: 3, name: 'Performance Optimization', category: 'Productivity', target: 100, actual: 85, achievement: 85, weight: 20, unit: '%', description: 'Page load improvements vs. baseline' },
  { id: 14, employeeId: 3, name: 'Attendance', category: 'Attendance', target: 100, actual: 96, achievement: 96, weight: 10, unit: '%', description: 'Days present vs. working days' },
  { id: 15, employeeId: 3, name: 'Goal Achievement', category: 'Goal Achievement', target: 100, actual: 82, achievement: 82, weight: 15, unit: '%', description: 'Quarterly goal completion rate' },

  // Priya Nambiar (id: 9) — needs attention
  { id: 16, employeeId: 9, name: 'Bug Detection Rate', category: 'Quality', target: 100, actual: 62, achievement: 62, weight: 30, unit: '%', description: 'Bugs found before production vs. total bugs' },
  { id: 17, employeeId: 9, name: 'Test Coverage', category: 'Quality', target: 100, actual: 68, achievement: 68, weight: 25, unit: '%', description: 'Percentage of codebase covered by automated tests' },
  { id: 18, employeeId: 9, name: 'Sprint Participation', category: 'Productivity', target: 100, actual: 71, achievement: 71, weight: 20, unit: '%', description: 'Participation and contribution in sprint cycles' },
  { id: 19, employeeId: 9, name: 'Attendance', category: 'Attendance', target: 100, actual: 80, achievement: 80, weight: 10, unit: '%', description: 'Days present vs. working days' },
  { id: 20, employeeId: 9, name: 'Goal Achievement', category: 'Goal Achievement', target: 100, actual: 58, achievement: 58, weight: 15, unit: '%', description: 'Quarterly goal completion rate' },

  // Vikram Shetty (id: 10) — needs attention
  { id: 21, employeeId: 10, name: 'Process Compliance', category: 'Productivity', target: 100, actual: 60, achievement: 60, weight: 30, unit: '%', description: 'Adherence to operations procedures' },
  { id: 22, employeeId: 10, name: 'Report Accuracy', category: 'Quality', target: 100, actual: 63, achievement: 63, weight: 25, unit: '%', description: 'Error rate in operational reports' },
  { id: 23, employeeId: 10, name: 'Task Turnaround', category: 'Productivity', target: 100, actual: 58, achievement: 58, weight: 20, unit: '%', description: 'Average task completion time vs. SLA' },
  { id: 24, employeeId: 10, name: 'Attendance', category: 'Attendance', target: 100, actual: 75, achievement: 75, weight: 10, unit: '%', description: 'Days present vs. working days' },
  { id: 25, employeeId: 10, name: 'Goal Achievement', category: 'Goal Achievement', target: 100, actual: 55, achievement: 55, weight: 15, unit: '%', description: 'Quarterly goal completion rate' },
];

/**
 * Calculate the weighted overall score for an employee's KPIs
 * @param {Array} kpis - Array of KPI objects for one employee
 * @returns {number} - Overall weighted score
 */
export function calculateWeightedScore(kpis) {
  const totalWeight = kpis.reduce((sum, k) => sum + k.weight, 0);
  const weightedSum = kpis.reduce((sum, k) => sum + (k.achievement * k.weight), 0);
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
