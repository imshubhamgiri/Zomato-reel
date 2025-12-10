import axios from 'axios';
import API_URL from '../config/Api.js';


const apiClient = axios.create({
  baseURL: API_URL,
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
  register: async (data) => {
    const response = await apiClient.post('/api/auth/partner/register', data);
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

// Auth check API
export const authAPI = {
  checkAuth: async () => {
    const response = await apiClient.get('/api/auth/loginCheck');
    return response.data;
  },
};

export default apiClient;
