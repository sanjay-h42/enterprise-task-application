// src/api/analyticsApi.js
import apiClient from './axios';
import {
  ANALYTICS_PERFORMANCE_TREND,
  KPI_CATEGORY_COMPARISON,
  GOAL_COMPLETION_TREND,
  PERFORMANCE_DISTRIBUTION,
  DEPARTMENT_KPI_BREAKDOWN,
} from '../data/analyticsMock';
import { DASHBOARD_OVERVIEW, PERFORMANCE_SIGNALS, KPI_HEALTH, DEPARTMENT_PERFORMANCE, PERFORMANCE_TREND } from '../data/dashboardMock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsApi = {
  getDashboard: async () => {
    if (USE_MOCK) {
      await delay(500);
      return {
        overview: DASHBOARD_OVERVIEW,
        signals: PERFORMANCE_SIGNALS,
        trend: PERFORMANCE_TREND,
        kpiHealth: KPI_HEALTH,
        departmentPerformance: DEPARTMENT_PERFORMANCE,
      };
    }
    return apiClient.get('/analytics/dashboard').then(r => r.data);
  },

  getPerformanceTrend: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(400);
      return ANALYTICS_PERFORMANCE_TREND;
    }
    return apiClient.get('/analytics/performance-trend', { params: filters }).then(r => r.data);
  },

  getKpiCategoryComparison: async () => {
    if (USE_MOCK) {
      await delay(350);
      return KPI_CATEGORY_COMPARISON;
    }
    return apiClient.get('/analytics/kpi-categories').then(r => r.data);
  },

  getGoalCompletion: async () => {
    if (USE_MOCK) {
      await delay(350);
      return GOAL_COMPLETION_TREND;
    }
    return apiClient.get('/analytics/goal-completion').then(r => r.data);
  },

  getPerformanceDistribution: async () => {
    if (USE_MOCK) {
      await delay(300);
      return PERFORMANCE_DISTRIBUTION;
    }
    return apiClient.get('/analytics/distribution').then(r => r.data);
  },

  getDepartmentBreakdown: async () => {
    if (USE_MOCK) {
      await delay(400);
      return DEPARTMENT_KPI_BREAKDOWN;
    }
    return apiClient.get('/analytics/department-breakdown').then(r => r.data);
  },
};
