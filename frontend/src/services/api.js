import axios from 'axios';
import API_URL from '../config/Api.js';


const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite refresh token loops
let isRefreshing = false;
let failedQueue = [];

// Queue requests while token is being refreshed
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response Interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and not already a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry the original request with new cookies
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        await axios.post(`${API_URL}/api/auth/refresh`, {}, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // New cookies are automatically set by the server
        // Process any queued requests
        processQueue(null);
        
        // Retry the original request with new cookies (sent automatically via withCredentials)
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed - redirect to login
        processQueue(refreshError, null);
        
        // Clear any stored tokens
        if (typeof window !== 'undefined') {
          // Redirect to appropriate login page based on user type
          const isPartner = window.location.pathname.includes('partner');
          const currentPath = window.location.pathname;
          const loginPath = isPartner ? '/partner/login' : '/user/login';
          
          if (currentPath !== loginPath && currentPath !== '/') {
            window.location.href = loginPath;
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// User Authentication APIs
export const userAPI = {
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/users/register', userData);
    return response.data;
  },

  login: async (userData) => {
    const response = await apiClient.post('/api/auth/users/login', userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/api/auth/users/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/auth/users/profile');
    return response.data;
  },
};

// Partner Authentication APIs
export const partnerAPI = {
  register: async (partnerData) => {
    const response = await apiClient.post('/api/auth/partners/register', partnerData);
    return response.data;
  },

  login: async (partnerData) => {
    const response = await apiClient.post('/api/auth/partners/login', partnerData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/api/auth/partners/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/api/auth/partners/profile');
    return response.data;
  },
};

// Auth check API
export const authAPI = {
  checkAuth: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};

export const foodAPI = {
  getAllFoods:async(param)=>{
    const response = await apiClient.get('/api/foods?'+param.toString());
    return response.data;
  }
}

export const profileAPI = {
  getMe: async () => {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  },

  updateMe: async (payload) => {
    const response = await apiClient.patch('/api/users/me', payload);
    return response.data;
  },
};

export default apiClient;

export const useractions = {
  likeFood: async (foodId) => {
    const response = await apiClient.post(`/api/foods/like`, { foodId });
    return response.data;
  },

  saveFood: async (foodId) => {
    const response = await apiClient.post(`/api/foods/save`, { foodId });
    return response.data;
  }
}
