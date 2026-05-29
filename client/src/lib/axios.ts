import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

// Response interceptor for error handling globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We can add global toast notifications here later
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
