import api from './axios';

export const getBusinesses = (params = {}) =>
  api.get('/api/businesses', { params }).then(r => r.data);

export const getBusiness = (id) =>
  api.get(`/api/businesses/${id}`).then(r => r.data);

export const reviewBusiness = (id, data) =>
  api.post(`/api/businesses/${id}/review`, data).then(r => r.data);
