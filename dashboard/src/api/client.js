import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL || '/api',
});

/**
 * Resolve backend-relative asset paths (e.g. "/uploads/x.svg") to absolute
 * URLs when deployed separately from the backend. No-op in dev (API_URL empty).
 */
function resolveAssets(value) {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/') && API_URL) return `${API_URL}${value}`;
    return value;
  }
  if (Array.isArray(value)) return value.map(resolveAssets);
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = resolveAssets(value[key]);
  }
  return value;
}

api.interceptors.response.use((res) => {
  res.data = resolveAssets(res.data);
  return res;
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/dashboard')) {
        window.location.href = '/dashboard/login';
      }
    }
    return Promise.reject(err);
  }
);

export const uploadFile = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post('/admin/upload', form);
  // Interceptor turned the response URL absolute; store the relative path.
  return res.data.url.replace(/^https?:\/\/[^/]+/, '');
};

export default api;