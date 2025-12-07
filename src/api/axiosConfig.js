import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3005/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Add a request interceptor to attach the Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
}, (error) => Promise.reject(error));

export default api;