import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
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
