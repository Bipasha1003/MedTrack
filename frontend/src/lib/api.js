import axios from 'axios';

// This creates a pre-configured axios instance
// Every request automatically goes to your backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// This runs before EVERY request automatically
// It adds the login token to every request header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;