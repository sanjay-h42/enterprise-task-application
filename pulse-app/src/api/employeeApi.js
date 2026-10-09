// src/api/employeeApi.js
// Employee API service — swap mock implementation with real axios calls for Spring Boot

import apiClient from './axios';
import { EMPLOYEES, DEPARTMENTS } from '../data/employeeMock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const DELAY = 400;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Employees ─────────────────────────────────────────────────────

export const employeeApi = {
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(DELAY);
      let data = [...EMPLOYEES];
      if (filters.department) data = data.filter(e => e.department === filters.department);
      if (filters.status) data = data.filter(e => e.status === filters.status);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(e =>
          e.name.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q)
        );
      }
      if (filters.performance) {
        if (filters.performance === 'EXCELLENT') data = data.filter(e => e.overallScore >= 90);
        else if (filters.performance === 'GOOD') data = data.filter(e => e.overallScore >= 70 && e.overallScore < 90);
        else if (filters.performance === 'NEEDS_IMPROVEMENT') data = data.filter(e => e.overallScore < 70);
      }
      return { data, total: data.length };
    }
    return apiClient.get('/employees', { params: filters }).then(r => r.data);
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(DELAY);
      const employee = EMPLOYEES.find(e => e.id === Number(id));
      if (!employee) throw new Error('Employee not found');
      return employee;
    }
    return apiClient.get(`/employees/${id}`).then(r => r.data);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay(600);
      return { ...data, id: Date.now(), employeeId: `EMP-${1200 + Math.floor(Math.random() * 100)}` };
    }
    return apiClient.post('/employees', data).then(r => r.data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await delay(500);
      return { id, ...data };
    }
    return apiClient.put(`/employees/${id}`, data).then(r => r.data);
  },

  deactivate: async (id) => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true };
    }
    return apiClient.patch(`/employees/${id}/deactivate`).then(r => r.data);
  },
};

// ─── Departments ─────────────────────────────────────────────────

export const departmentApi = {
  getAll: async () => {
    if (USE_MOCK) {
      await delay(300);
      return DEPARTMENTS;
    }
    return apiClient.get('/departments').then(r => r.data);
  },
};
