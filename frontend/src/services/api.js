import axios from 'axios';

// Base API URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User Authentication APIs
export const userAPI = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/api/auth/user/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/user/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/api/auth/user/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/auth/user/profile');
    return response.data;
  },
};

// Partner Authentication APIs
export const partnerAPI = {
  register: async (restaurantName, ownerName, email, phone, password) => {
    const response = await apiClient.post('/api/auth/partner/register', {
      restaurantName,
      ownerName,
      email,
      phone,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/partner/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/api/auth/partner/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/auth/partner/profile');
    return response.data;
  },
};

export default apiClient;
