import axios from 'axios';
import { getApiUrl } from './apiConfig';

const axiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: request interceptor to include token if using auth
axiosInstance.interceptors.request.use(
  (config) => {
    // Update baseURL dynamically in case window.location changes (e.g., network access)
    const apiUrl = getApiUrl();
    if (apiUrl) {
      config.baseURL = apiUrl;
    }

    const token = sessionStorage.getItem('token'); // or sessionStorage / Redux
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios INSTANCE error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
