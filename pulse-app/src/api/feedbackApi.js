// src/api/feedbackApi.js
import apiClient from './axios';
import { FEEDBACK } from '../data/feedbackMock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const feedbackApi = {
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(400);
      let data = [...FEEDBACK];
      if (filters.employeeId) data = data.filter(f => f.employeeId === Number(filters.employeeId));
      if (filters.type) data = data.filter(f => f.type === filters.type);
      if (filters.quarter) data = data.filter(f => f.quarter === filters.quarter);
      return data;
    }
    return apiClient.get('/feedback', { params: filters }).then(r => r.data);
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const fb = FEEDBACK.find(f => f.id === Number(id));
      if (!fb) throw new Error('Feedback not found');
      return fb;
    }
    return apiClient.get(`/feedback/${id}`).then(r => r.data);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay(700);
      return { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] };
    }
    return apiClient.post('/feedback', data).then(r => r.data);
  },
};

// src/api/reviewApi.js — exported inline here for convenience
export { reviewApi } from './reviewApi';
