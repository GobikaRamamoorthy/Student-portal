import axios from 'axios';

const TOKEN_KEY = 'zenstud.token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the bearer token to every request when present.
client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors into a friendly message and auto-logout on 401.
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401 && tokenStore.get()) {
      tokenStore.clear();
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject({ status, message, details: error.response?.data?.details });
  }
);

export default client;
