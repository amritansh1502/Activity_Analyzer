import axios from 'axios';

let baseURL = import.meta.env.VITE_API_BASE_URL;


if (!baseURL) {
  baseURL = 'http://localhost:8000/api';
} else if (!baseURL.endsWith('/api')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}

const API = axios.create({
  baseURL: baseURL,
});
console.log('API baseURL:', baseURL);


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
