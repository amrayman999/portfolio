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

export default api;