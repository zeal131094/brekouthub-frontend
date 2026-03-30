import api from './axios';

export const getAthletes = (params = {}) =>
  api.get('/api/recruitment/athletes', { params }).then(r => r.data);

export const toggleWatchlist = (athleteId) =>
  api.post(`/api/recruitment/watchlist/${athleteId}`).then(r => r.data);

export const getWatchlist = () =>
  api.get('/api/recruitment/watchlist').then(r => r.data);

export const getRecruiterUpdates = () =>
  api.get('/api/recruitment/updates').then(r => r.data);
