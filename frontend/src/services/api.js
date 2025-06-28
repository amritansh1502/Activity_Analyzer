import axios from 'axios';

const baseURL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

const API = axios.create({
  baseURL: baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api',
});

// Add a request interceptor to include auth token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const pingServer = () => API.get('/');

export default API;
