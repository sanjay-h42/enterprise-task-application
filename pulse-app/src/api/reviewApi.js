// src/api/reviewApi.js
import apiClient from './axios';
import { REVIEW_CYCLES, PERFORMANCE_REVIEWS } from '../data/reviewMock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reviewApi = {
  getCycles: async () => {
    if (USE_MOCK) {
      await delay(350);
      return REVIEW_CYCLES;
    }
    return apiClient.get('/review-cycles').then(r => r.data);
  },

  getReviews: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(450);
      let data = [...PERFORMANCE_REVIEWS];
      if (filters.cycleId) data = data.filter(r => r.cycleId === Number(filters.cycleId));
      if (filters.employeeId) data = data.filter(r => r.employeeId === Number(filters.employeeId));
      if (filters.status) data = data.filter(r => r.status === filters.status);
      return data;
    }
    return apiClient.get('/performance-reviews', { params: filters }).then(r => r.data);
  },

  getReviewById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const review = PERFORMANCE_REVIEWS.find(r => r.id === Number(id));
      if (!review) throw new Error('Review not found');
      return review;
    }
    return apiClient.get(`/performance-reviews/${id}`).then(r => r.data);
  },

  submit: async (id) => {
    if (USE_MOCK) {
      await delay(600);
      return { id, status: 'SUBMITTED', submittedAt: new Date().toISOString() };
    }
    return apiClient.patch(`/performance-reviews/${id}/submit`).then(r => r.data);
  },

  approve: async (id) => {
    if (USE_MOCK) {
      await delay(600);
      return { id, status: 'APPROVED' };
    }
    return apiClient.patch(`/performance-reviews/${id}/approve`).then(r => r.data);
  },
};
