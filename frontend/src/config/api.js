const envApiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;

// Never default to localhost in production builds.
const API_URL = envApiUrl || (isDev ? 'http://localhost:5000/api' : '/api');

export default API_URL; 