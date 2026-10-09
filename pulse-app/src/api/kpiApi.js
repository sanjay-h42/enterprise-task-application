// src/api/kpiApi.js
import apiClient from './axios';
import { KPIS, calculateWeightedScore } from '../data/kpiMock';
import { EMPLOYEES } from '../data/employeeMock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const kpiApi = {
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...KPIS];
      if (filters.employeeId) data = data.filter(k => k.employeeId === Number(filters.employeeId));
      if (filters.category) data = data.filter(k => k.category === filters.category);
      return data;
    }
    return apiClient.get('/kpis', { params: filters }).then(r => r.data);
  },

  getByEmployee: async (employeeId) => {
    if (USE_MOCK) {
      await delay(450);
      const employee = EMPLOYEES.find(e => e.id === Number(employeeId));
      if (!employee) throw new Error('Employee not found');
      const kpis = KPIS.filter(k => k.employeeId === Number(employeeId));
      const overallScore = kpis.length > 0 ? calculateWeightedScore(kpis) : employee.overallScore;
      return {
        employeeId: employee.id,
        employeeName: employee.name,
        employeeTitle: employee.title,
        department: employee.department,
        overallScore: parseFloat(overallScore.toFixed(1)),
        previousScore: employee.previousScore,
        trend: employee.trend,
        rating: employee.rating,
        kpis,
      };
    }
    return apiClient.get(`/kpis/employee/${employeeId}`).then(r => r.data);
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const kpi = KPIS.find(k => k.id === Number(id));
      if (!kpi) throw new Error('KPI not found');
      return kpi;
    }
    return apiClient.get(`/kpis/${id}`).then(r => r.data);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay(600);
      return { ...data, id: Date.now(), achievement: (data.actual / data.target) * 100 };
    }
    return apiClient.post('/kpis', data).then(r => r.data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await delay(500);
      return { id, ...data, achievement: (data.actual / data.target) * 100 };
    }
    return apiClient.put(`/kpis/${id}`, data).then(r => r.data);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true };
    }
    return apiClient.delete(`/kpis/${id}`).then(r => r.data);
  },
};
