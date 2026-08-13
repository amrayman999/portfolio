import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
  return res.data.url;
};

export default api;