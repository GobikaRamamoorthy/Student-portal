import client from './client';

export const authApi = {
  login: (email, password) => client.post('/auth/login', { email, password }).then((r) => r.data),
  me: () => client.get('/auth/me').then((r) => r.data),
};

export const studentApi = {
  profile: () => client.get('/students/me').then((r) => r.data),
  updateProfile: (patch) => client.put('/students/me', patch).then((r) => r.data),
  academics: () => client.get('/students/me/academics').then((r) => r.data),
  report: () => client.get('/students/me/report').then((r) => r.data),
};

export const requestApi = {
  list: (params) => client.get('/requests', { params }).then((r) => r.data),
  create: (payload) => client.post('/requests', payload).then((r) => r.data),
  resolve: (id, action) => client.patch(`/requests/${id}`, { action }).then((r) => r.data),
};

export const placementApi = {
  list: () => client.get('/placements').then((r) => r.data),
};

export const adminApi = {
  stats: () => client.get('/admin/stats').then((r) => r.data),
  searchStudents: (q) => client.get('/admin/students', { params: { q } }).then((r) => r.data),
  studentReport: (id) => client.get(`/admin/students/${id}`).then((r) => r.data),
};
