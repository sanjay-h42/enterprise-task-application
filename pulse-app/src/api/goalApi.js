// src/api/goalApi.js
import apiClient from './axios';
import { GOALS } from '../data/goalMock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const goalApi = {
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...GOALS];
      if (filters.employeeId) data = data.filter(g => g.employeeId === Number(filters.employeeId));
      if (filters.status) data = data.filter(g => g.status === filters.status);
      if (filters.priority) data = data.filter(g => g.priority === filters.priority);
      if (filters.department) data = data.filter(g => g.department === filters.department);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        data = data.filter(g => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
      }
      return data;
    }
    return apiClient.get('/goals', { params: filters }).then(r => r.data);
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const goal = GOALS.find(g => g.id === Number(id));
      if (!goal) throw new Error('Goal not found');
      return goal;
    }
    return apiClient.get(`/goals/${id}`).then(r => r.data);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay(600);
      return { ...data, id: Date.now(), progress: 0, status: 'IN_PROGRESS' };
    }
    return apiClient.post('/goals', data).then(r => r.data);
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await delay(500);
      return { id, ...data };
    }
    return apiClient.put(`/goals/${id}`, data).then(r => r.data);
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await delay(400);
      return { success: true };
    }
    return apiClient.delete(`/goals/${id}`).then(r => r.data);
  },
};
